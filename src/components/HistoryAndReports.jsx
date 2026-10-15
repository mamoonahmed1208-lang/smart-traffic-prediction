import React, { useState, useEffect } from 'react';
import {
  History,
  Download,
  Trash2,
  Eye,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Sparkles,
  RefreshCw,
  Database
} from 'lucide-react';

export default function HistoryAndReports({ refreshTrigger }) {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/history');
      if (res.ok) {
        const data = await res.json();
        setHistoryList(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.warn('History fetch fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger]);

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/history/${id}`, { method: 'DELETE' });
      setHistoryList(prev => prev.filter(item => item._id !== id));
      if (selectedRecord?._id === id) setSelectedRecord(null);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleExportCSV = () => {
    if (historyList.length === 0) return;
    const headers = ['Timestamp', 'Model', 'Location', 'Speed', 'SpeedLimit', 'Weather', 'RoadSurface', 'RiskPercentage', 'RiskLevel'];
    const rows = historyList.map(item => [
      new Date(item.timestamp).toISOString(),
      item.modelUsed,
      item.inputs?.locationName || 'Metropolitan Junction',
      item.inputs?.averageSpeed,
      item.inputs?.speedLimit,
      item.inputs?.weather,
      item.inputs?.roadSurface,
      item.prediction?.riskPercentage,
      item.prediction?.riskLevel
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `traffic_prediction_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    if (historyList.length === 0) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(historyList, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `traffic_prediction_history_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredHistory = historyList.filter(item => {
    const matchesFilter = filterSeverity === 'ALL' || item.prediction?.riskLevel?.toUpperCase() === filterSeverity;
    const matchesSearch = (item.inputs?.locationName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.modelUsed || '').toLowerCase().includes(searchQuery.toLowerCase());
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header Card */}
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
            <Database size={20} color="var(--brand-cyan)" />
            <h2 style={{ fontSize: '1.25rem', color: '#f8fafc' }}>
              MongoDB Prediction Audit Log
            </h2>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '6px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981'
            }}>
              {historyList.length} Records Persisted
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Complete historical registry of AI predictions and corresponding SHAP/LIME explanation metadata
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={fetchHistory} className="btn-secondary" style={{ fontSize: '0.78rem', padding: '6px 12px' }}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button onClick={handleExportCSV} className="btn-secondary" style={{ fontSize: '0.78rem', padding: '6px 12px' }}>
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <button onClick={handleExportJSON} className="btn-secondary" style={{ fontSize: '0.78rem', padding: '6px 12px' }}>
            <Download size={14} />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
          <input
            type="text"
            placeholder="Search by location or model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px', background: '#090d16', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          {['ALL', 'SEVERE', 'HIGH', 'MODERATE', 'LOW'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterSeverity(lvl)}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: filterSeverity === lvl ? 'var(--brand-blue)' : 'transparent',
                color: filterSeverity === lvl ? '#fff' : 'var(--text-muted)'
              }}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ background: '#090d16', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Timestamp</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Location</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Model</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Speed / Limit</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Weather / Road</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Risk Score</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Severity</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-dim)' }}>
                    No prediction records found matching filters. Run a prediction from the Studio to populate.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => {
                  const riskColor = getRiskColor(item.prediction?.riskLevel);
                  const isSelected = selectedRecord?._id === item._id;

                  return (
                    <tr
                      key={item._id}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        background: isSelected ? 'rgba(56, 189, 248, 0.08)' : 'transparent',
                        transition: 'background 0.15s'
                      }}
                    >
                      <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.76rem' }}>
                        {new Date(item.timestamp).toLocaleString()}
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: '#f8fafc' }}>
                        {item.inputs?.locationName || 'Metropolitan Junction'}
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--brand-cyan)' }}>
                        {item.modelUsed}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>
                        {item.inputs?.averageSpeed} / {item.inputs?.speedLimit} km/h
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                        {item.inputs?.weather} ({item.inputs?.roadSurface})
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: riskColor, fontFamily: 'var(--font-mono)' }}>
                        {item.prediction?.riskPercentage}%
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: `${riskColor}22`,
                          color: riskColor,
                          border: `1px solid ${riskColor}44`
                        }}>
                          {item.prediction?.riskLevel}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            onClick={() => setSelectedRecord(item)}
                            className="btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                            title="Inspect SHAP / LIME Explanation"
                          >
                            <Eye size={13} color="var(--brand-cyan)" />
                            <span>XAI</span>
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            style={{
                              background: 'transparent',
                              border: '1px solid rgba(239, 68, 68, 0.25)',
                              color: '#ef4444',
                              borderRadius: '6px',
                              padding: '4px 8px',
                              cursor: 'pointer'
                            }}
                            title="Delete record from MongoDB"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Inspection Modal / Drawer */}
      {selectedRecord && (
        <div className="glass-panel" style={{ padding: '24px', borderColor: 'var(--brand-cyan)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="var(--brand-cyan)" />
                Historical Record Inspection: {selectedRecord.inputs?.locationName}
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                MongoDB Document ID: {selectedRecord._id} | {new Date(selectedRecord.timestamp).toLocaleString()}
              </span>
            </div>
            <button onClick={() => setSelectedRecord(null)} className="btn-secondary" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
              Close Inspection
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div style={{ background: '#090d16', padding: '14px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Inputs Evaluated</span>
              <ul style={{ fontSize: '0.78rem', color: '#f8fafc', marginTop: '6px', listStyle: 'none', lineHeight: 1.6 }}>
                <li>Speed: <strong>{selectedRecord.inputs?.averageSpeed} km/h</strong> (Limit: {selectedRecord.inputs?.speedLimit} km/h)</li>
                <li>Density: <strong>{selectedRecord.inputs?.trafficDensity}%</strong></li>
                <li>Weather: <strong>{selectedRecord.inputs?.weather}</strong></li>
                <li>Road: <strong>{selectedRecord.inputs?.roadType} ({selectedRecord.inputs?.roadSurface})</strong></li>
              </ul>
            </div>

            <div style={{ background: '#090d16', padding: '14px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>SHAP Attribution Summary</span>
              <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {(selectedRecord.shapExplanation?.featureContributions || []).slice(0, 3).map((f, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{f.displayName.split(' (')[0]}:</span>
                    <strong style={{ color: f.shapValue >= 0 ? 'var(--xai-positive)' : 'var(--xai-negative)' }}>
                      {f.shapValue >= 0 ? `+${(f.shapValue * 100).toFixed(1)}%` : `${(f.shapValue * 100).toFixed(1)}%`}
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#090d16', padding: '14px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Decisions Enacted</span>
              <div style={{ marginTop: '6px' }}>
                {(selectedRecord.recommendations || []).slice(0, 2).map((rec, i) => (
                  <div key={i} style={{ fontSize: '0.75rem', color: '#f8fafc', marginBottom: '4px' }}>
                    • {rec.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
