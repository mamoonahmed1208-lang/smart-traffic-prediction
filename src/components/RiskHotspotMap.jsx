import React, { useState } from 'react';
import {
  MapPin,
  AlertTriangle,
  Camera,
  Radio,
  Search,
  Filter,
  Car,
  Compass,
  ArrowUpRight,
  ShieldAlert,
  CloudRain,
  Eye
} from 'lucide-react';

export default function RiskHotspotMap({ hotspots = [], onSelectHotspot }) {
  const [selectedHotspot, setSelectedHotspot] = useState(hotspots[0] || null);
  const [filterLevel, setFilterLevel] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHotspots = hotspots.filter(h => {
    const matchesFilter = filterLevel === 'ALL' || h.riskLevel.toUpperCase() === filterLevel;
    const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          h.corridor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getRiskColor = (level) => {
    switch (level) {
      case 'Severe': return '#ef4444';
      case 'High': return '#f97316';
      case 'Moderate': return '#f59e0b';
      default: return '#10b981';
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px' }}>
      {/* MAP CANVAS & CONTROLS (8 cols) */}
      <div style={{ gridColumn: 'span 8' }}>
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Header & Filter Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={20} color="var(--brand-cyan)" />
                Metropolitan Accident Blackspots & Corridors
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Spatial risk mapping backed by MongoDB telemetry and live CCTV integration
              </p>
            </div>

            {/* Filter Buttons */}
            <div style={{ display: 'flex', gap: '6px', background: '#090d16', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              {['ALL', 'SEVERE', 'HIGH', 'MODERATE'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setFilterLevel(lvl)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    background: filterLevel === lvl ? 'var(--brand-blue)' : 'transparent',
                    color: filterLevel === lvl ? '#fff' : 'var(--text-muted)'
                  }}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
            <input
              type="text"
              placeholder="Search corridor or junction name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '36px' }}
            />
          </div>

          {/* Interactive Geospatial Canvas Visualizer */}
          <div style={{
            position: 'relative',
            height: '460px',
            background: 'radial-gradient(circle at 50% 50%, #0f1a30 0%, #080c16 100%)',
            borderRadius: '12px',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            overflow: 'hidden'
          }}>
            {/* Grid Coordinates Overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'linear-gradient(rgba(56, 189, 248, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.05) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              pointerEvents: 'none'
            }}></div>

            {/* Stylized Vector Roads & Highways */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
              {/* Outer Ring Expressway */}
              <path d="M 50 180 Q 250 80 550 140 T 750 320" fill="none" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="8" strokeDasharray="6 4" />
              {/* Grand Arterial Highway */}
              <path d="M 120 400 L 400 240 L 680 100" fill="none" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="6" />
              {/* River Valley Bridge */}
              <path d="M 320 50 Q 380 260 480 430" fill="none" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="10" />
              {/* Secondary Corridors */}
              <path d="M 180 80 L 220 380" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="3" />
              <path d="M 450 120 L 720 220" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="3" />
            </svg>

            {/* Hotspot Markers */}
            {filteredHotspots.map((h, i) => {
              const isSelected = selectedHotspot?.id === h.id;
              const color = getRiskColor(h.riskLevel);

              // Map coordinates to 2D canvas percentages
              const xPercent = 20 + ((h.lng - 77.19) * 1800) % 70;
              const yPercent = 25 + ((h.lat - 28.58) * 1200) % 65;

              return (
                <div
                  key={h.id}
                  onClick={() => {
                    setSelectedHotspot(h);
                    if (onSelectHotspot) onSelectHotspot(h);
                  }}
                  style={{
                    position: 'absolute',
                    left: `${xPercent}%`,
                    top: `${yPercent}%`,
                    transform: 'translate(-50%, -50%)',
                    cursor: 'pointer',
                    zIndex: isSelected ? 20 : 10,
                    transition: 'transform 0.2s ease'
                  }}
                >
                  {/* Outer Pulsing Aura for Severe/High */}
                  {(h.riskLevel === 'Severe' || h.riskLevel === 'High') && (
                    <div style={{
                      position: 'absolute',
                      width: '38px',
                      height: '38px',
                      left: '-11px',
                      top: '-11px',
                      borderRadius: '50%',
                      background: color,
                      opacity: 0.35,
                      animation: 'pulse-dot 1.8s infinite ease-out'
                    }}></div>
                  )}

                  {/* Marker Pin */}
                  <div style={{
                    width: isSelected ? '24px' : '18px',
                    height: isSelected ? '24px' : '18px',
                    borderRadius: '50%',
                    background: color,
                    border: '2px solid #ffffff',
                    boxShadow: `0 0 14px ${color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#fff' }}>
                      {h.currentRiskScore}
                    </span>
                  </div>

                  {/* Label tooltip */}
                  <div style={{
                    position: 'absolute',
                    top: '22px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    whiteSpace: 'nowrap',
                    background: 'rgba(10, 15, 29, 0.9)',
                    padding: '3px 8px',
                    borderRadius: '5px',
                    border: `1px solid ${isSelected ? color : 'var(--border-subtle)'}`,
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    color: '#f8fafc',
                    pointerEvents: 'none'
                  }}>
                    {h.name.split(' (')[0]}
                  </div>
                </div>
              );
            })}

            {/* Compass Rose */}
            <div style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(10, 15, 29, 0.8)',
              padding: '6px 10px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.72rem',
              color: 'var(--brand-cyan)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Compass size={14} />
              <span>GIS METRO GRID</span>
            </div>
          </div>
        </div>
      </div>

      {/* HOTSPOT DETAIL DRAWER (4 cols) */}
      <div style={{ gridColumn: 'span 4' }}>
        {selectedHotspot ? (
          <div className="glass-panel" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: `${getRiskColor(selectedHotspot.riskLevel)}22`,
                  color: getRiskColor(selectedHotspot.riskLevel),
                  border: `1px solid ${getRiskColor(selectedHotspot.riskLevel)}55`
                }}>
                  {selectedHotspot.riskLevel} Risk Hotspot
                </span>
                <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', marginTop: '6px' }}>
                  {selectedHotspot.name}
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {selectedHotspot.corridor}
                </p>
              </div>

              <div style={{
                fontSize: '1.4rem',
                fontWeight: 800,
                color: getRiskColor(selectedHotspot.riskLevel),
                fontFamily: 'var(--font-mono)'
              }}>
                {selectedHotspot.currentRiskScore}%
              </div>
            </div>

            {/* Active Alert Banner */}
            {selectedHotspot.activeAlert && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                borderRadius: '8px',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <AlertTriangle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.78rem', color: '#f87171', fontWeight: 600 }}>
                  {selectedHotspot.activeAlert}
                </span>
              </div>
            )}

            {/* Telemetry Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ background: '#090d16', padding: '10px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Average Speed</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                  {selectedHotspot.currentAvgSpeed} km/h
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginLeft: '4px' }}>
                    / {selectedHotspot.speedLimit} max
                  </span>
                </div>
              </div>

              <div style={{ background: '#090d16', padding: '10px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Daily Volume</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--brand-cyan)' }}>
                  {selectedHotspot.averageDailyVolume.toLocaleString()} veh/day
                </div>
              </div>

              <div style={{ background: '#090d16', padding: '10px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Historical Accidents</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f59e0b' }}>
                  {selectedHotspot.historicalAccidentsCount} logged
                </div>
              </div>

              <div style={{ background: '#090d16', padding: '10px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Active IoT Nodes</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#10b981' }}>
                  {selectedHotspot.iotSensorsCount} sensors live
                </div>
              </div>
            </div>

            {/* CCTV Live Status */}
            <div style={{
              background: '#090d16',
              padding: '12px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Camera size={16} color="#38bdf8" />
                <span style={{ fontSize: '0.78rem', color: '#f8fafc', fontWeight: 600 }}>
                  ITS CCTV Optical Feed
                </span>
              </div>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span className="status-dot" style={{ background: '#10b981' }}></span>
                RECORDING (1080p 60fps)
              </span>
            </div>

            {/* Primary Hazard Diagnosis */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '12px'
            }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Dominant Hazard Attribution:
              </span>
              <p style={{ fontSize: '0.84rem', fontWeight: 600, color: '#f8fafc', marginTop: '4px' }}>
                {selectedHotspot.primaryHazardFactor}
              </p>
            </div>
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Select a hotspot from the map to inspect live corridor telemetry
          </div>
        )}
      </div>
    </div>
  );
}
