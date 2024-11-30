import pandas as pd

# Load the dataset
file_path = 'fertilizer.csv'  # Replace with your local file path
data = pd.read_csv(file_path)

# Step 1: Filter relevant columns
columns_to_keep = ["Area", "Item", "Year", "Element", "Value", "Unit"]
filtered_data = data[columns_to_keep]

# Step 2: Pivot the data
pivoted_data = filtered_data.pivot_table(
    index=["Area", "Item", "Year"],
    columns="Element",
    values="Value",
    aggfunc="sum"
).reset_index()

# Step 3: Calculate Price per Unit
# Add derived columns for price per unit where quantities and values exist
pivoted_data["Import Price per Unit (USD/t)"] = (
    pivoted_data["Import value"] / pivoted_data["Import quantity"]
).replace([float('inf'), -float('inf')], 0)  # Handle division by zero

pivoted_data["Export Price per Unit (USD/t)"] = (
    pivoted_data["Export value"] / pivoted_data["Export quantity"]
).replace([float('inf'), -float('inf')], 0)

# Step 4: Handle missing or zero values
pivoted_data.fillna(0, inplace=True)

# Step 5: Save the transformed dataset
output_path = 'transformed_fertilizers_data.csv'  # Specify your output file path
pivoted_data.to_csv(output_path, index=False)

print(f"Transformed dataset saved at: {output_path}")
