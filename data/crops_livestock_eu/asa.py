import pandas as pd
import json

# Load the crops and livestock CSV data
crops_livestock_file_path = 'transformed_crops_livestock_eu_data.csv'
crops_livestock_data = pd.read_csv(crops_livestock_file_path)

# Normalize the data into JSON format
crops_livestock_json_data = crops_livestock_data.to_dict(orient='records')

# Save the JSON data to a file
crops_livestock_output_file = 'normalized_crops_livestock_data.json'
with open(crops_livestock_output_file, 'w') as json_file:
    json.dump(crops_livestock_json_data, json_file, indent=4)

print(f"Crops and Livestock data has been normalized and saved to {crops_livestock_output_file}")
