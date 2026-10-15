import React, { useState } from 'react';
import {
  Zap,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Sparkles,
  TrendingUp,
  Clock,
  Compass,
  ArrowRight,
  ShieldCheck,
  Info,
  Layers,
  ThermometerSnowflake,
  CloudRain,
  Eye
} from 'lucide-react';

export default function PredictionStudio({
  inputs,
  setInputs,
  selectedModel,
  setSelectedModel,
  onPredict,
  predictionResult,
  loading,
  setActiveTab
}) {
  // Preset Scenarios
  const PRESETS = [
    {
      id: 'rain_rush',
      label: 'Rush Hour Rainstorm',
      icon: CloudRain,
      color: '#38bdf8',
      data: {
        trafficDensity: 82,
        averageSpeed: 75,
        speedLimit: 60,
        weather: 'Heavy Rain',
        roadSurface: 'Wet',
        roadType: 'Intersection',
        timeOfDay: 'Morning Peak',
        lighting: 'Daylight',
        historicalRiskIndex: 72,
        locationName: 'Metropolitan Junction 12'
      }
    },
    {
      id: 'fog_night',
      label: 'Midnight Foggy Highway',
      icon: Eye,
      color: '#a855f7',
      data: {
        trafficDensity: 28,
        averageSpeed: 94,
        speedLimit: 80,
        weather: 'Fog',
        roadSurface: 'Wet',
        roadType: 'Highway',
        timeOfDay: 'Night',
        lighting: 'Dark unlit',
        historicalRiskIndex: 65,
        locationName: 'Outer Ring Expressway (km 24.5)'
      }
    },
    {
      id: 'clear_day',
      label: 'Clear Weekend Flow',
      icon: CheckCircle2,
      color: '#10b981',
      data: {
        trafficDensity: 35,
        averageSpeed: 52,
        speedLimit: 60,
        weather: 'Clear',
        roadSurface: 'Dry',
        roadType: 'Arterial',
        timeOfDay: 'Off-Peak',
        lighting: 'Daylight',
        historicalRiskIndex: 30,
        locationName: 'Grand Arterial Boulevard'
      }
    },
    {
      id: 'ice_inter',
      label: 'Icy Morning Crossing',
      icon: ThermometerSnowflake,
      color: '#f59e0b',
      data: {
        trafficDensity: 68,
        averageSpeed: 48,
        speedLimit: 50,
        weather: 'Snow',
        roadSurface: 'Slippery/Ice',
        roadType: 'Intersection',
        timeOfDay: 'Morning Peak',
        lighting: 'Dusk/Dawn',
        historicalRiskIndex: 78,
        locationName: 'River Valley Bridge Corridor'
      }
    }
  ];

  const handleApplyPreset = (presetData) => {
    setInputs(prev => ({ ...prev, ...presetData }));
  };

  const currentResult = predictionResult?.prediction;
  const shapData = predictionResult?.shap;
  const limeData = predictionResult?.lime;
  const recommendations = predictionResult?.recommendations || [];

  // Determine Risk Styling
  const getRiskStyle = (level) => {
    switch (level) {
      case 'Severe':
        return { color: 'var(--risk-severe)', bg: 'var(--risk-severe-bg)', border: 'var(--risk-severe-border)', glow: 'var(--glow-red)' };
      case 'High':
        return { color: 'var(--risk-high)', bg: 'var(--risk-high-bg)', border: 'var(--risk-high-border)', glow: '0 0 20px rgba(249, 115, 22, 0.3)' };
      case 'Moderate':
        return { color: 'var(--risk-moderate)', bg: 'var(--risk-moderate-bg)', border: 'var(--risk-moderate-border)', glow: '0 0 15px rgba(245, 158, 11, 0.25)' };
      default:
        return { color: 'var(--risk-low)', bg: 'var(--risk-low-bg)', border: 'var(--risk-low-border)', glow: 'var(--glow-green)' };
    }
  };

  const riskStyle = getRiskStyle(currentResult?.riskLevel || 'Low');
  const riskPercent = currentResult?.riskPercentage ?? 28;

  // SVG Gauge calculations
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (riskPercent / 100) * circumference;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
      {/* LEFT COLUMN: Input Controls & Presets (7 cols) */}
      <div style={{ gridColumn: 'span 7' }}>
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={20} color="var(--brand-cyan)" />
                Traffic & Environmental Variables
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Adjust real-time road conditions or load representative accident scenarios
              </p>
            </div>

            {/* Model Selector Toggle */}
            <div style={{
              display: 'flex',
              background: '#0f172a',
              borderRadius: '10px',
              padding: '4px',
              border: '1px solid var(--border-subtle)'
            }}>
              <button
                type="button"
                onClick={() => setSelectedModel('Random Forest')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  background: selectedModel === 'Random Forest' ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'transparent',
                  color: selectedModel === 'Random Forest' ? '#fff' : 'var(--text-muted)'
                }}
              >
                Random Forest
              </button>
              <button
                type="button"
                onClick={() => setSelectedModel('Decision Tree')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  background: selectedModel === 'Decision Tree' ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'transparent',
                  color: selectedModel === 'Decision Tree' ? '#fff' : 'var(--text-muted)'
                }}
              >
                Decision Tree
              </button>
            </div>
          </div>

          {/* Quick Scenario Presets */}
          <div style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Quick Presets
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '8px' }}>
              {PRESETS.map((p) => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleApplyPreset(p.data)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '10px',
                      padding: '10px 8px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = p.color;
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    }}
                  >
                    <Icon size={18} color={p.color} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f8fafc' }}>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Inputs Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
            {/* Speed Slider */}
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#f8fafc' }}>
                  Average Vehicle Speed vs Limit
                </label>
                <span style={{ fontSize: '0.84rem', fontFamily: 'var(--font-mono)', color: inputs.averageSpeed > inputs.speedLimit ? 'var(--risk-severe)' : 'var(--brand-cyan)' }}>
                  {inputs.averageSpeed} km/h (Limit: {inputs.speedLimit} km/h)
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="140"
                value={inputs.averageSpeed}
                onChange={(e) => setInputs({ ...inputs, averageSpeed: Number(e.target.value) })}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                <span>20 km/h (Congestion)</span>
                <span>Posted Speed: {inputs.speedLimit} km/h</span>
                <span>140 km/h (Excessive Speed)</span>
              </div>
            </div>

            {/* Traffic Density Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#f8fafc' }}>
                  Traffic Density
                </label>
                <span style={{ fontSize: '0.84rem', fontFamily: 'var(--font-mono)', color: 'var(--brand-cyan)' }}>
                  {inputs.trafficDensity}% {inputs.trafficDensity > 75 ? '(LoS F - Jam)' : inputs.trafficDensity > 45 ? '(LoS C)' : '(LoS A)'}
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={inputs.trafficDensity}
                onChange={(e) => setInputs({ ...inputs, trafficDensity: Number(e.target.value) })}
              />
            </div>

            {/* Historical Blackspot Risk Score */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#f8fafc' }}>
                  Historical Corridor Risk
                </label>
                <span style={{ fontSize: '0.84rem', fontFamily: 'var(--font-mono)', color: inputs.historicalRiskIndex > 65 ? 'var(--risk-high)' : 'var(--text-muted)' }}>
                  {inputs.historicalRiskIndex}/100
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={inputs.historicalRiskIndex}
                onChange={(e) => setInputs({ ...inputs, historicalRiskIndex: Number(e.target.value) })}
              />
            </div>

            {/* Weather Dropdown */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc', display: 'block', marginBottom: '6px' }}>
                Weather Condition
              </label>
              <select
                value={inputs.weather}
                onChange={(e) => setInputs({ ...inputs, weather: e.target.value })}
              >
                <option value="Clear">Clear (Normal Traction)</option>
                <option value="Rain">Rain (Wet Pavement)</option>
                <option value="Heavy Rain">Heavy Rain (Low Visibility & Spray)</option>
                <option value="Fog">Dense Fog (Severe Sightline Loss)</option>
                <option value="Snow">Snow (Friction Drop)</option>
                <option value="Storm">Severe Storm (Gale Winds & Downpour)</option>
              </select>
            </div>

            {/* Road Surface */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc', display: 'block', marginBottom: '6px' }}>
                Road Surface Condition
              </label>
              <select
                value={inputs.roadSurface}
                onChange={(e) => setInputs({ ...inputs, roadSurface: e.target.value })}
              >
                <option value="Dry">Dry Asphalt (Optimal μ ≈ 0.85)</option>
                <option value="Wet">Wet Pavement (Reduced μ ≈ 0.55)</option>
                <option value="Slippery/Ice">Slippery / Ice (Severe μ ≤ 0.25)</option>
                <option value="Construction">Under Construction (Debris & Uneven)</option>
              </select>
            </div>

            {/* Road Geometry Type */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc', display: 'block', marginBottom: '6px' }}>
                Road Geometry
              </label>
              <select
                value={inputs.roadType}
                onChange={(e) => setInputs({ ...inputs, roadType: e.target.value })}
              >
                <option value="Highway">Expressway / Divided Highway</option>
                <option value="Arterial">Grand Arterial Boulevard</option>
                <option value="Intersection">Multi-Leg Signalized Intersection</option>
                <option value="Residential">Urban Residential Street</option>
                <option value="Rural">Rural Two-Lane Highway</option>
              </select>
            </div>

            {/* Lighting Conditions */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc', display: 'block', marginBottom: '6px' }}>
                Ambient Lighting
              </label>
              <select
                value={inputs.lighting}
                onChange={(e) => setInputs({ ...inputs, lighting: e.target.value })}
              >
                <option value="Daylight">Full Natural Daylight</option>
                <option value="Dusk/Dawn">Dusk / Dawn (Twilight Transits)</option>
                <option value="Dark lit">Night - Street Lit</option>
                <option value="Dark unlit">Night - Dark Unlit Corridor</option>
              </select>
            </div>

            {/* Time of Day */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc', display: 'block', marginBottom: '6px' }}>
                Operating Time Window
              </label>
              <select
                value={inputs.timeOfDay}
                onChange={(e) => setInputs({ ...inputs, timeOfDay: e.target.value })}
              >
                <option value="Morning Peak">Morning Rush Hour (07:30 - 10:00)</option>
                <option value="Afternoon Peak">Evening Commute Peak (17:00 - 20:00)</option>
                <option value="Night">Late Night (22:00 - 05:00)</option>
                <option value="Off-Peak">Mid-Day Off-Peak (11:00 - 16:00)</option>
              </select>
            </div>

            {/* Corridor Location Name */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc', display: 'block', marginBottom: '6px' }}>
                Corridor / Junction
              </label>
              <input
                type="text"
                value={inputs.locationName}
                onChange={(e) => setInputs({ ...inputs, locationName: e.target.value })}
              />
            </div>
          </div>

          {/* Action Button */}
          <div style={{ marginTop: '24px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={onPredict}
              disabled={loading}
              className="btn-primary"
              style={{ flex: 1, padding: '14px', fontSize: '0.95rem' }}
            >
              {loading ? (
                <>
                  <div className="status-dot" style={{ background: '#fff' }}></div>
                  <span>Evaluating AI Engine & Generating SHAP...</span>
                </>
              ) : (
                <>
                  <Zap size={18} />
                  <span>Execute AI Risk Prediction ({selectedModel})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Output Dashboard & Gauge & Explanations (5 cols) */}
      <div style={{ gridColumn: 'span 5' }}>
        {/* Risk Score Gauge Card */}
        <div className="glass-panel" style={{
          padding: '24px',
          marginBottom: '24px',
          borderColor: riskStyle.border,
          boxShadow: riskStyle.glow
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Accident Probability Index
            </span>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: '6px',
              background: riskStyle.bg,
              color: riskStyle.color,
              border: `1px solid ${riskStyle.border}`
            }}>
              {currentResult?.riskLevel || 'Moderate'} Risk Level
            </span>
          </div>

          {/* SVG Circular Radial Gauge */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px 0' }}>
            <div style={{ position: 'relative', width: '180px', height: '180px' }}>
              <svg className="gauge-svg" width="180" height="180" viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
                {/* Background Track */}
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="transparent"
                  stroke="#1e293b"
                  strokeWidth="16"
                />
                {/* Active Risk Stroke */}
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="transparent"
                  stroke={riskStyle.color}
                  strokeWidth="16"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>

              {/* Centered Score */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>
                  {riskPercent}%
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Risk Probability
                </span>
              </div>
            </div>

            {/* Model Metadata */}
            <div style={{
              display: 'flex',
              gap: '16px',
              marginTop: '16px',
              fontSize: '0.78rem',
              color: 'var(--text-muted)'
            }}>
              <div>
                <span>Model: </span>
                <strong style={{ color: '#fff' }}>{currentResult?.model || selectedModel}</strong>
              </div>
              <div>
                <span>Confidence: </span>
                <strong style={{ color: 'var(--brand-cyan)' }}>{Math.round((currentResult?.confidenceScore ?? 0.94) * 100)}%</strong>
              </div>
              <div>
                <span>Latency: </span>
                <strong style={{ color: '#10b981' }}>22ms</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Explainability Quick Snapshot (SHAP Top Factors) */}
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '0.95rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} color="var(--brand-cyan)" />
              Top Explainable Factors (SHAP)
            </h3>
            <button
              onClick={() => setActiveTab('benchmarks')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--brand-cyan)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>Full XAI Analysis</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(shapData?.featureContributions || []).slice(0, 4).map((f, idx) => (
              <div key={idx} style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f1f5f9' }}>
                    {f.displayName}
                  </span>
                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    color: f.shapValue >= 0 ? 'var(--xai-positive)' : 'var(--xai-negative)'
                  }}>
                    {f.shapValue >= 0 ? `+${(f.shapValue * 100).toFixed(1)}%` : `${(f.shapValue * 100).toFixed(1)}%`}
                  </span>
                </div>
                <div style={{ width: '100%', height: '5px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.min(100, Math.abs(f.shapValue) * 350)}%`,
                    height: '100%',
                    background: f.shapValue >= 0 ? 'var(--xai-positive)' : 'var(--xai-negative)',
                    borderRadius: '3px'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Decision Support & Recommendations */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Compass size={16} color="var(--brand-cyan)" />
            ITS Decision Support & Safe Action
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recommendations.slice(0, 3).map((rec, i) => (
              <div key={i} style={{
                background: rec.urgency === 'Critical' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                border: `1px solid ${rec.urgency === 'Critical' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.25)'}`,
                borderRadius: '8px',
                padding: '10px 12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: rec.urgency === 'Critical' ? '#f87171' : '#fbbf24' }}>
                    {rec.title}
                  </span>
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    background: rec.urgency === 'Critical' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: rec.urgency === 'Critical' ? '#f87171' : '#fbbf24'
                  }}>
                    {rec.urgency}
                  </span>
                </div>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {rec.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
