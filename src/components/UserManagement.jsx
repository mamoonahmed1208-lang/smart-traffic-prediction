import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  UserPlus,
  CheckCircle2,
  Lock,
  Mail,
  Building,
  Key,
  Shield,
  Eye,
  Settings,
  Activity
} from 'lucide-react';

export default function UserManagement({ currentUser, setCurrentUser }) {
  const [users, setUsers] = useState([
    {
      id: 'usr_1',
      name: 'Mamoon Ahmed',
      email: 'mamoon.ahmed@its.gov',
      role: 'Traffic Authority Officer',
      department: 'Central ITS Command & Dispatch',
      status: 'Active',
      lastLogin: 'Today, 14:20',
      badgeId: 'ITS-OFF-092'
    },
    {
      id: 'usr_2',
      name: 'Dr. Sarah Vance',
      email: 'sarah.vance@mobility.ai',
      role: 'Data Scientist / ML Engineer',
      department: 'Autonomous Mobility & AI Research Lab',
      status: 'Active',
      lastLogin: 'Yesterday, 18:45',
      badgeId: 'ITS-RES-014'
    },
    {
      id: 'usr_3',
      name: 'Eng. David Chen',
      email: 'david.chen@smartcity.org',
      role: 'Urban City Planner',
      department: 'Metropolitan Infrastructure & Road Safety',
      status: 'Active',
      lastLogin: 'Oct 12, 11:15',
      badgeId: 'ITS-PLN-044'
    },
    {
      id: 'usr_4',
      name: 'Officer Aisha Khan',
      email: 'aisha.khan@traffic.police.gov',
      role: 'Highway Patrol Commander',
      department: 'Rapid Incident Clearance & Field Units',
      status: 'Active',
      lastLogin: 'Today, 08:30',
      badgeId: 'ITS-ENF-118'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: 'Traffic Authority Officer',
    department: ''
  });

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserData.name || !newUserData.email) return;

    const created = {
      id: `usr_${Date.now()}`,
      name: newUserData.name,
      email: newUserData.email,
      role: newUserData.role,
      department: newUserData.department || 'Regional Traffic Operations',
      status: 'Active',
      lastLogin: 'Just now',
      badgeId: `ITS-${Math.floor(100 + Math.random() * 900)}`
    };

    setUsers([...users, created]);
    setShowAddModal(false);
    setNewUserData({ name: '', email: '', role: 'Traffic Authority Officer', department: '' });
  };

  const permissionsMatrix = [
    { module: 'Real-Time Prediction Studio', officer: true, scientist: true, planner: true, citizen: true },
    { module: 'SHAP & LIME XAI Diagnostics', officer: true, scientist: true, planner: true, citizen: false },
    { module: 'Geospatial Hotspot GIS Map', officer: true, scientist: true, planner: true, citizen: true },
    { module: 'Variable Message Sign (VMS) Dispatch', officer: true, scientist: false, planner: false, citizen: false },
    { module: 'Policymaker Infrastructure Reports', officer: true, scientist: true, planner: true, citizen: false },
    { module: 'MongoDB Audit History Export (CSV/JSON)', officer: true, scientist: true, planner: true, citizen: false },
    { module: 'Scikit-Learn ML Model Retraining', officer: false, scientist: true, planner: false, citizen: false },
    { module: 'User Role & Personnel Administration', officer: true, scientist: false, planner: false, citizen: false }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
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
            <Users size={22} color="var(--brand-cyan)" />
            <h2 style={{ fontSize: '1.3rem', color: '#f8fafc' }}>
              User Management & Role-Based Access Control (RBAC)
            </h2>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '6px',
              background: 'rgba(168, 85, 247, 0.15)',
              color: '#c084fc'
            }}>
              Synopsis Sec 4.1.2 Inclusion
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Manage authorized ITS personnel, verify role privileges, and switch active operating sessions
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
          style={{ padding: '8px 16px', fontSize: '0.82rem' }}
        >
          <UserPlus size={15} />
          <span>Provision New Personnel</span>
        </button>
      </div>

      {/* Personnel Directory Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '18px' }}>
        {users.map((u) => {
          const isCurrent = currentUser?.email === u.email;

          return (
            <div
              key={u.id}
              className="glass-panel"
              style={{
                padding: '20px',
                borderColor: isCurrent ? 'var(--brand-cyan)' : 'var(--border-subtle)',
                background: isCurrent ? 'rgba(56, 189, 248, 0.06)' : 'var(--bg-card)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '1.05rem', color: '#f8fafc' }}>{u.name}</h3>
                    {isCurrent && (
                      <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '4px',
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#10b981'
                      }}>
                        CURRENT ACTIVE
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.76rem', color: 'var(--brand-cyan)', fontWeight: 600 }}>
                    {u.role}
                  </span>
                </div>

                <span style={{
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-dim)',
                  background: '#090d16',
                  padding: '3px 8px',
                  borderRadius: '5px'
                }}>
                  {u.badgeId}
                </span>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px' }}>
                <div><strong>Email:</strong> {u.email}</div>
                <div><strong>Department:</strong> {u.department}</div>
                <div><strong>Last Activity:</strong> {u.lastLogin}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                <span style={{ fontSize: '0.72rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={12} />
                  <span>Cleared for ITS Dispatch</span>
                </span>

                {!isCurrent && (
                  <button
                    onClick={() => setCurrentUser(u)}
                    className="btn-secondary"
                    style={{ fontSize: '0.74rem', padding: '4px 10px' }}
                  >
                    Switch to this User
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* RBAC Role Permissions Matrix */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.05rem', color: '#f8fafc', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={18} color="var(--brand-cyan)" />
          Role-Based Access Control (RBAC) Entitlements Matrix
        </h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Granular permission boundaries governing system interactions and dispatch authority
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#090d16', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px 14px', fontWeight: 600 }}>System Functional Capability</th>
                <th style={{ padding: '10px 14px', fontWeight: 600, textAlign: 'center' }}>Traffic Officer</th>
                <th style={{ padding: '10px 14px', fontWeight: 600, textAlign: 'center' }}>Data Scientist</th>
                <th style={{ padding: '10px 14px', fontWeight: 600, textAlign: 'center' }}>City Planner</th>
                <th style={{ padding: '10px 14px', fontWeight: 600, textAlign: 'center' }}>Citizen / Public</th>
              </tr>
            </thead>
            <tbody>
              {permissionsMatrix.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '10px 14px', color: '#f8fafc', fontWeight: 500 }}>
                    {row.module}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                    {row.officer ? <CheckCircle2 size={16} color="#10b981" style={{ margin: '0 auto' }} /> : <Lock size={14} color="#64748b" style={{ margin: '0 auto' }} />}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                    {row.scientist ? <CheckCircle2 size={16} color="#10b981" style={{ margin: '0 auto' }} /> : <Lock size={14} color="#64748b" style={{ margin: '0 auto' }} />}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                    {row.planner ? <CheckCircle2 size={16} color="#10b981" style={{ margin: '0 auto' }} /> : <Lock size={14} color="#64748b" style={{ margin: '0 auto' }} />}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                    {row.citizen ? <CheckCircle2 size={16} color="#10b981" style={{ margin: '0 auto' }} /> : <Lock size={14} color="#64748b" style={{ margin: '0 auto' }} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision User Modal */}
      {showAddModal && (
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
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', marginBottom: '16px' }}>
              Provision New ITS Personnel Account
            </h3>

            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#f8fafc', display: 'block', marginBottom: '4px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Officer John Doe"
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#f8fafc', display: 'block', marginBottom: '4px' }}>
                  Official Email
                </label>
                <input
                  type="email"
                  placeholder="e.g. jdoe@its.gov"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#f8fafc', display: 'block', marginBottom: '4px' }}>
                  Department / Bureau
                </label>
                <input
                  type="text"
                  placeholder="e.g. Traffic Safety Analysis Division"
                  value={newUserData.department}
                  onChange={(e) => setNewUserData({ ...newUserData, department: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#f8fafc', display: 'block', marginBottom: '4px' }}>
                  Role Assignment
                </label>
                <select
                  value={newUserData.role}
                  onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                >
                  <option value="Traffic Authority Officer">Traffic Authority Officer</option>
                  <option value="Data Scientist / ML Engineer">Data Scientist / ML Engineer</option>
                  <option value="Urban City Planner">Urban City Planner</option>
                  <option value="Highway Patrol Commander">Highway Patrol Commander</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                  style={{ fontSize: '0.8rem' }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ fontSize: '0.8rem' }}>
                  Save & Provision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
