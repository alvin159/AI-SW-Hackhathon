from dotenv import load_dotenv
import os
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from sqlalchemy import create_engine, text
import pandas as pd
import requests
from datetime import datetime, timedelta
from typing import Dict, Any, List
import plotly.express as px
import json
import getpass

class FarmingInsightsSystem:
    def __init__(self):
        load_dotenv()
        print("Initializing Farming Insights System...")
        
        # Database connection
        self.SYSTEM_USER = os.getenv('USER', getpass.getuser())
        self.DATABASE_URL = os.getenv('DATABASE_URL', f'postgresql://{self.SYSTEM_USER}@localhost:5432/agri_db')
        self.engine = create_engine(self.DATABASE_URL)
        
        # OpenWeather API setup
        self.weather_api_key = os.getenv('OPENWEATHER_API_KEY')
        self.weather_base_url = "http://api.openweathermap.org/data/2.5"
        
        # LLM setup
        self.llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

    def analyze_question(self, question: str) -> Dict[str, Any]:
        """Step 1: Analyze the question using LLM to determine data needs"""
        print("\nSTEP 1: Analyzing question...")
        print(f"Input question: {question}")
        
        prompt = f"""Given this question: "{question}"
        
        Determine:
        1. What data we need from our database (fertilizers, pesticides, or crops tables)
        2. What time period we should analyze
        3. What SQL query we should use
        4. If we need weather data
        
        Respond in this exact format:
        {{
            "data_sources": ["fertilizers", "pesticides", or "crops"],
            "time_period": "start_year-end_year",
            "sql_query": "THE FULL SQL QUERY",
            "weather_needed": true/false,
            "locations": ["list of relevant locations"],
            "explanation": "explanation of the analysis plan"
        }}"""
        
        try:
            print("Sending question to GPT-4-mini for analysis...")
            response = self.llm.invoke(prompt)
            analysis = json.loads(response.content)
            print("Analysis received:")
            print(json.dumps(analysis, indent=2))
            return analysis
            
        except Exception as e:
            print(f"Error in question analysis: {str(e)}")
            print(f"Raw GPT response: {response.content if 'response' in locals() else 'No response'}")
            raise

    def get_historical_data(self, analysis: Dict) -> pd.DataFrame:
        """Step 2: Query database based on analysis"""
        print("\nSTEP 2: Querying database...")
        print(f"Executing SQL query: {analysis['sql_query']}")
        
        try:
            data = pd.read_sql_query(text(analysis['sql_query']), self.engine)
            print(f"Data retrieved: {len(data)} rows")
            print("Sample data:")
            print(data.head())
            return data
        except Exception as e:
            print(f"Database query error: {str(e)}")
            return pd.DataFrame()

    def get_weather_data(self, locations: List[str]) -> Dict:
        """Step 3: Get weather data if needed"""
        print("\nSTEP 3: Fetching weather data...")
        weather_data = {}
        
        for location in locations:
            print(f"Fetching weather data for {location}...")
            try:
                params = {
                    'q': location,
                    'appid': self.weather_api_key,
                    'units': 'metric'
                }
                response = requests.get(f"{self.weather_base_url}/weather", params=params)
                weather_data[location] = response.json()
                print(f"Weather data retrieved for {location}")
            except Exception as e:
                print(f"Weather API error for {location}: {str(e)}")
        
        return weather_data

    def generate_insights(self, question: str, historical_data: pd.DataFrame, weather_data: Dict) -> str:
        """Step 4: Generate insights using LLM"""
        print("\nSTEP 4: Generating insights...")
        
        prompt = f"""Based on this data:
        
        Historical Data:
        {historical_data.to_string() if not historical_data.empty else "No historical data available"}
        
        Weather Data:
        {json.dumps(weather_data, indent=2) if weather_data else "No weather data available"}
        
        Answer this question: "{question}"
        
        Provide:
        1. Analysis of the data
        2. Clear recommendations
        3. Specific numbers and trends
        4. Practical advice for farmers
        """
        
        try:
            print("Sending data to GPT-4-mini for insights...")
            response = self.llm.invoke(prompt)
            print("Insights received from GPT")
            return response.content
        except Exception as e:
            print(f"Error generating insights: {str(e)}")
            raise

    def process_query(self, question: str) -> Dict[str, Any]:
        """Main processing function"""
        print(f"\nProcessing query: {question}")
        
        try:
            # Step 1: Analyze question
            analysis = self.analyze_question(question)
            
            # Step 2: Get historical data
            historical_data = self.get_historical_data(analysis)
            
            # Step 3: Get weather data if needed
            weather_data = {}
            if analysis.get('weather_needed'):
                weather_data = self.get_weather_data(analysis['locations'])
            
            # Step 4: Generate insights
            insights = self.generate_insights(question, historical_data, weather_data)
            
            print("\nQuery processing completed successfully!")
            return {
                "question": question,
                "analysis": analysis,
                "historical_data": historical_data.to_dict('records') if not historical_data.empty else [],
                "weather_data": weather_data,
                "insights": insights
            }
            
        except Exception as e:
            print(f"\nError processing query: {str(e)}")
            return {"error": str(e)}

def test_system():
    system = FarmingInsightsSystem()
    
    test_questions = [
        "Should I buy fertilizers now based on historical prices?",
        "How do pesticide prices change with rainfall in Europe?",
        "What's the best time to buy crop protection products?"
    ]
    
    for question in test_questions:
        print("\n" + "="*80)
        print(f"Testing question: {question}")
        print("="*80)
        
        result = system.process_query(question)
        
        if "error" in result:
            print(f"\nError encountered: {result['error']}")
        else:
            print("\nFinal Results:")
            print(f"Analysis Plan: {result['analysis']}")
            print(f"Data Points Analyzed: {len(result['historical_data'])}")
            print(f"Weather Data Collected: {'Yes' if result['weather_data'] else 'No'}")
            print("\nInsights:", result['insights'])

if __name__ == "__main__":
    test_system()