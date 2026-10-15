"""
Traffic Accident Dataset Generator
Generates realistic multi-factor historical traffic dataset for model training
Based on WHO Global Status Report on Road Safety and ITS empirical parameters
"""

import numpy as np
import pandas as pd
import random

np.random.seed(42)
random.seed(42)

NUM_SAMPLES = 5000

weather_conditions = ['Clear', 'Rain', 'Heavy Rain', 'Fog', 'Snow', 'Storm']
weather_weights = [0.55, 0.20, 0.08, 0.07, 0.06, 0.04]

road_surfaces = ['Dry', 'Wet', 'Slippery/Ice', 'Construction']
road_surface_weights = [0.60, 0.25, 0.08, 0.07]

road_types = ['Highway', 'Arterial', 'Intersection', 'Residential', 'Rural']
road_type_weights = [0.28, 0.32, 0.22, 0.10, 0.08]

times_of_day = ['Morning Peak', 'Afternoon Peak', 'Night', 'Off-Peak']
time_weights = [0.28, 0.30, 0.18, 0.24]

lightings = ['Daylight', 'Dusk/Dawn', 'Dark lit', 'Dark unlit']
lighting_weights = [0.60, 0.14, 0.16, 0.10]

data = []

for _ in range(NUM_SAMPLES):
    weather = np.random.choice(weather_conditions, p=weather_weights)
    road_surface = np.random.choice(road_surfaces, p=road_surface_weights)
    road_type = np.random.choice(road_types, p=road_type_weights)
    time_of_day = np.random.choice(times_of_day, p=time_weights)
    lighting = np.random.choice(lightings, p=lighting_weights)
    
    speed_limit = random.choice([40, 50, 60, 80, 100])
    # Average speed normally distributed around speed limit
    average_speed = int(np.clip(np.random.normal(loc=speed_limit * 0.95, scale=18), 15, 140))
    
    # Traffic density (0-100%)
    if time_of_day in ['Morning Peak', 'Afternoon Peak']:
        traffic_density = int(np.clip(np.random.normal(loc=72, scale=16), 10, 100))
    else:
        traffic_density = int(np.clip(np.random.normal(loc=38, scale=18), 5, 95))
        
    historical_risk_index = int(np.clip(np.random.normal(loc=48, scale=20), 0, 100))
    
    # Latent accident probability calculation
    score = 0.20
    
    # Speed risk
    speed_excess = average_speed - speed_limit
    if speed_excess > 0:
        score += (speed_excess / 40.0) * 0.32
    elif speed_excess < -25 and traffic_density > 75:
        score += 0.14 # Stop-and-go rear end hazard
        
    # Weather and Surface
    if weather in ['Heavy Rain', 'Storm']: score += 0.22
    elif weather in ['Rain', 'Fog']: score += 0.14
    elif weather == 'Snow': score += 0.25
    
    if road_surface == 'Slippery/Ice': score += 0.24
    elif road_surface == 'Wet': score += 0.12
    elif road_surface == 'Construction': score += 0.16
    
    # Road type
    if road_type == 'Intersection': score += 0.18
    elif road_type == 'Rural': score += 0.10
    
    # Lighting
    if lighting == 'Dark unlit': score += 0.20
    elif lighting == 'Dusk/Dawn': score += 0.06
    
    # History
    score += (historical_risk_index - 50) / 100.0 * 0.20
    
    # Noise
    score += np.random.normal(0, 0.05)
    
    # Probability thresholding
    accident_occurred = 1 if score > 0.48 else 0
    
    # Severity classification: 0: No Accident/Low, 1: Moderate, 2: High, 3: Severe
    if accident_occurred == 0:
        severity = 0 if score < 0.28 else 1
    else:
        severity = 3 if score > 0.75 else 2
        
    data.append({
        'traffic_density': traffic_density,
        'average_speed': average_speed,
        'speed_limit': speed_limit,
        'weather': weather,
        'road_surface': road_surface,
        'road_type': road_type,
        'time_of_day': time_of_day,
        'lighting': lighting,
        'historical_risk_index': historical_risk_index,
        'accident_occurred': accident_occurred,
        'severity_level': severity
    })

df = pd.DataFrame(data)
df.to_csv('c:/Users/mamoo/OneDrive/Desktop/smart traffic prediction/ml_service/traffic_accidents.csv', index=False)
print(f"Generated {NUM_SAMPLES} records in traffic_accidents.csv")
print(f"Accident rate: {(df['accident_occurred'].mean() * 100):.2f}%")
