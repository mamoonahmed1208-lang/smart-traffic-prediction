import React, { useState, useEffect, useRef } from 'react';
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
  Database,
  FileSpreadsheet,
  ChevronDown,
  Info,
  Check
} from 'lucide-react';
import { exportAuditHistoryToCSV, exportPredictionToCSV } from '../utils/csvExport';
import {
  fetchFullPredictionHistory,
  deletePredictionRecord,
  seedBenchmarkRecords,
  clearAllPredictionHistory
} from '../utils/historyStore';

export default function HistoryAndReports({ refreshTrigger }) {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const exportDropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(e.target)) {
        setShowExportOptions(false);
      }
    };
    if (showExportOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExportOptions]);

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const records = await fetchFullPredictionHistory();
      setHistoryList(Array.isArray(records) ? records : []);
    } catch (err) {
      console.warn('History fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger]);

  const handleDelete = async (id) => {
    try {
      const updated = await deletePredictionRecord(id);
      setHistoryList(updated);
      if (selectedRecord?._id === id) setSelectedRecord(null);
      showToast('Record deleted from audit history', 'info');
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleSeedDemoRecords = () => {
    const seeded = seedBenchmarkRecords();
    setHistoryList(seeded);
    showToast(`Loaded ${seeded.length} realistic benchmark accident prediction records`, 'success');
  };

  // Filtered History
  const filteredHistory = historyList.filter(item => {
    const matchesFilter = filterSeverity === 'ALL' || item.prediction?.riskLevel?.toUpperCase() === filterSeverity;
    const matchesSearch = (item.inputs?.locationName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.modelUsed || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Export CSV Handler
  const handleExportCSV = (mode = 'filtered') => {
    setShowExportOptions(false);

    let recordsToExport = [];
    let exportLabel = '';

    if (mode === 'all') {
      recordsToExport = historyList;
      exportLabel = `All Historical Records (${recordsToExport.length} entries)`;
    } else {
      recordsToExport = filteredHistory;
      exportLabel = `Filtered Records (${recordsToExport.length} entries)`;
    }

    if (recordsToExport.length === 0) {
      if (historyList.length === 0) {
        showToast('Audit log is empty. Loading benchmark dataset to export...', 'warning');
        const seeded = seedBenchmarkRecords();
        setHistoryList(seeded);
        recordsToExport = seeded;
      } else {
        showToast(`No records match current filter "${filterSeverity}". Exporting all ${historyList.length} records.`, 'info');
        recordsToExport = historyList;
      }
    }

    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `smart_traffic_prediction_audit_${filterSeverity.toLowerCase()}_${timestamp}.csv`;
    const result = exportAuditHistoryToCSV(recordsToExport, filename);

    if (result.success) {
      showToast(`Exported ${recordsToExport.length} records to ${result.filename} (${(result.sizeBytes / 1024).toFixed(1)} KB)`, 'success');
    } else {
      showToast(result.error || 'Failed to export CSV', 'warning');
    }
  };

  // Export Single Record CSV
  const handleExportSingleRecordCSV = (item) => {
    const result = exportAuditHistoryToCSV([item], `traffic_audit_record_${(item.inputs?.locationName || 'record').replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    if (result.success) {
      showToast(`Exported single record for ${item.inputs?.locationName || 'location'} to CSV`, 'success');
    }
  };

  const handleExportJSON = () => {
    if (historyList.length === 0) {
      showToast('No records to export. Seed benchmark data first.', 'warning');
      return;
    }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(historyList, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `traffic_prediction_history_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`Exported ${historyList.length} JSON records`, 'success');
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'Severe': return '#ef4444';
      case 'High': return '#f97316';
      case 'Moderate': return '#f59e0b';
      default: return '#10b981';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 18px',
          borderRadius: '10px',
          background: toastMessage.type === 'warning' ? '#78350f' : (toastMessage.type === 'info' ? '#075985' : '#064e3b'),
          border: `1px solid ${toastMessage.type === 'warning' ? '#f59e0b' : (toastMessage.type === 'info' ? '#38bdf8' : '#10b981')}`,
          color: '#f8fafc',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
          animation: 'slideIn 0.25s ease-out',
          fontSize: '0.85rem',
          fontWeight: 600
        }}>
          {toastMessage.type === 'warning' ? (
            <AlertTriangle size={18} color="#fbbf24" />
          ) : (
            <CheckCircle2 size={18} color="#34d399" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="glass-panel" style={{
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        position: 'relative',
        zIndex: 40
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
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', position: 'relative' }}>
          <button
            onClick={fetchHistory}
            className="btn-secondary"
            style={{ fontSize: '0.78rem', padding: '6px 12px' }}
            title="Refresh from MongoDB & storage"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          {/* Seed Demo Records */}
          <button
            onClick={handleSeedDemoRecords}
            className="btn-secondary"
            style={{ fontSize: '0.78rem', padding: '6px 12px', borderColor: 'rgba(56, 189, 248, 0.4)' }}
            title="Load benchmark corridor predictions"
          >
            <Sparkles size={14} color="var(--brand-cyan)" />
            <span>Seed Benchmark Data</span>
          </button>

          {/* Export CSV Split Button */}
          <div ref={exportDropdownRef} style={{ position: 'relative', display: 'inline-flex', zIndex: 50 }}>
            <button
              onClick={() => handleExportCSV('filtered')}
              className="btn-primary"
              style={{
                fontSize: '0.78rem',
                padding: '6px 12px',
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                borderRight: '1px solid rgba(255,255,255,0.2)',
                background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title={`Export ${filteredHistory.length} records to standard CSV file`}
            >
              <FileSpreadsheet size={15} color="#fff" />
              <span>Export CSV</span>
              <span style={{
                background: 'rgba(255, 255, 255, 0.22)',
                padding: '1px 6px',
                borderRadius: '10px',
                fontSize: '0.7rem',
                fontWeight: 700
              }}>
                {filteredHistory.length}
              </span>
            </button>

            <button
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="btn-primary"
              style={{
                fontSize: '0.78rem',
                padding: '6px 8px',
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                background: 'linear-gradient(135deg, #0284c7, #0369a1)'
              }}
              title="CSV Export Options"
            >
              <ChevronDown size={14} style={{ transform: showExportOptions ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {/* Export Dropdown Menu */}
            {showExportOptions && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                zIndex: 1000,
                width: '270px',
                background: '#090d16',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                borderRadius: '10px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.9), 0 0 20px rgba(2, 132, 199, 0.25)',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                backdropFilter: 'blur(20px)'
              }}>
                <button
                  onClick={() => handleExportCSV('filtered')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#f8fafc',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(56, 189, 248, 0.12)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Filter size={13} color="var(--brand-cyan)" />
                    <span>Export Filtered ({filteredHistory.length})</span>
                  </div>
                  <Download size={13} color="var(--text-muted)" />
                </button>

                <button
                  onClick={() => handleExportCSV('all')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#f8fafc',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(56, 189, 248, 0.12)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Database size={13} color="#10b981" />
                    <span>Export All ({historyList.length})</span>
                  </div>
                  <Download size={13} color="var(--text-muted)" />
                </button>

                <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '4px 0' }}></div>

                <div style={{ padding: '4px 8px', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                  Format: RFC 4180 with UTF-8 BOM (Excel, Sheets, Pandas compatible)
                </div>
              </div>
            )}
          </div>

          <button onClick={handleExportJSON} className="btn-secondary" style={{ fontSize: '0.78rem', padding: '6px 12px' }}>
            <Download size={14} />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', position: 'relative', zIndex: 10 }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '11px', zIndex: 2 }} />
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
      <div className="glass-panel" style={{ overflow: 'hidden', position: 'relative', zIndex: 5 }}>
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
                  <td colSpan="8" style={{ padding: '48px 24px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <AlertTriangle size={32} color="#f59e0b" />
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>
                          No prediction records found matching filters
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Run a prediction from the Studio or load the benchmark corridor dataset to explore and export CSV.
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <button
                          onClick={handleSeedDemoRecords}
                          className="btn-primary"
                          style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                        >
                          <Sparkles size={14} />
                          <span>Load Benchmark Dataset</span>
                        </button>
                        <button
                          onClick={() => handleExportCSV('all')}
                          className="btn-secondary"
                          style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                        >
                          <FileSpreadsheet size={14} />
                          <span>Export Sample CSV</span>
                        </button>
                      </div>
                    </div>
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
                            onClick={() => handleExportSingleRecordCSV(item)}
                            className="btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                            title="Export this single prediction record to CSV"
                          >
                            <Download size={13} color="#10b981" />
                            <span>CSV</span>
                          </button>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="var(--brand-cyan)" />
                Historical Record Inspection: {selectedRecord.inputs?.locationName}
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                MongoDB Document ID: {selectedRecord._id} | {new Date(selectedRecord.timestamp).toLocaleString()}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleExportSingleRecordCSV(selectedRecord)}
                className="btn-primary"
                style={{ fontSize: '0.75rem', padding: '4px 12px' }}
              >
                <FileSpreadsheet size={13} />
                <span>Export Record CSV</span>
              </button>
              <button onClick={() => setSelectedRecord(null)} className="btn-secondary" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                Close Inspection
              </button>
            </div>
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
                    <span style={{ color: 'var(--text-muted)' }}>{f.displayName ? f.displayName.split(' (')[0] : f.feature}:</span>
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
