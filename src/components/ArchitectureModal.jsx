import React from 'react';
import {
  X,
  Database,
  Cpu,
  Radio,
  Layers,
  Sparkles,
  BarChart3,
  ShieldAlert,
  ArrowRight,
  ArrowDown,
  CheckCircle2,
  Workflow
} from 'lucide-react';

export default function ArchitectureModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 8, 18, 0.85)',
      backdropFilter: 'blur(10px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '1050px',
        maxHeight: '92vh',
        overflowY: 'auto',
        padding: '30px',
        border: '1px solid rgba(56, 189, 248, 0.4)',
        boxShadow: '0 0 40px rgba(56, 189, 248, 0.2)'
      }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Workflow size={24} color="var(--brand-cyan)" />
              <h2 style={{ fontSize: '1.4rem', color: '#f8fafc' }}>
                EXPLAINABLE SMART TRAFFIC ACCIDENT PREDICTION SYSTEM
              </h2>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              System Architecture & Data Flow Diagram (As specified in Project Synopsis Section 6.1.2)
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Diagram Flow Container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* TOP TIER: Data Sources & Prediction Platform & Database */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 1fr', gap: '18px', alignItems: 'stretch' }}>
            {/* Box 1: Traffic Data Sources */}
            <div style={{
              background: '#0a101f',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '12px',
              padding: '18px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Radio size={18} color="#10b981" />
                <h3 style={{ fontSize: '0.95rem', color: '#10b981', fontWeight: 700 }}>
                  1. TRAFFIC DATA SOURCES
                </h3>
              </div>
              <ul style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.7, listStyle: 'none' }}>
                <li>• Live Telemetry Feeds</li>
                <li>• IoT Sensors (Speed & Loops)</li>
                <li>• CCTV Traffic Monitoring</li>
                <li>• GPS & Probe Vehicles</li>
                <li>• Weather Services (Rain/Fog/Ice)</li>
                <li>• Road Surface & Geometry</li>
              </ul>
            </div>

            {/* Box 2: Smart Traffic Analytics Platform */}
            <div style={{
              background: '#0a101f',
              border: '1px solid rgba(56, 189, 248, 0.5)',
              borderRadius: '12px',
              padding: '18px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Cpu size={18} color="var(--brand-cyan)" />
                <h3 style={{ fontSize: '0.95rem', color: 'var(--brand-cyan)', fontWeight: 700 }}>
                  2. AI/ML PREDICTION ENGINE
                </h3>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                <div><strong>Data Processing:</strong> Missing value imputation, one-hot encoding, normalization.</div>
                <div style={{ marginTop: '6px' }}><strong>Trained Models:</strong> Random Forest Classifier & Decision Tree.</div>
                <div style={{ marginTop: '6px' }}><strong>Output:</strong> Real-time Accident Probability (0% - 100%) & Confidence Interval.</div>
              </div>
            </div>

            {/* Box 3: Traffic Database (MongoDB) */}
            <div style={{
              background: '#0a101f',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              borderRadius: '12px',
              padding: '18px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Database size={18} color="#c084fc" />
                <h3 style={{ fontSize: '0.95rem', color: '#c084fc', fontWeight: 700 }}>
                  3. TRAFFIC DATABASE
                </h3>
              </div>
              <ul style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.7, listStyle: 'none' }}>
                <li>• <strong>MongoDB NoSQL Server</strong></li>
                <li>• Historical Accident Records</li>
                <li>• Geospatial Blackspot Maps</li>
                <li>• Prediction Audit History</li>
                <li>• User Roles & Authentication</li>
              </ul>
            </div>
          </div>

          {/* MIDDLE TIER: Explainable AI & Decision Support Layer */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9))',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            borderRadius: '14px',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Sparkles size={20} color="#fbbf24" />
              <h3 style={{ fontSize: '1.05rem', color: '#fbbf24', fontWeight: 700 }}>
                4. EXPLAINABLE AI & DECISION SUPPORT LAYER
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
              <div style={{ background: '#090d16', padding: '12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#f8fafc' }}>
                  Data Quality & Validation
                </span>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Cleans, filters noise, and validates sensor telemetry in real time.
                </p>
              </div>

              <div style={{ background: '#090d16', padding: '12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#f8fafc' }}>
                  Risk Hotspot Detection
                </span>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Clusters and pinpoints high-risk intersections and hazardous corridors.
                </p>
              </div>

              <div style={{ background: '#090d16', padding: '12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--brand-cyan)' }}>
                  Explainability (SHAP / LIME)
                </span>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Quantifies why risk is high or low with exact feature attributions.
                </p>
              </div>

              <div style={{ background: '#090d16', padding: '12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#10b981' }}>
                  Alerts & Recommendations
                </span>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Variable Message Sign warnings, speed reductions, and alternate diversions.
                </p>
              </div>
            </div>
          </div>

          {/* BOTTOM TIER: Dashboard & Report Layer */}
          <div style={{
            background: '#0a101f',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: '12px',
            padding: '18px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <BarChart3 size={18} color="var(--brand-cyan)" />
              <h3 style={{ fontSize: '0.95rem', color: '#f8fafc', fontWeight: 700 }}>
                5. DASHBOARD & REPORTING LAYER (React.js Frontend)
              </h3>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Accident Risk Score Gauge • Risk Hotspot Mapping • Explainable AI Insights (SHAP Waterfall & LIME Rules) • Safe Route Advice
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
