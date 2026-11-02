import React, { useState, useEffect, useRef } from 'react';
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
  Users,
  Sparkles,
  Bell,
  Mail,
  CheckCircle2,
  X,
  Check
} from 'lucide-react';
import { getUserMessages, markUserMessageAsRead } from '../utils/authStore';

export default function Navbar({
  activeTab,
  setActiveTab,
  onOpenArchitecture,
  currentUser,
  onOpenAuth,
  systemStatus,
  onOpenExclusive,
  lastMessageTrigger
}) {
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [messages, setMessages] = useState(() => getUserMessages(currentUser?.email));
  const dropdownRef = useRef(null);

  // Sync messages on user switch or new registration trigger
  useEffect(() => {
    setMessages(getUserMessages(currentUser?.email));
  }, [currentUser?.email, lastMessageTrigger]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsMessagesOpen(false);
      }
    };
    if (isMessagesOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMessagesOpen]);

  const unreadCount = messages.filter(m => !m.read).length;
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
          <div
            onClick={() => setActiveTab('benchmarks')}
            className="badge-status"
            style={{
              background: 'rgba(168, 85, 247, 0.12)',
              color: '#c084fc',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              cursor: 'pointer'
            }}
            title="Click to open Decision Tree Explorer & Model Architectures"
          >
            <Layers size={13} />
            <span>Random Forest & Decision Tree</span>
          </div>

          {/* Exclusive AI Prediction Command Suite */}
          <button
            onClick={onOpenExclusive}
            style={{
              fontSize: '0.8rem',
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.25), rgba(245, 158, 11, 0.2))',
              color: '#f8fafc',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 0 16px rgba(56, 189, 248, 0.25)',
              fontWeight: 700
            }}
            title="Launch Exclusive Dual-Model AI Risk Prediction Suite"
          >
            <Sparkles size={14} color="#38bdf8" />
            <span>Exclusive AI Prediction</span>
          </button>

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

          {/* System Messages & Notifications Tray */}
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
              onClick={() => setIsMessagesOpen(!isMessagesOpen)}
              className="btn-secondary"
              style={{
                fontSize: '0.8rem',
                padding: '7px 11px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                position: 'relative',
                border: unreadCount > 0 ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid var(--border-subtle)',
                background: unreadCount > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.04)'
              }}
              title="Official Messages & Registration Notifications"
            >
              <Bell size={15} color={unreadCount > 0 ? '#34d399' : 'var(--text-muted)'} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 10px rgba(16, 185, 129, 0.6)'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Messages Dropdown */}
            {isMessagesOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                right: 0,
                width: '360px',
                maxWidth: '90vw',
                background: '#090d16',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                borderRadius: '12px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8), 0 0 25px rgba(2, 132, 199, 0.25)',
                zIndex: 1000,
                padding: '16px',
                animation: 'fadeIn 0.2s ease-out'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                      System Messages Received
                    </h4>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Inbox for {currentUser.name}
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => {
                        messages.forEach(m => markUserMessageAsRead(currentUser.email, m.id));
                        setMessages(getUserMessages(currentUser.email));
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--brand-cyan)',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                        padding: '2px 6px'
                      }}
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto' }}>
                  {messages.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '24px 10px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      No messages received.
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        onClick={() => {
                          markUserMessageAsRead(currentUser.email, msg.id);
                          setMessages(getUserMessages(currentUser.email));
                        }}
                        style={{
                          background: msg.read ? 'rgba(255, 255, 255, 0.02)' : 'rgba(16, 185, 129, 0.08)',
                          border: `1px solid ${msg.read ? 'var(--border-subtle)' : 'rgba(16, 185, 129, 0.3)'}`,
                          borderRadius: '8px',
                          padding: '10px 12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <CheckCircle2 size={14} color="#10b981" />
                            <strong style={{ fontSize: '0.78rem', color: '#f8fafc' }}>{msg.title}</strong>
                          </div>
                          {!msg.read && (
                            <span style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: '#10b981'
                            }}></span>
                          )}
                        </div>
                        <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: '0 0 6px 0', lineHeight: 1.4 }}>
                          {msg.message}
                        </p>
                        {msg.badgeId && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.68rem', color: 'var(--brand-cyan)' }}>
                            <span>Badge ID: <strong>{msg.badgeId}</strong></span>
                            <span>•</span>
                            <span style={{ color: '#10b981' }}>Verified Dispatch</span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Auth Modal Trigger */}
          <button
            onClick={onOpenAuth}
            className="btn-secondary"
            style={{
              fontSize: '0.8rem',
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              background: 'rgba(56, 189, 248, 0.08)'
            }}
            title="Sign in, register, or switch ITS personnel profile"
          >
            <User size={15} color="var(--brand-cyan)" />
            <span style={{ fontWeight: 600, color: '#f8fafc' }}>{currentUser.name}</span>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '1px 6px',
              borderRadius: '4px',
              background: 'rgba(255, 255, 255, 0.08)',
              color: 'var(--brand-cyan)'
            }}>
              {currentUser.role ? currentUser.role.split(' ')[0] : 'Officer'}
            </span>
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
