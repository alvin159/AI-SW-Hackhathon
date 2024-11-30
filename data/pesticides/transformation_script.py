import pandas as pd

# Load the dataset
file_path = 'pesticides_1.csv'
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
# Only calculate for rows where both quantity and value are non-zero
pivoted_data["Import Price per Unit (USD/t)"] = (
    pivoted_data["Import value"] / pivoted_data["Import quantity"]
).replace([float('inf'), -float('inf')], 0)  # Handle division by zero

pivoted_data["Export Price per Unit (USD/t)"] = (
    pivoted_data["Export value"] / pivoted_data["Export quantity"]
).replace([float('inf'), -float('inf')], 0)

# Step 4: Separate pre- and post-1990 data
pre_1990_data = pivoted_data[pivoted_data["Year"] < 1990]
post_1990_data = pivoted_data[pivoted_data["Year"] >= 1990]

# Step 5: Save the transformed datasets for better clarity
pre_1990_output_path = 'eu_pre_1990_pesticides_data.csv'
post_1990_output_path = 'eu_post_1990_pesticides_data.csv'

pre_1990_data.to_csv(pre_1990_output_path, index=False)
post_1990_data.to_csv(post_1990_output_path, index=False)

print(f"Pre-1990 data saved at: {pre_1990_output_path}")
print(f"Post-1990 data saved at: {post_1990_output_path}")
