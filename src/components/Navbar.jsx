import React from 'react';
import {
  Activity,
  Layers,
  MapPin,
  Radio,
  BarChart3,
  History,
  ShieldAlert,
  Database,
  Cpu,
  User,
  Workflow,
  FileText,
  Users
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  onOpenArchitecture,
  currentUser,
  onOpenAuth,
  systemStatus
}) {
  const tabs = [
    { id: 'prediction', label: 'Prediction & XAI Studio', icon: Activity },
    { id: 'hotspots', label: 'Risk Hotspot Map', icon: MapPin },
    { id: 'iot', label: 'Live IoT Telemetry', icon: Radio },
    { id: 'reports', label: 'Analytics & Reports', icon: FileText },
    { id: 'benchmarks', label: 'Model Metrics & Research', icon: BarChart3 },
    { id: 'history', label: 'MongoDB History', icon: History },
    { id: 'users', label: 'User Management', icon: Users }
  ];

  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(10, 15, 29, 0.92)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '12px 24px'
    }}>
      {/* Top Banner: Brand & Health Status */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '10px'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(56, 189, 248, 0.4)'
          }}>
            <ShieldAlert size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                EXPLAINABLE SMART TRAFFIC
              </h1>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '6px',
                background: 'rgba(56, 189, 248, 0.15)',
                color: 'var(--brand-cyan)',
                border: '1px solid rgba(56, 189, 248, 0.3)'
              }}>
                MERN + XAI
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Accident Risk Prediction Platform with SHAP & LIME Transparent Explanations
            </p>
          </div>
        </div>

        {/* System Subsystems Status Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* MongoDB Pill */}
          <div className="badge-status" style={{
            background: systemStatus.mongoStatus === 'connected' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
            color: systemStatus.mongoStatus === 'connected' ? 'var(--risk-low)' : 'var(--risk-moderate)',
            border: `1px solid ${systemStatus.mongoStatus === 'connected' ? 'var(--risk-low-border)' : 'var(--risk-moderate-border)'}`
          }}>
            <Database size={13} />
            <span>MongoDB: {systemStatus.mongoStatus === 'connected' ? 'Live (Port 27017)' : 'In-Memory Fallback'}</span>
            <div className="status-dot" style={{
              background: systemStatus.mongoStatus === 'connected' ? 'var(--risk-low)' : 'var(--risk-moderate)'
            }}></div>
          </div>

          {/* Express API Pill */}
          <div className="badge-status" style={{
            background: 'rgba(56, 189, 248, 0.12)',
            color: 'var(--brand-cyan)',
            border: '1px solid rgba(56, 189, 248, 0.3)'
          }}>
            <Cpu size={13} />
            <span>Express REST API (Port 5000)</span>
          </div>

          {/* Models Pill */}
          <div className="badge-status" style={{
            background: 'rgba(168, 85, 247, 0.12)',
            color: '#c084fc',
            border: '1px solid rgba(168, 85, 247, 0.3)'
          }}>
            <Layers size={13} />
            <span>Random Forest & Decision Tree</span>
          </div>

          {/* Architecture Modal Button */}
          <button
            onClick={onOpenArchitecture}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            title="View Synopsis System Architecture Diagram"
          >
            <Workflow size={15} color="#38bdf8" />
            <span>System Architecture</span>
          </button>

          {/* User Profile */}
          <button
            onClick={onOpenAuth}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
          >
            <User size={15} />
            <span>{currentUser.name}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tab Bar */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        overflowX: 'auto',
        paddingTop: '6px'
      }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-tab-btn ${isActive ? 'active' : ''}`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}
