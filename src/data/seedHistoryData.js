/**
 * Baseline Seed Prediction History Data
 * Realistic multi-factor accident prediction logs across major corridors
 * Conforms directly to the Mongoose Prediction schema and client ML format
 */

export const INITIAL_PREDICTION_HISTORY = [
  {
    _id: 'pred_seed_001',
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(), // 18 mins ago
    modelUsed: 'Random Forest',
    inputs: {
      locationName: 'Integral University Corridor (Kursi Road)',
      trafficDensity: 86,
      averageSpeed: 78,
      speedLimit: 50,
      weather: 'Heavy Rain',
      roadSurface: 'Wet',
      roadType: 'Arterial',
      timeOfDay: 'Evening Peak',
      lighting: 'Dusk/Dawn',
      historicalRiskIndex: 82
    },
    prediction: {
      probability: 0.84,
      riskPercentage: 84,
      riskLevel: 'Severe',
      confidenceScore: 0.94
    },
    shapExplanation: {
      baseValue: 0.28,
      featureContributions: [
        { feature: 'averageSpeed', displayName: 'Average Speed (78 km/h)', value: 78, shapValue: 0.24, impact: 'High Risk' },
        { feature: 'speedExcess', displayName: 'Speed Over Limit (+28 km/h)', value: 28, shapValue: 0.21, impact: 'High Risk' },
        { feature: 'weather', displayName: 'Weather Condition (Heavy Rain)', value: 'Heavy Rain', shapValue: 0.18, impact: 'Moderate Risk' },
        { feature: 'trafficDensity', displayName: 'Traffic Density (86%)', value: 86, shapValue: 0.13, impact: 'Moderate Risk' }
      ]
    },
    limeExplanation: {
      intercept: 0.31,
      rules: [
        { rule: 'averageSpeed > 70 km/h', feature: 'averageSpeed', weight: 0.22, impact: 'Increases Risk' },
        { rule: 'weather == Heavy Rain AND roadSurface == Wet', feature: 'weather', weight: 0.19, impact: 'Increases Risk' }
      ],
      score: 0.91
    },
    recommendations: [
      { category: 'Immediate Enforcement', title: 'Deploy Interceptor Radar & Variable Speed Signage to 40 km/h', urgency: 'High' },
      { category: 'Infrastructure', title: 'Activate Kursi Road storm drainage pumping', urgency: 'Medium' }
    ],
    user: 'Mamoon Ahmed (Officer)'
  },
  {
    _id: 'pred_seed_002',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    modelUsed: 'Decision Tree',
    inputs: {
      locationName: 'Shaheed Path Outer Ring Highway',
      trafficDensity: 42,
      averageSpeed: 104,
      speedLimit: 80,
      weather: 'Dense Fog',
      roadSurface: 'Wet',
      roadType: 'Highway',
      timeOfDay: 'Night',
      lighting: 'Dark lit',
      historicalRiskIndex: 78
    },
    prediction: {
      probability: 0.81,
      riskPercentage: 81,
      riskLevel: 'Severe',
      confidenceScore: 0.91
    },
    shapExplanation: {
      baseValue: 0.28,
      featureContributions: [
        { feature: 'averageSpeed', displayName: 'Average Speed (104 km/h)', value: 104, shapValue: 0.26, impact: 'High Risk' },
        { feature: 'weather', displayName: 'Weather (Dense Fog)', value: 'Dense Fog', shapValue: 0.19, impact: 'High Risk' },
        { feature: 'lighting', displayName: 'Lighting (Dark lit)', value: 'Dark lit', shapValue: 0.08, impact: 'Moderate Risk' }
      ]
    },
    limeExplanation: {
      intercept: 0.29,
      rules: [
        { rule: 'averageSpeed > 90 AND weather == Dense Fog', feature: 'speed_fog', weight: 0.27, impact: 'Severe Hazard' }
      ],
      score: 0.88
    },
    recommendations: [
      { category: 'ITS Dispatch', title: 'Broadcast Fog Guidance Luminaires & VMS Warning', urgency: 'High' }
    ],
    user: 'Dr. Sarah Vance (ML Lead)'
  },
  {
    _id: 'pred_seed_003',
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    modelUsed: 'Random Forest',
    inputs: {
      locationName: 'Hazratganj Multi-way Intersection',
      trafficDensity: 74,
      averageSpeed: 46,
      speedLimit: 40,
      weather: 'Clear',
      roadSurface: 'Dry',
      roadType: 'Intersection',
      timeOfDay: 'Morning Peak',
      lighting: 'Daylight',
      historicalRiskIndex: 58
    },
    prediction: {
      probability: 0.62,
      riskPercentage: 62,
      riskLevel: 'High',
      confidenceScore: 0.93
    },
    shapExplanation: {
      baseValue: 0.28,
      featureContributions: [
        { feature: 'roadType', displayName: 'Intersection Conflict Geometry', value: 'Intersection', shapValue: 0.17, impact: 'High Risk' },
        { feature: 'trafficDensity', displayName: 'Traffic Density (74%)', value: 74, shapValue: 0.11, impact: 'Moderate Risk' },
        { feature: 'weather', displayName: 'Clear Sky (-8%)', value: 'Clear', shapValue: -0.08, impact: 'Mitigating' }
      ]
    },
    limeExplanation: {
      intercept: 0.28,
      rules: [
        { rule: 'roadType == Intersection AND trafficDensity > 70', feature: 'geometry', weight: 0.18, impact: 'Increases Risk' }
      ],
      score: 0.92
    },
    recommendations: [
      { category: 'Signal Optimization', title: 'Extend pedestrian all-red clearance interval by 3.5s', urgency: 'Medium' }
    ],
    user: 'Mamoon Ahmed (Officer)'
  },
  {
    _id: 'pred_seed_004',
    timestamp: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    modelUsed: 'Random Forest',
    inputs: {
      locationName: 'Park Circus 7-Point Rotary, Kolkata',
      trafficDensity: 79,
      averageSpeed: 52,
      speedLimit: 40,
      weather: 'Light Rain',
      roadSurface: 'Wet',
      roadType: 'Intersection',
      timeOfDay: 'Afternoon Peak',
      lighting: 'Daylight',
      historicalRiskIndex: 69
    },
    prediction: {
      probability: 0.68,
      riskPercentage: 68,
      riskLevel: 'High',
      confidenceScore: 0.92
    },
    shapExplanation: {
      baseValue: 0.28,
      featureContributions: [
        { feature: 'historicalRiskIndex', displayName: 'Historical Rotary Conflict Index', value: 69, shapValue: 0.16, impact: 'High Risk' },
        { feature: 'speedExcess', displayName: 'Speed Delta (+12 km/h)', value: 12, shapValue: 0.14, impact: 'Moderate Risk' }
      ]
    },
    limeExplanation: {
      intercept: 0.30,
      rules: [
        { rule: 'rotary_weaving == True', feature: 'weaving', weight: 0.15, impact: 'Increases Risk' }
      ],
      score: 0.90
    },
    recommendations: [
      { category: 'Traffic Marshaling', title: 'Activate dynamic lane merging barriers at Flyover entry', urgency: 'High' }
    ],
    user: 'Mamoon Ahmed (Officer)'
  },
  {
    _id: 'pred_seed_005',
    timestamp: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
    modelUsed: 'Decision Tree',
    inputs: {
      locationName: 'Silk Board Junction, Bengaluru',
      trafficDensity: 91,
      averageSpeed: 22,
      speedLimit: 50,
      weather: 'Clear',
      roadSurface: 'Dry',
      roadType: 'Intersection',
      timeOfDay: 'Morning Peak',
      lighting: 'Daylight',
      historicalRiskIndex: 64
    },
    prediction: {
      probability: 0.51,
      riskPercentage: 51,
      riskLevel: 'Moderate',
      confidenceScore: 0.89
    },
    shapExplanation: {
      baseValue: 0.28,
      featureContributions: [
        { feature: 'trafficDensity', displayName: 'Extreme Gridlock (91%)', value: 91, shapValue: 0.19, impact: 'Rear-end Risk' },
        { feature: 'averageSpeed', displayName: 'Low Velocity (22 km/h)', value: 22, shapValue: -0.15, impact: 'Mitigating Severity' }
      ]
    },
    limeExplanation: {
      intercept: 0.28,
      rules: [
        { rule: 'trafficDensity > 85 AND speed < 30', feature: 'stop_go', weight: 0.14, impact: 'Minor Fender Collision' }
      ],
      score: 0.87
    },
    recommendations: [
      { category: 'Adaptive Signals', title: 'Prioritize Hosur Road arterial green wave phase', urgency: 'Medium' }
    ],
    user: 'Dr. Sarah Vance (ML Lead)'
  },
  {
    _id: 'pred_seed_006',
    timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    modelUsed: 'Random Forest',
    inputs: {
      locationName: 'Noida-Greater Noida Expressway (km 14)',
      trafficDensity: 36,
      averageSpeed: 64,
      speedLimit: 100,
      weather: 'Clear',
      roadSurface: 'Dry',
      roadType: 'Highway',
      timeOfDay: 'Off-Peak',
      lighting: 'Daylight',
      historicalRiskIndex: 28
    },
    prediction: {
      probability: 0.19,
      riskPercentage: 19,
      riskLevel: 'Low',
      confidenceScore: 0.96
    },
    shapExplanation: {
      baseValue: 0.28,
      featureContributions: [
        { feature: 'weather', displayName: 'Optimal Atmospheric Clarity', value: 'Clear', shapValue: -0.11, impact: 'Mitigating' },
        { feature: 'averageSpeed', displayName: 'Strict Speed Compliance', value: 64, shapValue: -0.09, impact: 'Mitigating' }
      ]
    },
    limeExplanation: {
      intercept: 0.25,
      rules: [
        { rule: 'speed <= speedLimit AND weather == Clear', feature: 'optimal', weight: -0.14, impact: 'Reduces Risk' }
      ],
      score: 0.94
    },
    recommendations: [
      { category: 'Routine Patrol', title: 'Continue autonomous camera speed validation', urgency: 'Low' }
    ],
    user: 'Mamoon Ahmed (Officer)'
  },
  {
    _id: 'pred_seed_007',
    timestamp: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
    modelUsed: 'Random Forest',
    inputs: {
      locationName: 'Western Express Highway (Andheri Flyover)',
      trafficDensity: 88,
      averageSpeed: 68,
      speedLimit: 60,
      weather: 'Heavy Rain',
      roadSurface: 'Wet',
      roadType: 'Highway',
      timeOfDay: 'Evening Peak',
      lighting: 'Dusk/Dawn',
      historicalRiskIndex: 76
    },
    prediction: {
      probability: 0.77,
      riskPercentage: 77,
      riskLevel: 'Severe',
      confidenceScore: 0.93
    },
    shapExplanation: {
      baseValue: 0.28,
      featureContributions: [
        { feature: 'roadSurface', displayName: 'Wet Flyover Gradient Surface', value: 'Wet', shapValue: 0.22, impact: 'High Risk' },
        { feature: 'trafficDensity', displayName: 'High Commuter Density (88%)', value: 88, shapValue: 0.16, impact: 'High Risk' }
      ]
    },
    limeExplanation: {
      intercept: 0.30,
      rules: [
        { rule: 'flyover_gradient == Wet AND density > 80', feature: 'slick_gradient', weight: 0.24, impact: 'Increases Risk' }
      ],
      score: 0.91
    },
    recommendations: [
      { category: 'Incident Prevention', title: 'Deploy hydroplaning warning beacons on Flyover crest', urgency: 'High' }
    ],
    user: 'Dr. Sarah Vance (ML Lead)'
  },
  {
    _id: 'pred_seed_008',
    timestamp: new Date(Date.now() - 1000 * 60 * 560).toISOString(),
    modelUsed: 'Decision Tree',
    inputs: {
      locationName: 'Munshi Pulia Intersection, Lucknow',
      trafficDensity: 66,
      averageSpeed: 42,
      speedLimit: 40,
      weather: 'Clear',
      roadSurface: 'Dry',
      roadType: 'Intersection',
      timeOfDay: 'Off-Peak',
      lighting: 'Daylight',
      historicalRiskIndex: 48
    },
    prediction: {
      probability: 0.44,
      riskPercentage: 44,
      riskLevel: 'Moderate',
      confidenceScore: 0.88
    },
    shapExplanation: {
      baseValue: 0.28,
      featureContributions: [
        { feature: 'averageSpeed', displayName: 'Near Speed Limit (42 km/h)', value: 42, shapValue: 0.04, impact: 'Minor' },
        { feature: 'weather', displayName: 'Dry Road Surface', value: 'Dry', shapValue: -0.06, impact: 'Mitigating' }
      ]
    },
    limeExplanation: {
      intercept: 0.28,
      rules: [
        { rule: 'speed <= 45 AND roadSurface == Dry', feature: 'stable_flow', weight: -0.08, impact: 'Reduces Risk' }
      ],
      score: 0.89
    },
    recommendations: [
      { category: 'Surveillance', title: 'Maintain standard CCTV auto-plate recognition telemetry', urgency: 'Low' }
    ],
    user: 'Mamoon Ahmed (Officer)'
  }
];
