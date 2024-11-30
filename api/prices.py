from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from typing import List, Optional, Dict
from pydantic import BaseModel
from statistics import mean
import numpy as np

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load data with latin-1 encoding (now we know it works)
df = pd.read_csv('prices_data.csv', encoding='latin-1')

# Clean the data
df = df.rename(columns=lambda x: x.strip())
for col in df.select_dtypes(include=['object']).columns:
    df[col] = df[col].str.strip()

# Convert Year to int and Value to float
df['Year'] = pd.to_numeric(df['Year'], errors='coerce')
df['Value'] = pd.to_numeric(df['Value'], errors='coerce')

# Cache common values
PRODUCTS = sorted(df['Item'].unique().tolist())
AREAS = sorted(df['Area'].unique().tolist())
YEARS = sorted(df['Year'].dropna().astype(int).unique().tolist())
PRICE_TYPES = sorted(df['Element'].unique().tolist())

# Basic endpoints
@app.get("/api/products")
def get_products():
    """Get list of all available products"""
    return PRODUCTS

@app.get("/api/areas")
def get_areas():
    """Get list of all available areas"""
    return AREAS

@app.get("/api/years")
def get_years():
    """Get list of all available years"""
    return YEARS

# Enhanced endpoints for visualization
@app.get("/api/product-price-trends")
def get_product_price_trends(
    product: str,
    areas: Optional[List[str]] = Query(None),
    price_type: str = "Producer Price (LCU/tonne)",
    start_year: Optional[int] = None,
    end_year: Optional[int] = None
):
    """Get price trends for a product across multiple areas"""
    try:
        # Base filter
        mask = (df['Item'] == product) & (df['Element'] == price_type)
        
        if start_year:
            mask &= df['Year'] >= start_year
        if end_year:
            mask &= df['Year'] <= end_year
            
        filtered_df = df[mask]
        
        if areas:
            filtered_df = filtered_df[filtered_df['Area'].isin(areas)]
        
        # Group by Area and Year
        result = {}
        for area in filtered_df['Area'].unique():
            area_data = filtered_df[filtered_df['Area'] == area]
            result[area] = {
                'years': area_data['Year'].tolist(),
                'values': area_data['Value'].tolist(),
                'unit': area_data['Unit'].iloc[0] if not area_data['Unit'].isna().all() else None
            }
        
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/area-overview")
def get_area_overview(area: str):
    """Get overview of all products and their prices for a specific area"""
    try:
        area_data = df[df['Area'] == area]
        
        products_summary = {}
        for product in area_data['Item'].unique():
            product_data = area_data[area_data['Item'] == product]
            
            products_summary[product] = {
                'latest_year': int(product_data['Year'].max()),
                'earliest_year': int(product_data['Year'].min()),
                'price_types': product_data['Element'].unique().tolist(),
                'avg_price': float(product_data['Value'].mean()),
                'min_price': float(product_data['Value'].min()),
                'max_price': float(product_data['Value'].max())
            }
        
        return {
            'area': area,
            'products': products_summary
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/price-comparison")
def get_price_comparison(
    products: List[str] = Query(...),
    area: str = Query(...),
    year: Optional[int] = None,
    price_type: str = "Producer Price (LCU/tonne)"
):
    """Compare prices of multiple products for a specific area and year"""
    try:
        mask = (df['Area'] == area) & (df['Element'] == price_type)
        if year:
            mask &= df['Year'] == year
            
        filtered_df = df[mask]
        filtered_df = filtered_df[filtered_df['Item'].isin(products)]
        
        result = {}
        for product in products:
            product_data = filtered_df[filtered_df['Item'] == product]
            if not product_data.empty:
                result[product] = {
                    'years': product_data['Year'].tolist(),
                    'values': product_data['Value'].tolist(),
                    'unit': product_data['Unit'].iloc[0] if not product_data['Unit'].isna().all() else None
                }
        
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/time-series-analysis")
def get_time_series_analysis(
    product: str,
    area: str,
    price_type: str = "Producer Price (LCU/tonne)"
):
    """Get detailed time series analysis for a product in a specific area"""
    try:
        mask = (df['Item'] == product) & \
               (df['Area'] == area) & \
               (df['Element'] == price_type)
        
        data = df[mask].sort_values('Year')
        if data.empty:
            raise HTTPException(status_code=404, detail="No data found for the specified parameters")
        
        # Calculate year-over-year changes
        values = data['Value'].tolist()
        years = data['Year'].tolist()
        yoy_changes = [((values[i] - values[i-1])/values[i-1])*100 
                      for i in range(1, len(values))]
        
        return {
            'product': product,
            'area': area,
            'price_type': price_type,
            'time_series': {
                'years': years,
                'values': values,
                'unit': data['Unit'].iloc[0] if not data['Unit'].isna().all() else None
            },
            'analysis': {
                'min_price': float(min(values)),
                'max_price': float(max(values)),
                'avg_price': float(mean(values)),
                'total_change_percent': float(((values[-1] - values[0])/values[0])*100),
                'year_over_year_changes': yoy_changes
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)