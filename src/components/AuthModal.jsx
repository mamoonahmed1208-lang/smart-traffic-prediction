import React, { useState } from 'react';
import {
  X,
  User,
  ShieldCheck,
  Lock,
  Mail,
  CheckCircle2,
  LogIn,
  UserPlus,
  Eye,
  EyeOff,
  Building,
  AlertCircle,
  Sparkles,
  LogOut,
  BadgeCheck,
  Key,
  Copy,
  Check,
  ArrowRight,
  Shield
} from 'lucide-react';
import {
  PRESET_USERS,
  loginAccount,
  registerAccount,
  clearAuthSession
} from '../utils/authStore';

export default function AuthModal({ isOpen, onClose, currentUser, onLogin, onRegistrationSuccess }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register' | 'switch'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [registrationSuccessData, setRegistrationSuccessData] = useState(null);
  const [copiedBadge, setCopiedBadge] = useState(false);

  // Login Form State
  const [loginForm, setLoginForm] = useState({
    email: currentUser?.email || 'officer@its.gov',
    password: 'password123'
  });

  // Register Form State
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    role: 'Traffic Authority Officer',
    department: 'Central ITS Command Center',
    password: '',
    confirmPassword: ''
  });

  const clearMessages = () => {
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    clearMessages();
  };

  // Handle Preset Quick Select
  const handleSelectPreset = (presetUser) => {
    onLogin(presetUser);
    setSuccessMsg(`Switched personnel profile to ${presetUser.name}`);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      const res = await loginAccount({
        email: loginForm.email,
        password: loginForm.password
      });

      if (res.success && res.user) {
        setSuccessMsg(`Welcome back, ${res.user.name}!`);
        onLogin(res.user);
        setTimeout(() => {
          onClose();
        }, 600);
      } else {
        setErrorMsg(res.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      setErrorMsg('Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    if (!registerForm.name.trim()) {
      setErrorMsg('Full personnel name is required');
      return;
    }
    if (!registerForm.email.trim()) {
      setErrorMsg('Official email address is required');
      return;
    }
    if (registerForm.password.length < 6) {
      setErrorMsg('Security passcode must be at least 6 characters long');
      return;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      setErrorMsg('Security passcodes do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await registerAccount({
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
        role: registerForm.role,
        department: registerForm.department
      });

      if (res.success && res.user) {
        setRegistrationSuccessData({
          user: res.user,
          message: res.message || `Account created successfully for ${res.user.name}!`,
          registrationMessage: res.registrationMessage
        });
        onLogin(res.user);
        if (onRegistrationSuccess) {
          onRegistrationSuccess({
            user: res.user,
            message: res.message || `Account created successfully for ${res.user.name}!`,
            registrationMessage: res.registrationMessage
          });
        }
      } else {
        setErrorMsg(res.error || 'Registration failed.');
      }
    } catch (err) {
      setErrorMsg('Registration failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Sign Out
  const handleSignOut = () => {
    clearAuthSession();
    // Default back to guest / first preset
    const fallback = PRESET_USERS[0];
    onLogin(fallback);
    setSuccessMsg('Signed out of workstation session');
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const ROLES = [
    { label: 'Traffic Authority Officer', desc: 'Real-time incident dispatch & speed calibration' },
    { label: 'Data Scientist / ML Engineer', desc: 'SHAP / LIME XAI tuning & model retraining' },
    { label: 'Urban City Planner', desc: 'Accident blackspots GIS & infrastructure reports' },
    { label: 'Highway Patrol Commander', desc: 'Emergency highway interception & field units' }
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 8, 18, 0.88)',
      backdropFilter: 'blur(12px)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '520px',
        padding: '28px',
        border: '1px solid rgba(56, 189, 248, 0.4)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 30px rgba(2, 132, 199, 0.25)',
        maxHeight: '92vh',
        overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)'
            }}>
              <ShieldCheck size={22} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#f8fafc', fontWeight: 800 }}>
                ITS Security Authentication
              </h3>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Role-Based Access Control (RBAC) & Personnel Identity
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
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Active Session Bar */}
        {currentUser && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '10px 14px',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.15)',
                color: 'var(--brand-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.8rem'
              }}>
                {currentUser.name ? currentUser.name.charAt(0) : 'U'}
              </div>
              <div>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#f8fafc' }}>
                  {currentUser.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {currentUser.role} • {currentUser.email}
                </div>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Sign Out of workstation"
            >
              <LogOut size={12} />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        {/* Dedicated Registration Successful View */}
        {registrationSuccessData ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Success Banner */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.16), rgba(6, 78, 59, 0.28))',
              border: '1px solid rgba(16, 185, 129, 0.45)',
              borderRadius: '12px',
              padding: '18px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 0 24px rgba(16, 185, 129, 0.22)'
            }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10px',
                boxShadow: '0 0 25px rgba(16, 185, 129, 0.5)'
              }}>
                <CheckCircle2 size={30} color="#ffffff" />
              </div>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#34d399',
                background: 'rgba(16, 185, 129, 0.2)',
                padding: '3px 10px',
                borderRadius: '20px',
                marginBottom: '6px'
              }}>
                REGISTRATION SUCCESSFUL
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: '2px 0 6px 0' }}>
                Personnel Credentials Activated
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', maxWidth: '380px', margin: 0, lineHeight: 1.4 }}>
                Account for <strong style={{ color: '#fff' }}>{registrationSuccessData.user.name}</strong> has been created and verified in the Intelligent Transportation System.
              </p>
            </div>

            {/* Official ID Badge Card */}
            <div style={{
              background: '#090d16',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              borderRadius: '12px',
              padding: '14px 16px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, #10b981, #38bdf8, #a855f7)'
              }}></div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--brand-cyan)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={14} />
                  <span>ITS PERSONNEL CREDENTIALS</span>
                </span>
                <span style={{
                  fontSize: '0.66rem',
                  color: '#10b981',
                  fontWeight: 700,
                  background: 'rgba(16, 185, 129, 0.15)',
                  padding: '2px 7px',
                  borderRadius: '4px'
                }}>
                  SESSION ACTIVE
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.78rem' }}>
                <div>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.68rem', display: 'block' }}>Personnel Name</span>
                  <strong style={{ color: '#f8fafc' }}>{registrationSuccessData.user.name}</strong>
                </div>

                <div>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.68rem', display: 'block' }}>Operational Role</span>
                  <span style={{ color: 'var(--brand-cyan)', fontWeight: 600 }}>{registrationSuccessData.user.role}</span>
                </div>

                <div>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.68rem', display: 'block' }}>Security Badge ID</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <code style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      {registrationSuccessData.user.badgeId}
                    </code>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(registrationSuccessData.user.badgeId);
                        setCopiedBadge(true);
                        setTimeout(() => setCopiedBadge(false), 2000);
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: copiedBadge ? '#10b981' : 'var(--text-dim)',
                        cursor: 'pointer',
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      title="Copy Badge ID"
                    >
                      {copiedBadge ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>

                <div>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.68rem', display: 'block' }}>Department</span>
                  <span style={{ color: '#e2e8f0' }}>{registrationSuccessData.user.department}</span>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.68rem', display: 'block' }}>Official Email</span>
                  <span style={{ color: '#94a3b8' }}>{registrationSuccessData.user.email}</span>
                </div>
              </div>
            </div>

            {/* Official Message Received Notification */}
            <div style={{
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '10px',
              padding: '12px 14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Mail size={15} color="var(--brand-cyan)" />
                <strong style={{ fontSize: '0.78rem', color: '#f8fafc' }}>
                  Official Registration Message Received
                </strong>
                <span style={{ marginLeft: 'auto', fontSize: '0.66rem', color: '#10b981', fontWeight: 700 }}>
                  Delivered
                </span>
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                {registrationSuccessData.registrationMessage?.message || registrationSuccessData.message}
              </p>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '2px' }}>
              <button
                type="button"
                onClick={() => {
                  setRegistrationSuccessData(null);
                  onClose();
                }}
                className="btn-primary"
                style={{ padding: '12px', fontSize: '0.88rem', justifyContent: 'center', width: '100%' }}
              >
                <span>Proceed to ITS Prediction Dashboard</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => {
                  setRegistrationSuccessData(null);
                  setActiveTab('register');
                  setRegisterForm({
                    name: '',
                    email: '',
                    role: 'Traffic Authority Officer',
                    department: 'Central ITS Command Center',
                    password: '',
                    confirmPassword: ''
                  });
                }}
                className="btn-secondary"
                style={{ padding: '8px', fontSize: '0.78rem', justifyContent: 'center', width: '100%' }}
              >
                Provision Another User
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Navigation Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '6px',
          background: '#090d16',
          padding: '4px',
          borderRadius: '10px',
          border: '1px solid var(--border-subtle)',
          marginBottom: '20px'
        }}>
          <button
            onClick={() => handleTabChange('login')}
            style={{
              padding: '8px 12px',
              borderRadius: '7px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: activeTab === 'login' ? 'linear-gradient(135deg, #0284c7, #0369a1)' : 'transparent',
              color: activeTab === 'login' ? '#fff' : 'var(--text-muted)',
              transition: 'all 0.2s'
            }}
          >
            <LogIn size={14} />
            <span>Sign In</span>
          </button>

          <button
            onClick={() => handleTabChange('register')}
            style={{
              padding: '8px 12px',
              borderRadius: '7px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: activeTab === 'register' ? 'linear-gradient(135deg, #0284c7, #0369a1)' : 'transparent',
              color: activeTab === 'register' ? '#fff' : 'var(--text-muted)',
              transition: 'all 0.2s'
            }}
          >
            <UserPlus size={14} />
            <span>Register</span>
          </button>

          <button
            onClick={() => handleTabChange('switch')}
            style={{
              padding: '8px 12px',
              borderRadius: '7px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: activeTab === 'switch' ? 'linear-gradient(135deg, #0284c7, #0369a1)' : 'transparent',
              color: activeTab === 'switch' ? '#fff' : 'var(--text-muted)',
              transition: 'all 0.2s'
            }}
          >
            <User size={14} />
            <span>Profiles</span>
          </button>
        </div>

        {/* Feedback Alert Banners */}
        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: '8px',
            padding: '10px 14px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#f87171',
            fontSize: '0.78rem'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '8px',
            padding: '10px 14px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#34d399',
            fontSize: '0.78rem'
          }}>
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1. SIGN IN TAB */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Official Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="email"
                  required
                  placeholder="e.g. officer@its.gov"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  style={{ paddingLeft: '38px', width: '100%' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Security Passcode
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your security passcode"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  style={{ paddingLeft: '38px', paddingRight: '38px', width: '100%' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '11px',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-dim)',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked />
                <span>Remember on workstation</span>
              </label>
              <span style={{ color: 'var(--brand-cyan)', cursor: 'pointer' }} onClick={() => handleTabChange('switch')}>
                Switch role profile
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ padding: '12px', fontSize: '0.85rem', width: '100%', marginTop: '6px', justifyContent: 'center' }}
            >
              <LogIn size={16} />
              <span>{loading ? 'Authenticating Credentials...' : 'Sign In & Access Command Platform'}</span>
            </button>

            <div style={{
              textAlign: 'center',
              fontSize: '0.76rem',
              color: 'var(--text-dim)',
              marginTop: '4px',
              background: 'rgba(255, 255, 255, 0.02)',
              padding: '8px',
              borderRadius: '6px'
            }}>
              Demo Passcode: <code>password123</code> (or use preset switcher)
            </div>
          </form>
        )}

        {/* 2. REGISTRATION TAB */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Full Personnel Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Officer Vikram Sen"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  style={{ paddingLeft: '38px', width: '100%' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Official Government / Enterprise Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="email"
                  required
                  placeholder="e.g. vikram.sen@traffic.gov"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  style={{ paddingLeft: '38px', width: '100%' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Operational Role
                </label>
                <select
                  value={registerForm.role}
                  onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value })}
                  style={{ width: '100%', fontSize: '0.78rem' }}
                >
                  {ROLES.map(r => (
                    <option key={r.label} value={r.label}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  ITS Department
                </label>
                <div style={{ position: 'relative' }}>
                  <Building size={14} color="var(--text-dim)" style={{ position: 'absolute', left: '10px', top: '11px' }} />
                  <input
                    type="text"
                    placeholder="e.g. Northern Regional Command"
                    value={registerForm.department}
                    onChange={(e) => setRegisterForm({ ...registerForm, department: e.target.value })}
                    style={{ paddingLeft: '32px', width: '100%', fontSize: '0.78rem' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Security Passcode
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={14} color="var(--text-dim)" style={{ position: 'absolute', left: '10px', top: '11px' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Min 6 chars"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    style={{ paddingLeft: '32px', width: '100%', fontSize: '0.78rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Confirm Passcode
                </label>
                <div style={{ position: 'relative' }}>
                  <Key size={14} color="var(--text-dim)" style={{ position: 'absolute', left: '10px', top: '11px' }} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter passcode"
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                    style={{ paddingLeft: '32px', width: '100%', fontSize: '0.78rem' }}
                  />
                </div>
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px', cursor: 'pointer' }}>
              <input type="checkbox" required style={{ marginTop: '2px' }} />
              <span>I confirm authorization to operate the Intelligent Traffic Accident Prediction System under municipal road safety policy.</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ padding: '11px', fontSize: '0.85rem', width: '100%', marginTop: '6px', justifyContent: 'center' }}
            >
              <UserPlus size={16} />
              <span>{loading ? 'Creating Credentials...' : 'Create Account & Issue Badge ID'}</span>
            </button>
          </form>
        )}

        {/* 3. PERSONNEL PROFILES TAB */}
        {activeTab === 'switch' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Select Active Personnel Profile
            </span>
            {PRESET_USERS.map((u) => {
              const isCurrent = currentUser?.email === u.email;
              return (
                <div
                  key={u.id}
                  onClick={() => handleSelectPreset(u)}
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
                  onMouseEnter={(e) => e.currentTarget.style.background = isCurrent ? 'rgba(56, 189, 248, 0.16)' : 'rgba(255, 255, 255, 0.06)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = isCurrent ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.03)'}
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
                      {u.department} • Badge: <strong style={{ color: '#fff' }}>{u.badgeId}</strong>
                    </p>
                    <p style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '1px' }}>
                      {u.access}
                    </p>
                  </div>

                  {isCurrent ? (
                    <div className="badge-status" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', flexShrink: 0 }}>
                      <CheckCircle2 size={13} />
                      <span>Active</span>
                    </div>
                  ) : (
                    <button
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '0.72rem', flexShrink: 0 }}
                    >
                      <span>Switch</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
}
