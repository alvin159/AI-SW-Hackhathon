import pandas as pd
import numpy as np
import json
import random

# Base annual crop data (1990 to 2024 with a few sample points)
data = [
    {"year": 1990, "Wheat": 0.15, "Barley": 0.12, "Oats": 0.14, "Rye": 0.1, "Potatoes": 0.2},
    {"year": 1995, "Wheat": 0.165, "Barley": 0.136, "Oats": 0.155, "Rye": 0.12, "Potatoes": 0.228},
    {"year": 2000, "Wheat": 0.18, "Barley": 0.15, "Oats": 0.17, "Rye": 0.14, "Potatoes": 0.25},
    {"year": 2010, "Wheat": 0.21, "Barley": 0.18, "Oats": 0.2, "Rye": 0.17, "Potatoes": 0.29},
    {"year": 2020, "Wheat": 0.22, "Barley": 0.19, "Oats": 0.25, "Rye": 0.20, "Potatoes": 0.3},
    {"year": 2024, "Wheat": 0.35, "Barley": 0.31, "Oats": 0.32, "Rye": 0.31, "Potatoes": 0.31},
]

# Interpolate missing years for consistent data
years = range(1990, 2025)
df = pd.DataFrame(data)
df = df.set_index("year").reindex(years).interpolate().reset_index()

# Initialize an empty list for monthly JSON data
monthly_data = []

# Generate monthly data with slight randomness for realism
for i in range(len(df) - 1):
    start_row = df.iloc[i]
    end_row = df.iloc[i + 1]
    for month in range(1, 13):
        month_data = {
            "Year": int(start_row["year"]),
            "Month": month,
            "Wheat": round(
                np.interp(month, range(1, 13), np.linspace(start_row["Wheat"], end_row["Wheat"], 12))
                + random.uniform(-0.005, 0.005),  # Add slight randomness
                3,
            ),
            "Barley": round(
                np.interp(month, range(1, 13), np.linspace(start_row["Barley"], end_row["Barley"], 12))
                + random.uniform(-0.005, 0.005),
                3,
            ),
            "Oats": round(
                np.interp(month, range(1, 13), np.linspace(start_row["Oats"], end_row["Oats"], 12))
                + random.uniform(-0.005, 0.005),
                3,
            ),
            "Rye": round(
                np.interp(month, range(1, 13), np.linspace(start_row["Rye"], end_row["Rye"], 12))
                + random.uniform(-0.005, 0.005),
                3,
            ),
            "Potatoes": round(
                np.interp(month, range(1, 13), np.linspace(start_row["Potatoes"], end_row["Potatoes"], 12))
                + random.uniform(-0.005, 0.005),
                3,
            ),
        }
        monthly_data.append(month_data)

# Handle the last year's monthly data
last_row = df.iloc[-1]
for month in range(1, 13):
    last_month_data = {
        "Year": int(last_row["year"]),
        "Month": month,
        "Wheat": round(last_row["Wheat"] + random.uniform(-0.005, 0.005), 3),
        "Barley": round(last_row["Barley"] + random.uniform(-0.005, 0.005), 3),
        "Oats": round(last_row["Oats"] + random.uniform(-0.005, 0.005), 3),
        "Rye": round(last_row["Rye"] + random.uniform(-0.005, 0.005), 3),
        "Potatoes": round(last_row["Potatoes"] + random.uniform(-0.005, 0.005), 3),
    }
    monthly_data.append(last_month_data)

# Save to JSON file
with open("monthly_prices_1990_to_2024.json", "w") as json_file:
    json.dump(monthly_data, json_file, indent=4)

print("Monthly JSON data generated and saved to 'monthly_prices_1990_to_2024.json'.")
