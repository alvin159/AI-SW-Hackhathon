import pandas as pd

# Load the dataset
file_path = 'crops_livestock_eu.csv'
data = pd.read_csv(file_path)

# Step 1: Filter relevant columns
columns_to_keep = ["Area", "Item", "Year", "Element", "Value", "Unit"]
filtered_data = data[columns_to_keep]

# Step 2: Pivot data for easier analysis
# Separate Import and Export values
pivoted_data = filtered_data.pivot_table(
    index=["Area", "Item", "Year"],
    columns="Element",
    values="Value",
    aggfunc="sum"
).reset_index()

# Step 3: Calculate Price per Unit
# Only calculate for rows where both quantity and value are available
pivoted_data["Price per Unit (USD/t)"] = pivoted_data["Export Value"] / pivoted_data["Export Quantity"]

# Step 4: Clean up and categorize products
# Fill missing values with 0 for simplicity
pivoted_data.fillna(0, inplace=True)

# Add a "Category" column based on the product type
def categorize_item(item):
    if "wheat" in item.lower() or "barley" in item.lower():
        return "Grain"
    elif "meat" in item.lower() or "poultry" in item.lower():
        return "Livestock"
    else:
        return "Other"

pivoted_data["Category"] = pivoted_data["Item"].apply(categorize_item)

# Save the transformed dataset
output_path = 'transformed_crops_livestock_eu_data.csv'
pivoted_data.to_csv(output_path, index=False)

print(f"Transformed dataset saved at: {output_path}")
