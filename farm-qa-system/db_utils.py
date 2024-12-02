    # db_utils.py

import pandas as pd
import numpy as np
from dotenv import load_dotenv
import os
from sqlalchemy import create_engine, text
import getpass
from typing import Dict, Any, List, Optional, Tuple
import json
import requests
from datetime import datetime

class DatabaseManager:
    def __init__(self):
        load_dotenv()
        # Database schema definition
        self.schema = {
            "fertilizers": {
                "columns": [
                    "Area", "Item", "Year", "Export quantity", "Export value",
                    "Import quantity", "Import value",
                    "Import Price per Unit (USD/t)", "Export Price per Unit (USD/t)"
                ]
            },
            "pesticides": {
                "columns": [
                    "Area", "Item", "Year", "Export quantity", "Export value",
                    "Import quantity", "Import value",
                    "Import Price per Unit (USD/t)", "Export Price per Unit (USD/t)"
                ]
            },
            "crops": {
                "columns": [
                    "Area", "Item", "Year", "Export Quantity", "Export Value",
                    "Import Quantity", "Import Value", "Price per Unit (USD/t)",
                    "Category"
                ]
            }
        }
        
        # Setup database connection
        self.SYSTEM_USER = os.getenv('USER', getpass.getuser())
        self.DATABASE_URL = os.getenv('DATABASE_URL', 
                                    f'postgresql://{self.SYSTEM_USER}@localhost:5432/agri_db')
        self.engine = create_engine(self.DATABASE_URL)

    def get_valid_locations(self) -> List[str]:
        """Get list of valid areas from the database"""
        try:
            query = text("""
                SELECT DISTINCT "Area" 
                FROM fertilizers 
                WHERE "Area" IS NOT NULL 
                ORDER BY "Area";
            """)
            result = pd.read_sql_query(query, self.engine)
            return result["Area"].tolist()
        except Exception as e:
            print(f"Error getting locations: {str(e)}")
            return []

    def execute_query(self, query: str, params: Optional[Dict] = None) -> pd.DataFrame:
        """Execute a SQL query with proper error handling"""
        try:
            print(f"Executing query: {query}")
            return pd.read_sql_query(text(query), self.engine, params=params)
        except Exception as e:
            print(f"Query execution error: {str(e)}")
            return pd.DataFrame()

    def get_price_data(self, table: str, area: Optional[str] = None, 
                      start_year: int = 2018, end_year: int = 2023) -> pd.DataFrame:
        """Get price data with proper parameter handling"""
        try:
            query = """
                SELECT 
                    "Year", 
                    "Area", 
                    "Item",
                    "Import Price per Unit (USD/t)" as import_price,
                    "Export Price per Unit (USD/t)" as export_price
                FROM :table
                WHERE "Year" BETWEEN :start_year AND :end_year
            """
            
            if area:
                query += ' AND "Area" = :area'
            
            query += ' ORDER BY "Year", "Area", "Item"'
            
            params = {
                "table": table,
                "start_year": start_year,
                "end_year": end_year,
                "area": area
            }
            
            return self.execute_query(query, params)
        except Exception as e:
            print(f"Error getting price data: {str(e)}")
            return pd.DataFrame()

class WeatherManager:
    def __init__(self):
        load_dotenv()
        self.api_key = os.getenv('OPENWEATHER_API_KEY')
        self.base_url = "http://api.openweathermap.org/data/2.5"

    def get_weather_data(self, location: str) -> Dict:
        """Get weather data with proper error handling"""
        try:
            params = {
                'q': location,
                'appid': self.api_key,
                'units': 'metric'
            }
            response = requests.get(f"{self.base_url}/weather", params=params)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Weather API error for {location}: {str(e)}")
            return {}