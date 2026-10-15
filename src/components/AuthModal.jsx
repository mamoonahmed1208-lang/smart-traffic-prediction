import React, { useState } from 'react';
import {
  X,
  User,
  ShieldCheck,
  Lock,
  Mail,
  CheckCircle2,
  Cpu,
  LogIn
} from 'lucide-react';

export default function AuthModal({ isOpen, onClose, currentUser, onLogin }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('switch'); // 'switch' | 'login'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const PRESET_USERS = [
    {
      id: 'usr_1',
      name: 'Mamoon Ahmed',
      email: 'officer@its.gov',
      role: 'Traffic Authority Officer',
      department: 'Central ITS Command Center',
      access: 'Full Dispatch & Speed Calibration Rights'
    },
    {
      id: 'usr_2',
      name: 'Dr. Sarah Vance',
      email: 'scientist@mobility.ai',
      role: 'Data Scientist / ML Engineer',
      department: 'Autonomous & Predictive Mobility Lab',
      access: 'SHAP / LIME Hyperparameter Tuning'
    },
    {
      id: 'usr_3',
      name: 'Urban Planning Team',
      email: 'planner@smartcity.org',
      role: 'Urban City Planner',
      department: 'Infrastructure Safety Commission',
      access: 'Blackspot GIS & Corridor History'
    }
  ];

  const handleSelectUser = (u) => {
    onLogin(u);
    onClose();
  };

  const handleCustomLogin = (e) => {
    e.preventDefault();
    const newUser = {
      id: `usr_${Date.now()}`,
      name: (email ? email.split('@')[0] : 'OFFICER').toUpperCase(),
      email: email || 'officer@its.gov',
      role: 'Traffic Authority Officer',
      department: 'Regional Traffic Command'
    };
    onLogin(newUser);
    onClose();
  };

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
        maxWidth: '520px',
        padding: '28px',
        border: '1px solid rgba(56, 189, 248, 0.4)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={20} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: '#f8fafc' }}>
                User Authentication & RBAC
              </h3>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Role-Based Access for Traffic Authority & Data Science
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              borderRadius: '8px',
              padding: '6px',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Preset Role Selector */}
        <div style={{ marginBottom: '20px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Active Personnel Profiles
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
            {PRESET_USERS.map((u) => {
              const isCurrent = currentUser.email === u.email;
              return (
                <div
                  key={u.id}
                  onClick={() => handleSelectUser(u)}
                  style={{
                    background: isCurrent ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${isCurrent ? 'var(--brand-cyan)' : 'var(--border-subtle)'}`,
                    borderRadius: '10px',
                    padding: '12px 14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <strong style={{ fontSize: '0.88rem', color: '#f8fafc' }}>{u.name}</strong>
                      <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '4px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        color: 'var(--brand-cyan)'
                      }}>
                        {u.role}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {u.department} • {u.access}
                    </p>
                  </div>

                  {isCurrent && (
                    <div className="badge-status" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                      <CheckCircle2 size={13} />
                      <span>Active</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Login Form */}
        <form onSubmit={handleCustomLogin} style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Custom JWT Login
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
            <input
              type="text"
              placeholder="Official Email (e.g. officer@its.gov)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Security Access Passcode"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="btn-primary" style={{ padding: '10px', fontSize: '0.85rem' }}>
              <LogIn size={15} />
              <span>Sign In & Verify Credentials</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
