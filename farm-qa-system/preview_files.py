import pandas as pd
import os

def create_preview_csv(input_file, output_file, num_rows=10):
    """
    Create a preview CSV file with a subset of rows from the input file.
    
    Args:
        input_file (str): Path to input CSV file
        output_file (str): Path to output preview CSV file
        num_rows (int): Number of rows to include in preview (default: 10)
    """
    try:
        # Read the CSV file
        df = pd.read_csv(input_file)
        
        # Get first and last rows
        preview_df = pd.concat([
            df.head(num_rows//2),  # First half of rows
            df.tail(num_rows//2)   # Last half of rows
        ])
        
        # Create output directory if it doesn't exist
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        
        # Save to new CSV
        preview_df.to_csv(output_file, index=False)
        print(f"Created preview file: {output_file}")
        
    except Exception as e:
        print(f"Error processing {input_file}: {str(e)}")

def main():
    # Define input files and their preview destinations
    files_to_preview = {
        'data/transformed_crops_livestock_eu_data.csv': 'data/previews/crops_livestock_preview.csv',
        'data/transformed_pesticides_data.csv': 'data/previews/pesticides_preview.csv',
        'data/transformed_fertilizers_data.csv': 'data/previews/fertilizers_preview.csv'
    }
    
    # Process each file
    for input_file, output_file in files_to_preview.items():
        create_preview_csv(input_file, output_file)

if __name__ == "__main__":
    main()