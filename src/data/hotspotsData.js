// Default Pre-loaded Hotspots and Locations for Smart Traffic Prediction ITS
// Covers Kolkata Metropolitan Area and Lucknow Hazard Corridors

export const DEFAULT_HOTSPOTS = [
  // --- KOLKATA ACCIDENT BLACKSPOTS ---
  {
    id: 'hs_kol_01',
    name: 'Howrah Bridge Approach (Strand Road)',
    corridor: 'Strand Road - Howrah Bridge Approach, Kolkata',
    city: 'Kolkata',
    lat: 22.5851,
    lng: 88.3468,
    currentRiskScore: 92,
    riskLevel: 'Severe',
    historicalAccidentsCount: 52,
    averageDailyVolume: 115000,
    speedLimit: 40,
    currentAvgSpeed: 12,
    weatherStatus: 'Clear',
    roadSurface: 'Dry',
    roadType: 'Intersection',
    timeOfDay: 'Evening Peak',
    activeAlert: 'Extreme Pedestrian & Heavy Bus Density Bottleneck',
    cctvActive: true,
    cctvCameraId: 'CAM-KOL-STRAND-01',
    iotSensorsCount: 12,
    pavementFriction: 0.62,
    primaryHazardFactor: 'Dense Pedestrian Jaywalking & Multi-modal Transit Friction',
    secondaryFactors: [
      { name: 'Pedestrian Crossing Frequency', pct: 42 },
      { name: 'Bus Swerving & Unscheduled Stops', pct: 31 },
      { name: 'Narrow Bridge Funneling', pct: 27 }
    ],
    recommendedMitigations: [
      'Activate variable speed limit signs at 25 km/h',
      'Deploy pedestrian marshals along Strand Road',
      'Optimize traffic signal green corridor for bridge exit'
    ]
  },
  {
    id: 'hs_kol_02',
    name: 'Park Circus 7-Point Crossing',
    corridor: 'Maa Flyover Ramp - AJC Bose Rd, Kolkata',
    city: 'Kolkata',
    lat: 22.5414,
    lng: 88.3683,
    currentRiskScore: 89,
    riskLevel: 'Severe',
    historicalAccidentsCount: 47,
    averageDailyVolume: 98000,
    speedLimit: 50,
    currentAvgSpeed: 16,
    weatherStatus: 'Rain',
    roadSurface: 'Wet',
    roadType: 'Intersection',
    timeOfDay: 'Morning Peak',
    activeAlert: 'Flyover Merge Chokepoint & Multi-way Traffic Clashing',
    cctvActive: true,
    cctvCameraId: 'CAM-KOL-PC7-04',
    iotSensorsCount: 10,
    pavementFriction: 0.38,
    primaryHazardFactor: 'Seven-Way Convergence & Flyover Gradient Merge',
    secondaryFactors: [
      { name: 'Flyover Ramp Speed Discrepancy', pct: 38 },
      { name: 'Multi-Directional Weaving', pct: 34 },
      { name: 'Wet Surface Braking Distance', pct: 28 }
    ],
    recommendedMitigations: [
      'Stagger signal phasing to reduce simultaneous merges',
      'Broadcast automated wet pavement braking warnings',
      'Reroute heavy goods carriers via CIT Road'
    ]
  },
  {
    id: 'hs_kol_03',
    name: 'EM Bypass & Science City Interchange',
    corridor: 'Eastern Metropolitan Bypass, Kolkata',
    city: 'Kolkata',
    lat: 22.5398,
    lng: 88.3962,
    currentRiskScore: 82,
    riskLevel: 'Severe',
    historicalAccidentsCount: 39,
    averageDailyVolume: 84000,
    speedLimit: 70,
    currentAvgSpeed: 45,
    weatherStatus: 'Clear',
    roadSurface: 'Dry',
    roadType: 'Arterial',
    timeOfDay: 'Night',
    activeAlert: 'High Speed Weaving & Exhibition Event Congestion',
    cctvActive: true,
    cctvCameraId: 'CAM-KOL-EMB-12',
    iotSensorsCount: 9,
    pavementFriction: 0.74,
    primaryHazardFactor: 'High-Speed Arterial Weaving & Night Blindspots',
    secondaryFactors: [
      { name: 'Excessive Speed vs 70 km/h Limit', pct: 45 },
      { name: 'Sudden U-Turn Maneuvers', pct: 30 },
      { name: 'Service Lane Friction', pct: 25 }
    ],
    recommendedMitigations: [
      'Activate automated speed enforcement radars',
      'Increase illumination on median crossovers',
      'Deploy incident response van at Science City circle'
    ]
  },
  {
    id: 'hs_kol_04',
    name: 'Taratala & Maheshtala Freight Arterial',
    corridor: 'Diamond Harbour Road, Kolkata',
    city: 'Kolkata',
    lat: 22.5112,
    lng: 88.3075,
    currentRiskScore: 86,
    riskLevel: 'Severe',
    historicalAccidentsCount: 43,
    averageDailyVolume: 62000,
    speedLimit: 40,
    currentAvgSpeed: 18,
    weatherStatus: 'Rain',
    roadSurface: 'Wet',
    roadType: 'Arterial',
    timeOfDay: 'Evening Peak',
    activeAlert: 'Heavy Freight Container Trucks & Uneven Potholes',
    cctvActive: true,
    cctvCameraId: 'CAM-KOL-DH-08',
    iotSensorsCount: 8,
    pavementFriction: 0.44,
    primaryHazardFactor: 'Container Truck Blindspots & Road Subsidence',
    secondaryFactors: [
      { name: 'Heavy Freight Vehicle Blindspots', pct: 48 },
      { name: 'Uneven Surface / Rutting', pct: 32 },
      { name: 'Two-Wheeler Lane Filtering', pct: 20 }
    ],
    recommendedMitigations: [
      'Restrict container movement during peak 17:00-20:00',
      'Immediate asphalt patching on southbound lane',
      'Mandate heavy vehicle lane discipline'
    ]
  },
  {
    id: 'hs_kol_05',
    name: 'Santragachi Overpass (Kona Expressway)',
    corridor: 'Kona Expressway Gateway, Kolkata',
    city: 'Kolkata',
    lat: 22.5815,
    lng: 88.2825,
    currentRiskScore: 78,
    riskLevel: 'High',
    historicalAccidentsCount: 34,
    averageDailyVolume: 76000,
    speedLimit: 60,
    currentAvgSpeed: 32,
    weatherStatus: 'Clear',
    roadSurface: 'Dry',
    roadType: 'Highway',
    timeOfDay: 'Afternoon',
    activeAlert: 'Steep Incline Merging & Frequent Commercial Breakdowns',
    cctvActive: true,
    cctvCameraId: 'CAM-KOL-KONA-03',
    iotSensorsCount: 7,
    pavementFriction: 0.69,
    primaryHazardFactor: 'Interstate Long-Haul Truck Breakdowns on Ramp',
    secondaryFactors: [
      { name: 'Overloaded Vehicle Ramp Stalls', pct: 44 },
      { name: 'Narrow Two-Lane Bridge Chokepoint', pct: 36 },
      { name: 'High Inflow from NH-16', pct: 20 }
    ],
    recommendedMitigations: [
      'Standby heavy-duty recovery tow trucks 24/7',
      'Pre-ramp weight in motion (WIM) sensors',
      'Dynamic queue warning signs 1 km upstream'
    ]
  },
  {
    id: 'hs_kol_06',
    name: 'Shyambazar Five-Point Crossing',
    corridor: 'Bidhan Sarani - Central Ave, Kolkata',
    city: 'Kolkata',
    lat: 22.6033,
    lng: 88.3715,
    currentRiskScore: 64,
    riskLevel: 'High',
    historicalAccidentsCount: 22,
    averageDailyVolume: 59000,
    speedLimit: 40,
    currentAvgSpeed: 24,
    weatherStatus: 'Clear',
    roadSurface: 'Dry',
    roadType: 'Intersection',
    timeOfDay: 'Morning Peak',
    activeAlert: null,
    cctvActive: true,
    cctvCameraId: 'CAM-KOL-SHYAM-02',
    iotSensorsCount: 6,
    pavementFriction: 0.65,
    primaryHazardFactor: 'Heritage Tram Track Slippage in Wet Weather',
    secondaryFactors: [
      { name: 'Steel Tram Rail Motorcycle Skidding', pct: 50 },
      { name: 'Radial Five-Way Roundabout Traffic', pct: 30 },
      { name: 'Dense Metro Station Footfall', pct: 20 }
    ],
    recommendedMitigations: [
      'High-friction epoxy coating alongside tram rails',
      'Roundabout approach speed humps',
      'Protected pedestrian subway guidance'
    ]
  },
  {
    id: 'hs_kol_07',
    name: 'Peerless Hospital & Garia EM Bypass',
    corridor: 'EM Bypass South Ext, Kolkata',
    city: 'Kolkata',
    lat: 22.4820,
    lng: 88.3980,
    currentRiskScore: 58,
    riskLevel: 'Moderate',
    historicalAccidentsCount: 18,
    averageDailyVolume: 52000,
    speedLimit: 50,
    currentAvgSpeed: 38,
    weatherStatus: 'Clear',
    roadSurface: 'Dry',
    roadType: 'Arterial',
    timeOfDay: 'Afternoon',
    activeAlert: null,
    cctvActive: true,
    cctvCameraId: 'CAM-KOL-PEER-01',
    iotSensorsCount: 5,
    pavementFriction: 0.72,
    primaryHazardFactor: 'Emergency Ambulance Corridor & Intersection Crossing',
    secondaryFactors: [
      { name: 'Sudden Emergency Vehicle Crossings', pct: 40 },
      { name: 'Auto-Rickshaw U-Turns', pct: 35 },
      { name: 'High-Speed Metro Pillar Blindspots', pct: 25 }
    ],
    recommendedMitigations: [
      'Dedicated green priority corridor for ambulances',
      'Barrier segregation of auto-rickshaw bays',
      'Reflective corner mirrors on metro pillars'
    ]
  },

  // --- LUCKNOW ACCIDENT BLACKSPOTS ---
  {
    id: 'hs_01',
    name: 'Integral University Corridor (Kursi Road)',
    corridor: 'Kursi Road, Dashauli, Lucknow',
    city: 'Lucknow',
    lat: 26.9587,
    lng: 80.9992,
    currentRiskScore: 84,
    riskLevel: 'Severe',
    historicalAccidentsCount: 38,
    averageDailyVolume: 56000,
    speedLimit: 40,
    currentAvgSpeed: 58,
    weatherStatus: 'Clear',
    roadSurface: 'Dry',
    roadType: 'Arterial',
    timeOfDay: 'Morning Peak',
    activeAlert: 'Heavy Student Pedestrian Surge & Overspeeding',
    cctvActive: true,
    cctvCameraId: 'CAM-LKO-INT-01',
    iotSensorsCount: 8,
    pavementFriction: 0.71,
    primaryHazardFactor: 'Unregulated Student Crossings & Fast Commuters',
    secondaryFactors: [
      { name: 'High Commuter Speed vs 40 km/h Limit', pct: 46 },
      { name: 'Pedestrian Campus Crossings', pct: 32 },
      { name: 'Unpaved Shoulder Dust/Visibility', pct: 22 }
    ],
    recommendedMitigations: [
      'Install raised zebra crossing with flashers',
      'Lower speed limit during peak student hours 08:00-10:00',
      'Pave service lane shoulders'
    ]
  },
  {
    id: 'hs_02',
    name: 'Scorpio Club & Resort Junction',
    corridor: 'Kursi Road - Ring Road Turnoff, Lucknow',
    city: 'Lucknow',
    lat: 26.9425,
    lng: 80.9780,
    currentRiskScore: 68,
    riskLevel: 'High',
    historicalAccidentsCount: 24,
    averageDailyVolume: 48000,
    speedLimit: 50,
    currentAvgSpeed: 42,
    weatherStatus: 'Clear',
    roadSurface: 'Dry',
    roadType: 'Intersection',
    timeOfDay: 'Evening Peak',
    activeAlert: 'Blind Curve Entry & Resort Traffic Bottleneck',
    cctvActive: true,
    cctvCameraId: 'CAM-LKO-SCORP-02',
    iotSensorsCount: 6,
    pavementFriction: 0.68,
    primaryHazardFactor: 'Blind Curved Entry Ramp & Narrow Shoulders',
    secondaryFactors: [
      { name: 'Acute Blind Curve Radius', pct: 42 },
      { name: 'Weekend Resort Inflow Bottleneck', pct: 36 },
      { name: 'Inadequate Street Lighting', pct: 22 }
    ],
    recommendedMitigations: [
      'Install high-visibility curve chevron signs',
      'Extend deceleration turn pocket',
      'LED luminaire installation on outer curve'
    ]
  },
  {
    id: 'hs_03',
    name: 'MJ Funcity Waterpark & Resort Curve',
    corridor: 'Dashauli - Kapasi Road, Lucknow',
    city: 'Lucknow',
    lat: 26.9360,
    lng: 81.0180,
    currentRiskScore: 88,
    riskLevel: 'Severe',
    historicalAccidentsCount: 44,
    averageDailyVolume: 62000,
    speedLimit: 50,
    currentAvgSpeed: 18,
    weatherStatus: 'Heavy Rain',
    roadSurface: 'Wet',
    roadType: 'Curve',
    timeOfDay: 'Evening Peak',
    activeAlert: 'Acute S-Bend & Severe Holiday Congestion',
    cctvActive: true,
    cctvCameraId: 'CAM-LKO-MJF-01',
    iotSensorsCount: 9,
    pavementFriction: 0.36,
    primaryHazardFactor: 'Acute S-Curve Bottleneck & Wet Braking Failure',
    secondaryFactors: [
      { name: 'Sharp Reverse Curve Geometry', pct: 44 },
      { name: 'Wet Pavement Hydroplaning Risk', pct: 34 },
      { name: 'Tourist Bus Parking Obstructions', pct: 22 }
    ],
    recommendedMitigations: [
      'Apply high-friction micro-surfacing (calcined bauxite)',
      'Clear roadside unauthorized coach parking',
      'Real-time slippery curve alert signs'
    ]
  },
  {
    id: 'hs_04',
    name: 'Kapasi - Raiauli Arterial Connector',
    corridor: 'Outer Kursi Bypass, Lucknow',
    city: 'Lucknow',
    lat: 26.9480,
    lng: 81.0420,
    currentRiskScore: 54,
    riskLevel: 'Moderate',
    historicalAccidentsCount: 16,
    averageDailyVolume: 32000,
    speedLimit: 60,
    currentAvgSpeed: 52,
    weatherStatus: 'Clear',
    roadSurface: 'Dry',
    roadType: 'Highway',
    timeOfDay: 'Night',
    activeAlert: null,
    cctvActive: true,
    cctvCameraId: 'CAM-LKO-KAP-01',
    iotSensorsCount: 5,
    pavementFriction: 0.70,
    primaryHazardFactor: 'Unlit Rural Road & High Speed Differential',
    secondaryFactors: [
      { name: 'Zero Roadway Street Lighting', pct: 52 },
      { name: 'Slow Agricultural Tractor Conflicts', pct: 30 },
      { name: 'Unmarked Narrow Culverts', pct: 18 }
    ],
    recommendedMitigations: [
      'Install solar reflective delineators on culverts',
      'Enforce tractor rear reflector compliance',
      'Continuous white edge line painting'
    ]
  },
  {
    id: 'hs_05',
    name: 'Samarpan Hospital & Dewan Rd Junction',
    corridor: 'Dewan Road Connector, Lucknow',
    city: 'Lucknow',
    lat: 26.9120,
    lng: 81.0185,
    currentRiskScore: 76,
    riskLevel: 'High',
    historicalAccidentsCount: 31,
    averageDailyVolume: 68000,
    speedLimit: 40,
    currentAvgSpeed: 21,
    weatherStatus: 'Clear',
    roadSurface: 'Dry',
    roadType: 'Intersection',
    timeOfDay: 'Afternoon',
    activeAlert: 'Emergency Ambulance Corridor Delay',
    cctvActive: true,
    cctvCameraId: 'CAM-LKO-SAM-01',
    iotSensorsCount: 7,
    pavementFriction: 0.67,
    primaryHazardFactor: 'Emergency Route Congestion & Illegal Roadside Parking',
    secondaryFactors: [
      { name: 'Commercial Encroachment on Shoulders', pct: 40 },
      { name: 'Ambulance Entry/Exit Delay', pct: 35 },
      { name: 'Pedestrian Patient Attendants Crossing', pct: 25 }
    ],
    recommendedMitigations: [
      'Establish strict no-parking zone within 150m of hospital',
      'Install signal pre-emption receiver for ambulances',
      'Designate pedestrian skywalk crossing'
    ]
  },
  {
    id: 'hs_06',
    name: 'Kukrail Forest Ring Road Stretch',
    corridor: 'Jankipuram East - Kukrail Forest Way, Lucknow',
    city: 'Lucknow',
    lat: 26.9050,
    lng: 80.9900,
    currentRiskScore: 46,
    riskLevel: 'Moderate',
    historicalAccidentsCount: 12,
    averageDailyVolume: 34000,
    speedLimit: 60,
    currentAvgSpeed: 58,
    weatherStatus: 'Clear',
    roadSurface: 'Dry',
    roadType: 'Rural',
    timeOfDay: 'Night',
    activeAlert: null,
    cctvActive: true,
    cctvCameraId: 'CAM-LKO-KUK-01',
    iotSensorsCount: 4,
    pavementFriction: 0.75,
    primaryHazardFactor: 'Low Night Visibility & Animal Crossings',
    secondaryFactors: [
      { name: 'Wildlife & Stray Animal Crossings', pct: 48 },
      { name: 'Sharp Tree Shade Visibility Contrast', pct: 32 },
      { name: 'High Night Speeding', pct: 20 }
    ],
    recommendedMitigations: [
      'Install wildlife movement warning rumble strips',
      'Animal crossing infrared sensors with flashing alert',
      'Speed camera at reserve entrance'
    ]
  },
  {
    id: 'hs_07',
    name: 'Jankipuram Extension Highway Bypass',
    corridor: 'Outer Ring Road Interchange, Lucknow',
    city: 'Lucknow',
    lat: 26.9180,
    lng: 80.9480,
    currentRiskScore: 32,
    riskLevel: 'Low',
    historicalAccidentsCount: 8,
    averageDailyVolume: 82000,
    speedLimit: 80,
    currentAvgSpeed: 74,
    weatherStatus: 'Clear',
    roadSurface: 'Dry',
    roadType: 'Highway',
    timeOfDay: 'Daylight',
    activeAlert: null,
    cctvActive: true,
    cctvCameraId: 'CAM-LKO-JANK-01',
    iotSensorsCount: 6,
    pavementFriction: 0.78,
    primaryHazardFactor: 'High Speed Merging Conflict',
    secondaryFactors: [
      { name: 'High Speed Differential on Merge Ramps', pct: 55 },
      { name: 'Fast Highway Overtaking', pct: 45 }
    ],
    recommendedMitigations: [
      'Lengthen acceleration taper by 120m',
      'Dynamic ramp metering during peak hours'
    ]
  }
];

// Helper to convert any POI into an inspectable Hotspot telemetry entity
export function convertPoiToHotspot(poi, city = 'Kolkata') {
  const isKolkata = city.toLowerCase() === 'kolkata';
  const baselineSpeed = poi.category === 'TRANSIT' ? 22 : poi.category === 'MUSEUMS' ? 35 : 42;
  const speedLimit = poi.category === 'TRANSIT' ? 40 : 50;
  const riskScore = poi.category === 'TRANSIT' ? 76 : poi.category === 'PHARMACIES' ? 62 : 45;
  const riskLevel = riskScore >= 75 ? 'High' : riskScore >= 50 ? 'Moderate' : 'Low';

  return {
    id: `poi_inspect_${poi.id}`,
    name: poi.name,
    corridor: `${poi.desc} · ${city}`,
    city: city,
    lat: poi.lat,
    lng: poi.lng,
    currentRiskScore: riskScore,
    riskLevel: riskLevel,
    historicalAccidentsCount: Math.round(riskScore * 0.35),
    averageDailyVolume: Math.round(riskScore * 850 + 20000),
    speedLimit: speedLimit,
    currentAvgSpeed: baselineSpeed,
    weatherStatus: 'Clear',
    roadSurface: 'Dry',
    roadType: 'Arterial',
    timeOfDay: 'Current Observation',
    activeAlert: riskScore > 70 ? `Active Traffic & Pedestrian Density near ${poi.name}` : null,
    cctvActive: true,
    cctvCameraId: `CAM-${isKolkata ? 'KOL' : 'LKO'}-POI-${poi.id.slice(-3)}`,
    iotSensorsCount: 6,
    pavementFriction: 0.68,
    primaryHazardFactor: `Urban POI Activity & Pedestrian Turning Maneuvers near ${poi.name}`,
    secondaryFactors: [
      { name: 'Curbside Vehicle Drop-offs', pct: 45 },
      { name: 'Pedestrian Road Crossings', pct: 35 },
      { name: 'Low Speed Congestion Spillback', pct: 20 }
    ],
    recommendedMitigations: [
      'Designate structured drop-off / pickup lane',
      'Deploy smart pedestrian crossing signals',
      'Real-time parking vacancy signage'
    ]
  };
}

// Helper to inspect any tapped coordinate on map
export function createCustomCoordinateHotspot(lat, lng, city = 'Kolkata') {
  const isKolkata = city.toLowerCase() === 'kolkata';
  const syntheticScore = Math.min(88, Math.max(30, Math.round(((lat * 100) % 50) + ((lng * 100) % 40))));
  const riskLevel = syntheticScore >= 80 ? 'Severe' : syntheticScore >= 60 ? 'High' : syntheticScore >= 40 ? 'Moderate' : 'Low';

  return {
    id: `coord_${Date.now()}`,
    name: `Tapped Coordinate Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
    corridor: `Custom Surveyed Coordinate · ${city}`,
    city: city,
    lat: lat,
    lng: lng,
    currentRiskScore: syntheticScore,
    riskLevel: riskLevel,
    historicalAccidentsCount: Math.round(syntheticScore * 0.28),
    averageDailyVolume: Math.round(syntheticScore * 650 + 15000),
    speedLimit: 50,
    currentAvgSpeed: Math.round(50 - (syntheticScore * 0.3)),
    weatherStatus: 'Clear',
    roadSurface: 'Dry',
    roadType: 'Corridor',
    timeOfDay: 'Live Spot Check',
    activeAlert: syntheticScore > 75 ? 'Spatial Risk Interpolation Warning: Elevated Micro-Zone Risk' : null,
    cctvActive: true,
    cctvCameraId: `CAM-MOBILE-DRONE-${Math.floor(Math.random() * 900 + 100)}`,
    iotSensorsCount: 4,
    pavementFriction: 0.65,
    primaryHazardFactor: 'Interpolated Spatial Micro-Risk & Local Lane Friction',
    secondaryFactors: [
      { name: 'Micro-Topological Road Curvature', pct: 40 },
      { name: 'Speed Variance from Adjacent Corridors', pct: 35 },
      { name: 'Pavement Texture Degradation', pct: 25 }
    ],
    recommendedMitigations: [
      'Conduct on-ground corridor safety audit',
      'Monitor with mobile drone surveillance',
      'Assess sight-line clearances'
    ]
  };
}
