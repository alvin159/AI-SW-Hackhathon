import pandas as pd
import json

# Load the fertilizers CSV data
fertilizers_file_path = 'transformed_fertilizers_data.csv'
fertilizers_data = pd.read_csv(fertilizers_file_path)

# Normalize the data into JSON format
fertilizers_json_data = fertilizers_data.to_dict(orient='records')

# Save the JSON data to a file
fertilizers_output_file = 'normalized_fertilizers_data.json'
with open(fertilizers_output_file, 'w') as json_file:
    json.dump(fertilizers_json_data, json_file, indent=4)

print(f"Fertilizers data has been normalized and saved to {fertilizers_output_file}")
