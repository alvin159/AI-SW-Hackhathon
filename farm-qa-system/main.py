# main.py

import pandas as pd
import numpy as np
from db_utils import DatabaseManager, WeatherManager
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
import plotly.express as px
import plotly.graph_objects as go
from typing import Dict, Any, List, Optional
import json
from datetime import datetime
import os
from dotenv import load_dotenv

class FarmingInsightsSystem:
    def __init__(self):
        load_dotenv()
        self.db = DatabaseManager()
        self.weather = WeatherManager()
        self.llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

    def analyze_question(self, question: str) -> Dict[str, Any]:
        """Analyze question with improved error handling"""
        try:
            system_prompt = f"""You are a database expert. Given this question: "{question}"
            and this database schema: {json.dumps(self.db.schema, indent=2)},
            generate a JSON response with these exact keys:
            {{
                "table": "fertilizers/pesticides/crops",
                "areas": ["specific areas to analyze"],
                "years": [start_year, end_year],
                "analysis_type": "price_trend/comparison/forecast",
                "weather_needed": true/false
            }}
            Response must be valid JSON only, no markdown or explanation."""

            response = self.llm.invoke(system_prompt)
            # Clean the response to ensure it's valid JSON
            cleaned_response = response.content.strip().strip('`').strip()
            if not cleaned_response:
                raise ValueError("Empty response from LLM")
                
            return json.loads(cleaned_response)
        except Exception as e:
            print(f"Question analysis error: {str(e)}")
            # Return a safe default
            return {
                "table": "fertilizers",
                "areas": self.db.get_valid_locations()[:2],
                "years": [2018, 2023],
                "analysis_type": "price_trend",
                "weather_needed": False
            }

    def get_data_for_analysis(self, analysis: Dict[str, Any]) -> pd.DataFrame:
        """Get data based on analysis with validation"""
        try:
            if not analysis.get("table") or not analysis.get("years"):
                raise ValueError("Invalid analysis parameters")

            data = self.db.get_price_data(
                table=analysis["table"],
                area=analysis["areas"][0] if analysis["areas"] else None,
                start_year=analysis["years"][0],
                end_year=analysis["years"][1]
            )

            if data.empty:
                print("Warning: No data retrieved")
            return data
        except Exception as e:
            print(f"Data retrieval error: {str(e)}")
            return pd.DataFrame()

    def create_visualization(self, data: pd.DataFrame, 
                           analysis_type: str) -> Optional[go.Figure]:
        """Create visualization with error handling"""
        if data.empty:
            return None

        try:
            if analysis_type == "price_trend":
                fig = go.Figure()
                fig.add_trace(go.Scatter(
                    x=data['Year'],
                    y=data['import_price'],
                    name='Import Price',
                    mode='lines+markers'
                ))
                fig.add_trace(go.Scatter(
                    x=data['Year'],
                    y=data['export_price'],
                    name='Export Price',
                    mode='lines+markers'
                ))
                fig.update_layout(
                    title='Price Trends Over Time',
                    xaxis_title='Year',
                    yaxis_title='Price (USD/t)'
                )
                return fig
        except Exception as e:
            print(f"Visualization error: {str(e)}")
            return None

    def generate_insights(self, question: str, data: pd.DataFrame, 
                         weather_data: Optional[Dict] = None) -> str:
        """Generate insights with validation"""
        try:
            prompt = f"""Based on this data:
            Historical Data: {data.to_string() if not data.empty else 'No historical data'}
            Weather Data: {json.dumps(weather_data) if weather_data else 'No weather data'}
            
            Answer this question: {question}
            
            Provide specific insights about:
            1. Price trends and patterns
            2. Recommendations for farmers
            3. Market conditions and outlook
            """

            response = self.llm.invoke(prompt)
            return response.content
        except Exception as e:
            print(f"Error generating insights: {str(e)}")
            return "Unable to generate insights. Please try again with a more specific question."

    def process_query(self, question: str) -> Dict[str, Any]:
        """Main processing function with comprehensive error handling"""
        print(f"\nProcessing query: {question}")
        
        try:
            # Step 1: Analyze question
            analysis = self.analyze_question(question)
            print("\nAnalysis plan:", json.dumps(analysis, indent=2))
            
            # Step 2: Get data
            data = self.get_data_for_analysis(analysis)
            print(f"\nRetrieved {len(data)} records")
            
            # Step 3: Get weather if needed
            weather_data = {}
            if analysis.get("weather_needed") and analysis.get("areas"):
                for area in analysis["areas"]:
                    weather_data[area] = self.weather.get_weather_data(area)
            
            # Step 4: Generate insights
            insights = self.generate_insights(question, data, weather_data)
            
            # Step 5: Create visualization
            viz = self.create_visualization(data, analysis.get("analysis_type", ""))
            
            return {
                "success": True,
                "question": question,
                "analysis": analysis,
                "data": data.to_dict('records') if not data.empty else [],
                "weather_data": weather_data,
                "insights": insights,
                "visualization": viz.to_json() if viz else None
            }
            
        except Exception as e:
            print(f"\nError processing query: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "question": question,
                "fallback_response": "I encountered an error processing your question. "
                                   "Please try asking about specific products, locations, "
                                   "or time periods."
            }

def test_system():
    system = FarmingInsightsSystem()
    
    test_questions = [
        "What are fertilizer prices like in Europe for the last 5 years?",
        "Compare pesticide prices between Albania and Europe",
        "Should I buy fertilizers now based on historical trends?",
        "What's the best time to buy crop protection products?"
    ]
    
    for question in test_questions:
        print("\n" + "="*80)
        print(f"Testing question: {question}")
        print("="*80)
        
        result = system.process_query(question)
        
        if not result.get("success"):
            print(f"\nError encountered: {result.get('error')}")
            print(f"Fallback response: {result.get('fallback_response')}")
        else:
            print("\nAnalysis Plan:", json.dumps(result["analysis"], indent=2))
            print("\nInsights:", result["insights"])
            
            if result.get("visualization"):
                print("\nVisualization available!")
                fig = go.Figure(json.loads(result["visualization"]))
                fig.write_html(f"viz_{hash(question)}.html")

if __name__ == "__main__":
    test_system()