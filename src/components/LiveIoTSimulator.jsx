import React, { useState, useEffect } from 'react';
import {
  Radio,
  Activity,
  CheckCircle2,
  AlertOctagon,
  ShieldAlert,
  Thermometer,
  Gauge,
  Car,
  RefreshCw,
  SlidersHorizontal,
  CloudRain
} from 'lucide-react';

export default function LiveIoTSimulator() {
  const [streamData, setStreamData] = useState([]);
  const [isStreaming, setIsStreaming] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());
  const [dataQualityStats, setDataQualityStats] = useState({
    packetsReceived: 14820,
    validPackets: 14812,
    rejectedAnomalies: 8,
    integrityRate: 99.94
  });

  // Fetch or simulate streaming IoT feeds
  const fetchIoTData = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/iot/live');
      if (res.ok) {
        const json = await res.json();
        setStreamData(json.corridors || []);
      }
    } catch (err) {
      // Fallback local simulation if offline
      const mock = [
        { id: 'IOT-01', location: 'Ring Expressway km 14', speed: 82 + Math.round((Math.random() - 0.5) * 10), volume: 1850 + Math.round((Math.random() - 0.5) * 150), weather: 'Rain', surfaceTemp: 19.4, frictionCoeff: 0.52 },
        { id: 'IOT-02', location: 'Arterial Blvd Jct 4', speed: 44 + Math.round((Math.random() - 0.5) * 6), volume: 1420 + Math.round((Math.random() - 0.5) * 100), weather: 'Clear', surfaceTemp: 24.1, frictionCoeff: 0.85 },
        { id: 'IOT-03', location: 'North Bridge Flyover', speed: 67 + Math.round((Math.random() - 0.5) * 12), volume: 2100 + Math.round((Math.random() - 0.5) * 200), weather: 'Fog', surfaceTemp: 16.8, frictionCoeff: 0.61 },
        { id: 'IOT-04', location: 'Industrial Sector Crossing', speed: 36 + Math.round((Math.random() - 0.5) * 8), volume: 1100 + Math.round((Math.random() - 0.5) * 80), weather: 'Storm', surfaceTemp: 18.2, frictionCoeff: 0.44 }
      ];
      setStreamData(mock);
    }
    setLastUpdated(new Date().toLocaleTimeString());
    setDataQualityStats(prev => ({
      ...prev,
      packetsReceived: prev.packetsReceived + 4,
      validPackets: prev.validPackets + 4
    }));
  };

  useEffect(() => {
    fetchIoTData();
    let interval = null;
    if (isStreaming) {
      interval = setInterval(fetchIoTData, 3000);
    }
    return () => clearInterval(interval);
  }, [isStreaming]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Stream Controls & Data Quality Layer Header */}
      <div className="glass-panel" style={{
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Radio size={20} color="var(--brand-cyan)" />
            <h2 style={{ fontSize: '1.25rem', color: '#f8fafc' }}>
              Real-Time IoT Sensor Telemetry & Data Quality Layer
            </h2>
            <div className="status-dot" style={{ background: isStreaming ? '#10b981' : '#f59e0b' }}></div>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Live induction loop detectors, laser speed guns, pavement sensors, and automated data cleaning
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            Updated: {lastUpdated}
          </span>
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '6px 14px' }}
          >
            <RefreshCw size={14} className={isStreaming ? 'animate-spin' : ''} />
            <span>{isStreaming ? 'Live Stream Active (3s)' : 'Stream Paused'}</span>
          </button>
        </div>
      </div>

      {/* Data Quality & Validation Summary (Image 4) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '16px' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Packets Ingested</span>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px' }}>
            {dataQualityStats.packetsReceived.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            <CheckCircle2 size={12} />
            <span>Telemetry streams clean</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Ingestion Integrity</span>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
            {dataQualityStats.integrityRate}%
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            ISO 14813 ITS compliant
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Anomalies Filtered</span>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--brand-cyan)', marginTop: '4px' }}>
            {dataQualityStats.rejectedAnomalies} Outliers
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Noise & spike suppression
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sensor Nodes Active</span>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#a855f7', marginTop: '4px' }}>
            24 Strategic Nodes
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            100% online availability
          </div>
        </div>
      </div>

      {/* Corridor Sensor Stream Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '18px' }}>
        {streamData.map((node) => {
          const isHighSpeed = node.speed > 80;
          const isLowFriction = node.frictionCoeff < 0.60;

          return (
            <div key={node.id} className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: 'rgba(56, 189, 248, 0.15)',
                      color: 'var(--brand-cyan)',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {node.id}
                    </span>
                    <h3 style={{ fontSize: '1rem', color: '#f8fafc' }}>{node.location}</h3>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>
                    Weather: {node.weather}
                  </span>
                </div>

                <div className="badge-status" style={{
                  background: isLowFriction ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  color: isLowFriction ? 'var(--risk-severe)' : 'var(--risk-low)'
                }}>
                  {isLowFriction ? 'Friction Warning' : 'Stable Flow'}
                </div>
              </div>

              {/* Grid Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                <div style={{ background: '#090d16', padding: '10px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Flow Speed</span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: isHighSpeed ? 'var(--risk-severe)' : '#f8fafc' }}>
                    {node.speed} km/h
                  </div>
                </div>

                <div style={{ background: '#090d16', padding: '10px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Flow Volume</span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--brand-cyan)' }}>
                    {node.volume} veh/h
                  </div>
                </div>

                <div style={{ background: '#090d16', padding: '10px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Surface Friction (μ)</span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: isLowFriction ? 'var(--risk-high)' : '#10b981' }}>
                    {node.frictionCoeff}
                  </div>
                </div>

                <div style={{ background: '#090d16', padding: '10px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Road Temp</span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
                    {node.surfaceTemp}°C
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
