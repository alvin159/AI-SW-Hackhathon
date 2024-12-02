import pandas as pd
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import os
import getpass

# Load environment variables
load_dotenv()

# Get current system username
SYSTEM_USER = getpass.getuser()

# Use system username in connection string if not specified in DATABASE_URL
DATABASE_URL = os.getenv('DATABASE_URL', f'postgresql://{SYSTEM_USER}@localhost:5432/agri_db')

def create_database():
    """Create database and tables"""
    print(f"Creating database using connection: {DATABASE_URL}")
    
    # Connect to default postgres database first
    default_db_url = f'postgresql://{SYSTEM_USER}@localhost:5432/postgres'
    default_engine = create_engine(default_db_url)
    
    try:
        with default_engine.connect() as conn:
            conn.execute(text("COMMIT"))
            try:
                conn.execute(text("CREATE DATABASE agri_db"))
                print("Database created successfully!")
            except Exception as e:
                print(f"Note: {str(e)}")
                print("Continuing with existing database...")
    except Exception as e:
        print(f"Error connecting to PostgreSQL: {str(e)}")
        print("Please make sure PostgreSQL is running and the user is configured correctly.")
        raise

def setup_tables():
    """Create tables and load data"""
    print(f"Connecting to database: {DATABASE_URL}")
    engine = create_engine(DATABASE_URL)
    
    print("Loading data files...")
    
    # Load and process fertilizers data
    try:
        fertilizers_df = pd.read_csv('data/previews/fertilizers_preview.csv')
        fertilizers_df.to_sql('fertilizers', engine, if_exists='replace', index=False)
        print("Fertilizers data loaded successfully!")
    except Exception as e:
        print(f"Error loading fertilizers data: {str(e)}")
        raise
    
    # Load and process pesticides data
    try:
        pesticides_df = pd.read_csv('data/previews/pesticides_preview.csv')
        pesticides_df.to_sql('pesticides', engine, if_exists='replace', index=False)
        print("Pesticides data loaded successfully!")
    except Exception as e:
        print(f"Error loading pesticides data: {str(e)}")
        raise
    
    # Load and process crops/livestock data
    try:
        crops_df = pd.read_csv('data/previews/crops_livestock_preview.csv')
        crops_df.to_sql('crops', engine, if_exists='replace', index=False)
        print("Crops data loaded successfully!")
    except Exception as e:
        print(f"Error loading crops data: {str(e)}")
        raise

    print("Creating indices for better performance...")
    try:
        with engine.connect() as conn:
            conn.execute(text('CREATE INDEX IF NOT EXISTS idx_fert_year ON fertilizers("Year")'))
            conn.execute(text('CREATE INDEX IF NOT EXISTS idx_pest_year ON pesticides("Year")'))
            conn.execute(text('CREATE INDEX IF NOT EXISTS idx_crops_year ON crops("Year")'))
            conn.execute(text('COMMIT'))
        print("Indices created successfully!")
    except Exception as e:
        print(f"Error creating indices: {str(e)}")
        raise

if __name__ == "__main__":
    print("Starting database setup...")
    print(f"Current working directory: {os.getcwd()}")
    print(f"Using system user: {SYSTEM_USER}")
    
    # Check if data files exist
    data_files = [
        'data/previews/fertilizers_preview.csv',
        'data/previews/pesticides_preview.csv',
        'data/previews/crops_livestock_preview.csv'
    ]
    
    missing_files = []
    for file in data_files:
        if not os.path.exists(file):
            missing_files.append(file)
    
    if missing_files:
        print("Error: The following data files are missing:")
        for file in missing_files:
            print(f"  - {file}")
        raise FileNotFoundError("Required data files are missing")
    
    try:
        create_database()
        setup_tables()
        print("\nDatabase setup completed successfully!")
    except Exception as e:
        print(f"\nAn error occurred during setup: {str(e)}")
        print("\nTroubleshooting steps:")
        print("1. Make sure PostgreSQL is running:")
        print("   brew services list")
        print("   brew services start postgresql")
        print("2. Check if PostgreSQL user exists:")
        print(f"   createuser -s {SYSTEM_USER}")
        print("3. Verify data files are in the correct location")
        raise