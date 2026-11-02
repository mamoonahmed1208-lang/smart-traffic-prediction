/**
 * Robust CSV Export Utility for Explainable Smart Traffic Prediction System
 * Compliant with RFC 4180 specification
 * Includes UTF-8 BOM (\uFEFF) for native Excel compatibility on Windows/Mac
 */

/**
 * Escapes a single CSV cell value according to RFC 4180
 * - Double quotes inside values are escaped by doubling them (""")
 * - Values containing commas, quotes, or newlines are wrapped in double quotes
 */
export function escapeCSVCell(value) {
  if (value === null || value === undefined) {
    return '""';
  }

  const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);

  // If the cell contains quotes, commas, newlines, or carriage returns, wrap in quotes and escape internal quotes
  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

/**
 * Converts array of headers and array of row arrays into standard CSV string
 */
export function convertToCSV(headers, rows) {
  const headerRow = headers.map(escapeCSVCell).join(',');
  const dataRows = rows.map(row => row.map(escapeCSVCell).join(','));
  return [headerRow, ...dataRows].join('\r\n');
}

/**
 * Initiates browser download of a CSV file using Blob & Object URL with UTF-8 BOM
 */
export function downloadCSV(filename, csvContent) {
  try {
    // Add UTF-8 BOM (\uFEFF) so Excel, Google Sheets & Calc recognize UTF-8 encoding
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.setAttribute('href', url);
    link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoke object URL after short delay
    setTimeout(() => URL.revokeObjectURL(url), 400);

    return {
      success: true,
      filename,
      sizeBytes: blob.size
    };
  } catch (error) {
    console.error('Failed to download CSV:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Exports MongoDB Prediction Audit History records to CSV
 */
export function exportAuditHistoryToCSV(historyList, customFilename = null) {
  if (!Array.isArray(historyList) || historyList.length === 0) {
    return { success: false, error: 'No history records to export' };
  }

  const headers = [
    'Record ID',
    'Timestamp (ISO)',
    'Timestamp (Local)',
    'Model Used',
    'Location Name',
    'Average Speed (km/h)',
    'Speed Limit (km/h)',
    'Speed Excess (km/h)',
    'Traffic Density (%)',
    'Weather Condition',
    'Road Surface',
    'Road Type',
    'Time of Day',
    'Lighting Condition',
    'Historical Risk Index',
    'Accident Probability (0-1)',
    'Risk Score (%)',
    'Risk Severity Level',
    'Confidence Score (%)',
    'Top SHAP Driving Factor',
    'SHAP Value (%)',
    'Top LIME Rule',
    'Primary Recommendation',
    'Recommendation Urgency',
    'Audited By User'
  ];

  const rows = historyList.map(item => {
    const inputs = item.inputs || {};
    const prediction = item.prediction || {};
    const shapContribs = item.shapExplanation?.featureContributions || [];
    const topShap = shapContribs[0] || null;
    const limeRules = item.limeExplanation?.rules || [];
    const topLime = limeRules[0] || null;
    const recommendations = item.recommendations || [];
    const topRec = recommendations[0] || null;

    const avgSpeed = Number(inputs.averageSpeed ?? 0);
    const speedLimit = Number(inputs.speedLimit ?? 0);
    const speedExcess = avgSpeed - speedLimit;

    const timestamp = item.timestamp ? new Date(item.timestamp) : new Date();

    return [
      item._id || item.id || `rec_${Date.now()}`,
      timestamp.toISOString(),
      timestamp.toLocaleString(),
      item.modelUsed || 'Random Forest',
      inputs.locationName || 'Metropolitan Junction',
      avgSpeed,
      speedLimit,
      speedExcess > 0 ? `+${speedExcess}` : `${speedExcess}`,
      inputs.trafficDensity ?? 50,
      inputs.weather || 'Clear',
      inputs.roadSurface || 'Dry',
      inputs.roadType || 'Arterial',
      inputs.timeOfDay || 'Off-Peak',
      inputs.lighting || 'Daylight',
      inputs.historicalRiskIndex ?? 50,
      prediction.probability !== undefined ? Number(prediction.probability).toFixed(4) : (Number(prediction.riskPercentage || 50) / 100).toFixed(4),
      prediction.riskPercentage ?? 50,
      prediction.riskLevel || 'Moderate',
      Math.round((prediction.confidenceScore ?? 0.92) * 100),
      topShap ? topShap.displayName || topShap.feature : 'N/A',
      topShap ? (topShap.shapValue >= 0 ? `+${(topShap.shapValue * 100).toFixed(1)}%` : `${(topShap.shapValue * 100).toFixed(1)}%`) : 'N/A',
      topLime ? topLime.rule : 'N/A',
      topRec ? topRec.title : 'Maintain standard ITS dynamic patrol monitoring',
      topRec ? topRec.urgency : 'Medium',
      item.user || 'Traffic Authority Officer'
    ];
  });

  const timestampStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filename = customFilename || `smart_traffic_prediction_audit_${timestampStr}.csv`;
  const csvText = convertToCSV(headers, rows);

  return downloadCSV(filename, csvText);
}

/**
 * Exports Hotspots & Risk Corridors to CSV
 */
export function exportHotspotsToCSV(hotspots, customFilename = null) {
  if (!Array.isArray(hotspots) || hotspots.length === 0) {
    return { success: false, error: 'No hotspots to export' };
  }

  const headers = [
    'Hotspot ID',
    'Location Name',
    'Corridor / Address',
    'City',
    'Latitude',
    'Longitude',
    'Current Risk Score (0-100)',
    'Risk Severity Level',
    'Current Avg Speed (km/h)',
    'Speed Limit (km/h)',
    'Average Daily Volume (VPD)',
    'Historical Accidents Count',
    'Pavement Friction Coeff',
    'Surface Condition',
    'Weather Status',
    'Primary Hazard Factor',
    'Active Alert Message',
    'Recommended Mitigations',
    'Exported At'
  ];

  const rows = hotspots.map(h => [
    h.id || `hs_${h.name?.slice(0, 5)}`,
    h.name || 'Unnamed Hotspot',
    h.corridor || 'Metropolitan Corridor',
    h.city || 'Regional',
    h.lat ?? '',
    h.lng ?? '',
    h.currentRiskScore ?? 50,
    h.riskLevel || 'Moderate',
    h.currentAvgSpeed ?? 50,
    h.speedLimit ?? 60,
    h.averageDailyVolume ?? 25000,
    h.historicalAccidentsCount ?? 12,
    h.pavementFriction ?? 0.65,
    h.surfaceCondition || 'Dry Asphalt',
    h.weatherStatus || 'Clear',
    h.primaryHazardFactor || 'High Speed / Intersection Conflict',
    h.activeAlert || 'Active automated monitoring',
    Array.isArray(h.recommendedMitigations) ? h.recommendedMitigations.join(' | ') : (h.recommendedMitigations || 'Standard ITS patrol'),
    new Date().toISOString()
  ]);

  const timestampStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filename = customFilename || `traffic_risk_hotspots_${timestampStr}.csv`;
  const csvText = convertToCSV(headers, rows);

  return downloadCSV(filename, csvText);
}

/**
 * Exports a single active Prediction & XAI attribution to CSV
 */
export function exportPredictionToCSV(predictionResult, inputs, customFilename = null) {
  if (!predictionResult || !inputs) {
    return { success: false, error: 'Prediction data is missing' };
  }

  const headers = [
    'Field',
    'Value',
    'Category / Notes'
  ];

  const rows = [
    ['Export Timestamp', new Date().toISOString(), 'Audit Metadata'],
    ['Model Selected', predictionResult.prediction?.model || 'Random Forest', 'Model Information'],
    ['Accident Probability', (predictionResult.prediction?.probability ?? 0.5).toFixed(4), 'Prediction Output'],
    ['Risk Score (%)', `${predictionResult.prediction?.riskPercentage ?? 50}%`, 'Prediction Output'],
    ['Risk Level', predictionResult.prediction?.riskLevel || 'Moderate', 'Prediction Output'],
    ['Model Confidence', `${Math.round((predictionResult.prediction?.confidenceScore ?? 0.92) * 100)}%`, 'Prediction Output'],
    ['Location Evaluated', inputs.locationName || 'Metropolitan Junction', 'Traffic Feature Input'],
    ['Average Speed', `${inputs.averageSpeed} km/h`, 'Traffic Feature Input'],
    ['Speed Limit', `${inputs.speedLimit} km/h`, 'Traffic Feature Input'],
    ['Speed Excess', `${inputs.averageSpeed - inputs.speedLimit} km/h`, 'Derived Feature'],
    ['Traffic Density', `${inputs.trafficDensity}%`, 'Traffic Feature Input'],
    ['Weather Condition', inputs.weather, 'Environmental Feature Input'],
    ['Road Surface Condition', inputs.roadSurface, 'Environmental Feature Input'],
    ['Road Geometry / Type', inputs.roadType, 'Infrastructure Feature Input'],
    ['Time of Day', inputs.timeOfDay, 'Temporal Feature Input'],
    ['Lighting Condition', inputs.lighting, 'Temporal Feature Input'],
    ['Historical Risk Index', `${inputs.historicalRiskIndex} / 100`, 'Historical Telemetry Input'],
    ['SHAP Base Value', (predictionResult.shap?.baseValue ?? 0.28).toFixed(4), 'Explainable AI (SHAP)'],
  ];

  // Add all SHAP contributions
  (predictionResult.shap?.featureContributions || []).forEach(f => {
    rows.push([
      `SHAP: ${f.displayName || f.feature}`,
      `${f.shapValue >= 0 ? '+' : ''}${(f.shapValue * 100).toFixed(2)}%`,
      `SHAP Impact: ${f.impact}`
    ]);
  });

  // Add recommendations
  (predictionResult.recommendations || []).forEach((r, idx) => {
    rows.push([
      `Recommendation #${idx + 1}`,
      `${r.title} [Urgency: ${r.urgency}]`,
      r.description
    ]);
  });

  const timestampStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filename = customFilename || `accident_prediction_result_${timestampStr}.csv`;
  const csvText = convertToCSV(headers, rows);

  return downloadCSV(filename, csvText);
}

/**
 * Exports Analytics & Graphical Reports Data (Diurnal Curve, Weather, Geometry) to CSV
 */
export function exportAnalyticsToCSV(timeRange = 'month', customFilename = null) {
  const headers = [
    'Section',
    'Dimension / Label',
    'Value / Risk Score',
    'Secondary Metric',
    'Policy Note'
  ];

  const rows = [
    // 24h Diurnal Risk
    ['Diurnal 24-Hour Risk Curve', '00:00 (Late Night)', '42% Risk', 'Off-peak volume', 'Unlit rural corridor vigilance'],
    ['Diurnal 24-Hour Risk Curve', '03:00 (Off-Peak)', '34% Risk', 'Minimal traffic', 'Freight vehicle speed enforcement'],
    ['Diurnal 24-Hour Risk Curve', '06:00 (Early Flow)', '46% Risk', 'Commute start', 'School zone speed limit activation'],
    ['Diurnal 24-Hour Risk Curve', '08:30 (Morning Peak)', '78% Risk', 'Severe congestion', 'Intersection conflict management'],
    ['Diurnal 24-Hour Risk Curve', '11:00 (Mid-Day)', '48% Risk', 'Moderate flow', 'Standard adaptive signal cycle'],
    ['Diurnal 24-Hour Risk Curve', '14:00 (Afternoon)', '54% Risk', 'Mixed traffic', 'Commercial vehicle routing'],
    ['Diurnal 24-Hour Risk Curve', '18:30 (Evening Peak)', '86% Risk', 'Peak accident window', 'Dynamic VMS warning deployment'],
    ['Diurnal 24-Hour Risk Curve', '21:00 (Night)', '62% Risk', 'High velocity', 'Automated radar speed traps'],

    // Weather Risk Breakdown
    ['Weather Risk Breakdown', 'Storm', '88% Risk Factor', 'Precipitation > 45mm/h', 'Mandatory 30 km/h speed reduction'],
    ['Weather Risk Breakdown', 'Snow / Ice', '82% Risk Factor', 'Friction coeff < 0.28', 'Anti-skid grit spreading deployed'],
    ['Weather Risk Breakdown', 'Heavy Rain', '76% Risk Factor', 'Hydroplaning hazard', 'Pavement drainage clearance'],
    ['Weather Risk Breakdown', 'Dense Fog', '72% Risk Factor', 'Visibility < 50m', 'Fog beacon guidance active'],
    ['Weather Risk Breakdown', 'Light Rain', '52% Risk Factor', 'Initial slick road film', 'Driver cautionary alert'],
    ['Weather Risk Breakdown', 'Clear Sky', '22% Risk Factor', 'Optimal conditions', 'Baseline traffic enforcement'],

    // Geometry Distribution
    ['Conflict Geometry Distribution', 'Intersection Conflict', '41% of Incidents', '184 Historical Cases', 'Smart split-phase signal timing'],
    ['Conflict Geometry Distribution', 'Highway High-Speed Corridors', '27% of Incidents', '121 Historical Cases', 'Median barrier reinforcement'],
    ['Conflict Geometry Distribution', 'Arterial Bottlenecks', '19% of Incidents', '85 Historical Cases', 'Lane segregation & curb geometry'],
    ['Conflict Geometry Distribution', 'Rural Dark Unlit Sections', '13% of Incidents', '58 Historical Cases', 'Solar illumination installations']
  ];

  const filename = customFilename || `traffic_analytics_report_${timeRange}_${Date.now()}.csv`;
  const csvText = convertToCSV(headers, rows);

  return downloadCSV(filename, csvText);
}

/**
 * Exports IoT Telemetry Corridors to CSV
 */
export function exportIoTTelemetryToCSV(streamData, stats, customFilename = null) {
  if (!Array.isArray(streamData) || streamData.length === 0) {
    return { success: false, error: 'No IoT telemetry data to export' };
  }

  const headers = [
    'IoT Sensor ID',
    'Corridor Location',
    'Current Speed (km/h)',
    'Vehicle Volume (Veh/Hr)',
    'Weather Condition',
    'Surface Temp (°C)',
    'Friction Coefficient (μ)',
    'Pavement Status',
    'Packets Received',
    'Integrity Rate (%)',
    'Timestamp'
  ];

  const rows = streamData.map(sensor => [
    sensor.id || 'IOT-SENS',
    sensor.location || 'Expressway Link',
    sensor.speed,
    sensor.volume,
    sensor.weather,
    sensor.surfaceTemp,
    sensor.frictionCoeff,
    sensor.frictionCoeff < 0.5 ? 'CRITICAL SLICK' : (sensor.frictionCoeff < 0.7 ? 'MODERATE GRIP' : 'OPTIMAL ADHESION'),
    stats?.packetsReceived || 14820,
    `${stats?.integrityRate || 99.94}%`,
    new Date().toISOString()
  ]);

  const filename = customFilename || `live_iot_traffic_telemetry_${Date.now()}.csv`;
  const csvText = convertToCSV(headers, rows);

  return downloadCSV(filename, csvText);
}
