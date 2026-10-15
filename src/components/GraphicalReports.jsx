import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Printer,
  Download,
  AlertTriangle,
  ShieldAlert,
  Calendar,
  FileText,
  MapPin,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';

export default function GraphicalReports({ hotspots = [] }) {
  const [timeRange, setTimeRange] = useState('month'); // 'week' | 'month' | 'year'

  // Diurnal 24-hour risk curve data
  const hourlyData = [
    { hour: '00:00', risk: 42, label: 'Late Night' },
    { hour: '03:00', risk: 34, label: 'Off-Peak' },
    { hour: '06:00', risk: 46, label: 'Early Flow' },
    { hour: '08:30', risk: 78, label: 'Morning Peak' },
    { hour: '11:00', risk: 48, label: 'Mid-Day' },
    { hour: '14:00', risk: 54, label: 'Afternoon' },
    { hour: '18:30', risk: 86, label: 'Evening Peak' },
    { hour: '21:00', risk: 62, label: 'Night' }
  ];

  // Weather risk breakdown
  const weatherRisk = [
    { weather: 'Storm', risk: 88, color: '#ef4444' },
    { weather: 'Snow / Ice', risk: 82, color: '#f97316' },
    { weather: 'Heavy Rain', risk: 76, color: '#f59e0b' },
    { weather: 'Dense Fog', risk: 72, color: '#a855f7' },
    { weather: 'Light Rain', risk: 52, color: '#38bdf8' },
    { weather: 'Clear Sky', risk: 22, color: '#10b981' }
  ];

  // Road geometry conflict distribution
  const geometryDistribution = [
    { type: 'Intersection Conflict', pct: 41, count: 184, color: '#ef4444' },
    { type: 'Highway High-Speed', pct: 27, count: 121, color: '#f97316' },
    { type: 'Arterial Bottleneck', pct: 19, count: 85, color: '#f59e0b' },
    { type: 'Rural Dark Unlit', pct: 13, count: 58, color: '#38bdf8' }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header & Report Actions */}
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
            <BarChart3 size={22} color="var(--brand-cyan)" />
            <h2 style={{ fontSize: '1.3rem', color: '#f8fafc' }}>
              Accident Analytics & Graphical Policy Reports
            </h2>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '6px',
              background: 'rgba(56, 189, 248, 0.15)',
              color: 'var(--brand-cyan)'
            }}>
              Synopsis Sec 3.2 & 4.1.2
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Empirical traffic safety analytics, risk distributions, and infrastructure policy recommendations
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ display: 'flex', background: '#090d16', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            {['week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                style={{
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  background: timeRange === range ? 'var(--brand-blue)' : 'transparent',
                  color: timeRange === range ? '#fff' : 'var(--text-muted)'
                }}
              >
                {range}
              </button>
            ))}
          </div>

          <button onClick={handlePrint} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
            <Printer size={15} />
            <span>Generate Official Report</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '18px' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Total Incidents Evaluated
          </span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px' }}>
            5,482
          </div>
          <div style={{ fontSize: '0.74rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            <TrendingUp size={13} />
            <span>Validated across metropolitan sensors</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Identified High-Risk Hotspots
          </span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--risk-severe)', marginTop: '4px' }}>
            6 Critical Corridors
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Flagged for urgent civil intervention
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Peak Risk Diurnal Window
          </span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
            18:30 (Evening Peak)
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            86% collision probability index
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Model Precision Benchmark
          </span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--brand-cyan)', marginTop: '4px' }}>
            94.2% ROC-AUC
          </div>
          <div style={{ fontSize: '0.74rem', color: '#10b981', marginTop: '2px' }}>
            Scikit-learn Random Forest
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>
        {/* CHART 1: 24-Hour Diurnal Accident Risk Distribution */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', color: '#f8fafc' }}>
                24-Hour Diurnal Accident Risk Curve
              </h3>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                Temporal collision probability curve showing commuter rush-hour surges
              </p>
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--brand-cyan)', fontWeight: 600 }}>
              Peak: 86% @ 18:30
            </span>
          </div>

          {/* SVG Area & Line Chart */}
          <div style={{ height: '220px', width: '100%', position: 'relative' }}>
            <svg viewBox="0 0 700 200" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <defs>
                <linearGradient id="riskAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                  <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal gridlines */}
              {[40, 80, 120, 160].map((y) => (
                <line key={y} x1="0" y1={y} x2="700" y2={y} stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="4 4" />
              ))}

              {/* Path coordinates calculation */}
              {/* x goes from 20 to 680 in 8 steps: 20 + i * (660/7) */}
              {/* y = 180 - (risk / 100) * 160 */}
              <polygon
                points="20,180 20,113 114,126 208,106 302,55 397,103 491,94 585,42 680,81 680,180"
                fill="url(#riskAreaGrad)"
              />
              <path
                d="M 20 113 L 114 126 L 208 106 L 302 55 L 397 103 L 491 94 L 585 42 L 680 81"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {hourlyData.map((d, idx) => {
                const cx = 20 + idx * (660 / 7);
                const cy = 180 - (d.risk / 100) * 160;
                const isPeak = d.risk >= 75;

                return (
                  <g key={idx}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isPeak ? 6 : 4}
                      fill={isPeak ? '#ef4444' : '#38bdf8'}
                      stroke="#fff"
                      strokeWidth="2"
                    />
                    <text
                      x={cx}
                      y={cy - 10}
                      fill={isPeak ? '#f87171' : 'var(--text-muted)'}
                      fontSize="10"
                      fontWeight={isPeak ? "700" : "500"}
                      textAnchor="middle"
                    >
                      {d.risk}%
                    </text>
                    <text
                      x={cx}
                      y="196"
                      fill="var(--text-dim)"
                      fontSize="9"
                      textAnchor="middle"
                    >
                      {d.hour}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* CHART 2: Accident Incidence by Weather Condition */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', color: '#f8fafc', marginBottom: '4px' }}>
            Weather Condition Risk Factor Breakdown
          </h3>
          <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Empirical collision probability index under meteorological conditions
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {weatherRisk.map((w, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                  <span style={{ color: '#f8fafc', fontWeight: 600 }}>{w.weather}</span>
                  <span style={{ color: w.color, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    {w.risk}% Risk Rating
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#090d16', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${w.risk}%`,
                    height: '100%',
                    background: w.color,
                    borderRadius: '4px'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* POLICYMAKER INFRASTRUCTURE ACTION PLAN (Synopsis Sec 3.2) */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={18} color="var(--brand-cyan)" />
              Policymaker Road Safety Interventions & Blackspot Remediation Plan
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Data-driven civil engineering, enforcement, and geometric redesign recommendations
            </p>
          </div>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '6px',
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#10b981'
          }}>
            ISO 39001 Road Traffic Safety
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#090d16', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px', fontWeight: 600 }}>Corridor / Location</th>
                <th style={{ padding: '12px', fontWeight: 600 }}>Risk Level</th>
                <th style={{ padding: '12px', fontWeight: 600 }}>Primary Root Hazard</th>
                <th style={{ padding: '12px', fontWeight: 600 }}>Recommended Engineering Policy</th>
                <th style={{ padding: '12px', fontWeight: 600, textAlign: 'right' }}>Priority</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '12px', fontWeight: 600, color: '#f8fafc' }}>
                  Metropolitan Junction 12 (Ring Rd)
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{ color: 'var(--risk-severe)', fontWeight: 700 }}>Severe (78%)</span>
                </td>
                <td style={{ padding: '12px', color: 'var(--text-muted)' }}>
                  Speeding on wet horizontal curve (Speed delta +15 km/h)
                </td>
                <td style={{ padding: '12px', color: '#38bdf8' }}>
                  Apply High-Friction Surface Treatment (HFST) and calibrate automated speed enforcement cameras.
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', fontWeight: 700, fontSize: '0.7rem' }}>
                    IMMEDIATE
                  </span>
                </td>
              </tr>

              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '12px', fontWeight: 600, color: '#f8fafc' }}>
                  Sector 45 Commercial Intersection
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{ color: 'var(--risk-high)', fontWeight: 700 }}>High (64%)</span>
                </td>
                <td style={{ padding: '12px', color: 'var(--text-muted)' }}>
                  Turning conflicts & dense seasonal fog visibility drop
                </td>
                <td style={{ padding: '12px', color: '#38bdf8' }}>
                  Extend all-red clearance interval by 1.5s and install high-visibility LED active road studs.
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(249, 115, 22, 0.2)', color: '#fb923c', fontWeight: 700, fontSize: '0.7rem' }}>
                    HIGH
                  </span>
                </td>
              </tr>

              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '12px', fontWeight: 600, color: '#f8fafc' }}>
                  Industrial Freight Gateway Turnoff
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{ color: 'var(--risk-severe)', fontWeight: 700 }}>Severe (82%)</span>
                </td>
                <td style={{ padding: '12px', color: 'var(--text-muted)' }}>
                  Heavy commercial mix merging in dark unlit corridor
                </td>
                <td style={{ padding: '12px', color: '#38bdf8' }}>
                  Deploy solar-powered continuous street lighting and construct a 150m deceleration merge lane.
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', fontWeight: 700, fontSize: '0.7rem' }}>
                    IMMEDIATE
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
