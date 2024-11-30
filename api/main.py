from flask import Flask, jsonify, request
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load and preprocess the CSV data
def load_data():
    """Load and preprocess the CSV data with explicit encoding"""
    try:
        # First try with utf-8
        df = pd.read_csv('prices_data.csv', encoding='utf-8')
    except UnicodeDecodeError:
        # If utf-8 fails, try with latin-1 (which can handle most special characters)
        df = pd.read_csv('prices_data.csv', encoding='latin-1')
    return df

# Initialize data
df = load_data()

@app.route('/api/countries', methods=['GET'])
def get_countries():
    """Get list of all countries"""
    countries = df['Area'].unique().tolist()
    return jsonify(countries)

@app.route('/api/country/<country>', methods=['GET'])
def get_country_data(country):
    """Get all data for a specific country"""
    country_data = df[df['Area'] == country].to_dict('records')
    return jsonify(country_data)

@app.route('/api/products', methods=['GET'])
def get_products():
    """Get list of all agricultural products"""
    products = df['Item'].unique().tolist()
    return jsonify(products)

@app.route('/api/country/<country>/product/<product>', methods=['GET'])
def get_product_data(country, product):
    """Get data for a specific product in a country"""
    product_data = df[(df['Area'] == country) & (df['Item'] == product)].to_dict('records')
    return jsonify(product_data)

@app.route('/api/prices', methods=['GET'])
def get_prices():
    """Get prices with optional filtering"""
    country = request.args.get('country')
    product = request.args.get('product')
    year = request.args.get('year')
    
    filtered_df = df.copy()
    
    if country:
        filtered_df = filtered_df[filtered_df['Area'] == country]
    if product:
        filtered_df = filtered_df[filtered_df['Item'] == product]
    if year:
        filtered_df = filtered_df[filtered_df['Year'] == int(year)]
        
    return jsonify(filtered_df.to_dict('records'))

@app.route('/api/overview', methods=['GET'])
def get_overview():
    """Get high-level overview of agricultural prices"""
    latest_year = df['Year'].max()
    
    overview = {
        'total_countries': len(df['Area'].unique()),
        'total_products': len(df['Item'].unique()),
        'year_range': f"{df['Year'].min()} - {df['Year'].max()}",
        'latest_year_summary': df[df['Year'] == latest_year]['Value'].describe().to_dict()
    }
    return jsonify(overview)

@app.route('/api/trends/<country>/<product>', methods=['GET'])
def get_price_trends(country, product):
    """Get price trends for a specific product in a country"""
    product_data = df[(df['Area'] == country) & 
                     (df['Item'] == product) &
                     (df['Element'].str.contains('Price'))].copy()
    
    if product_data.empty:
        return jsonify({'error': 'No data found for specified country and product'})
    
    # Calculate year-over-year changes
    product_data = product_data.sort_values('Year')
    product_data['YoY_Change'] = product_data['Value'].pct_change() * 100
    
    # Calculate simple moving average
    product_data['3Y_Moving_Avg'] = product_data['Value'].rolling(window=3).mean()
    
    # Basic trend analysis
    recent_trend = 'Increasing' if product_data['YoY_Change'].tail(3).mean() > 0 else 'Decreasing'
    
    # Calculate volatility
    volatility = product_data['YoY_Change'].std()
    
    analysis = {
        'price_history': product_data[['Year', 'Value', 'YoY_Change', '3Y_Moving_Avg']].to_dict('records'),
        'summary': {
            'current_price': float(product_data['Value'].iloc[-1]),
            'average_price': float(product_data['Value'].mean()),
            'recent_trend': recent_trend,
            'volatility': float(volatility),
            'max_price': float(product_data['Value'].max()),
            'min_price': float(product_data['Value'].min()),
        }
    }
    
    return jsonify(analysis)

@app.route('/api/compare-products', methods=['GET'])
def compare_products():
    """Compare price trends across different products"""
    country = request.args.get('country')
    products = request.args.getlist('products')  # Can pass multiple products
    
    if not country or not products:
        return jsonify({'error': 'Please specify country and products'})
    
    comparison_data = []
    for product in products:
        product_data = df[(df['Area'] == country) & 
                         (df['Item'] == product) &
                         (df['Element'].str.contains('Price'))]
        
        if not product_data.empty:
            avg_price = product_data['Value'].mean()
            price_change = product_data['Value'].pct_change().mean() * 100
            
            comparison_data.append({
                'product': product,
                'average_price': float(avg_price),
                'avg_yearly_change': float(price_change),
                'price_history': product_data[['Year', 'Value']].to_dict('records')
            })
    
    return jsonify(comparison_data)

@app.route('/api/market-insights/<country>', methods=['GET'])
def get_market_insights(country):
    """Get market insights for a country"""
    country_data = df[df['Area'] == country]
    
    if country_data.empty:
        return jsonify({'error': 'No data found for specified country'})
    
    # Get top products by price volatility
    volatility_by_product = country_data.groupby('Item')['Value'].agg(['std', 'mean'])
    volatility_by_product['cv'] = volatility_by_product['std'] / volatility_by_product['mean']
    volatile_products = volatility_by_product.nlargest(5, 'cv').index.tolist()
    
    # Get products with strongest price trends
    recent_data = country_data[country_data['Year'] >= country_data['Year'].max() - 5]
    trends = recent_data.groupby('Item')['Value'].apply(
        lambda x: (x.iloc[-1] - x.iloc[0]) / x.iloc[0] * 100 if len(x) > 1 else 0
    )
    trending_products = trends.nlargest(5).index.tolist()
    
    insights = {
        'volatile_products': volatile_products,
        'trending_products': trending_products,
        'market_summary': {
            'total_products': len(country_data['Item'].unique()),
            'latest_year': int(country_data['Year'].max()),
            'price_range': {
                'min': float(country_data['Value'].min()),
                'max': float(country_data['Value'].max())
            }
        }
    }
    
    return jsonify(insights)
if __name__ == '__main__':
    app.run(debug=True)