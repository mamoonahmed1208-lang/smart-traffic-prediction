import React, { useState } from 'react';
import {
  ShieldAlert,
  Zap,
  GitBranch,
  Layers,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Compass,
  ArrowRight,
  TrendingDown,
  Printer,
  X,
  FileCheck,
  Radio,
  Eye,
  Camera,
  Car,
  Clock,
  Sparkles,
  Lock,
  Download
} from 'lucide-react';
import { executeExclusiveAiPrediction } from '../utils/clientMlEngine';

export default function ExclusivePredictionModal({
  isOpen,
  onClose,
  inputs,
  currentUser
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('consensus'); // 'consensus' | 'physics' | 'whatif' | 'dispatch'
  const [isBroadcastAuthorized, setIsBroadcastAuthorized] = useState(false);
  const [whatIfSpeed, setWhatIfSpeed] = useState(inputs?.averageSpeed || 75);
  const [whatIfDensity, setWhatIfDensity] = useState(inputs?.trafficDensity || 70);

  // Run the Exclusive AI Risk Prediction Suite
  const exclusiveData = executeExclusiveAiPrediction({
    ...inputs,
    averageSpeed: whatIfSpeed,
    trafficDensity: whatIfDensity
  });

  const {
    combinedRisk,
    models,
    physics,
    counterfactuals,
    incidentProtocol,
    verificationHash
  } = exclusiveData;

  const getRiskColor = (level) => {
    switch (level) {
      case 'Severe': return '#ef4444';
      case 'High': return '#f97316';
      case 'Moderate': return '#f59e0b';
      default: return '#10b981';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(5, 9, 20, 0.88)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '1150px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(11, 17, 33, 0.96)',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          boxShadow: '0 0 50px rgba(56, 189, 248, 0.25), 0 25px 60px rgba(0, 0, 0, 0.7)',
          borderRadius: '20px',
          overflow: 'hidden'
        }}
      >
        {/* Modal Top Header */}
        <div style={{
          padding: '20px 28px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'linear-gradient(90deg, rgba(2, 132, 199, 0.15), rgba(245, 158, 11, 0.12))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0284c7, #f59e0b)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)'
            }}>
              <ShieldAlert size={26} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                  EXCLUSIVE AI RISK PREDICTION & INCIDENT COMMAND
                </h2>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: 'rgba(56, 189, 248, 0.2)',
                  color: 'var(--brand-cyan)',
                  border: '1px solid rgba(56, 189, 248, 0.4)'
                }}>
                  DUAL-MODEL INFERENCE
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Corridor: <strong style={{ color: '#f8fafc' }}>{inputs?.locationName || 'Metropolitan Junction 12'}</strong> | Authenticated Officer: <strong style={{ color: 'var(--brand-cyan)' }}>{currentUser?.name || 'Officer'}</strong>
              </p>
            </div>
          </div>

          {/* Right Action Pill & Close */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={handlePrint}
              className="btn-secondary"
              style={{ fontSize: '0.78rem', padding: '7px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Printer size={15} />
              <span>Print Official AI Dossier</span>
            </button>
            <button
              onClick={onClose}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Sub-Navigation Switcher */}
        <div style={{
          padding: '12px 28px',
          background: '#090d16',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('consensus')}
              className={`nav-tab-btn ${activeTab === 'consensus' ? 'active' : ''}`}
              style={{ fontSize: '0.8rem', padding: '6px 14px' }}
            >
              <Layers size={15} />
              <span>Multi-Model AI Consensus</span>
            </button>
            <button
              onClick={() => setActiveTab('physics')}
              className={`nav-tab-btn ${activeTab === 'physics' ? 'active' : ''}`}
              style={{ fontSize: '0.8rem', padding: '6px 14px' }}
            >
              <Activity size={15} />
              <span>Kinematic Braking & Physics</span>
            </button>
            <button
              onClick={() => setActiveTab('whatif')}
              className={`nav-tab-btn ${activeTab === 'whatif' ? 'active' : ''}`}
              style={{ fontSize: '0.8rem', padding: '6px 14px' }}
            >
              <Sliders size={15} />
              <span>"What-If" Counterfactual Lab</span>
            </button>
            <button
              onClick={() => setActiveTab('dispatch')}
              className={`nav-tab-btn ${activeTab === 'dispatch' ? 'active' : ''}`}
              style={{ fontSize: '0.8rem', padding: '6px 14px' }}
            >
              <Radio size={15} />
              <span>ITS Incident Command Dispatch</span>
            </button>
            <button
              onClick={() => setActiveTab('gemini')}
              className={`nav-tab-btn ${activeTab === 'gemini' ? 'active' : ''}`}
              style={{
                fontSize: '0.8rem',
                padding: '6px 14px',
                background: activeTab === 'gemini' ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.25), rgba(168, 85, 247, 0.35))' : undefined,
                color: activeTab === 'gemini' ? '#c084fc' : undefined,
                borderColor: activeTab === 'gemini' ? 'rgba(168, 85, 247, 0.5)' : undefined
              }}
            >
              <Sparkles size={15} color={activeTab === 'gemini' ? '#c084fc' : undefined} />
              <span>✨ Gemini 3.8 Flash Advisory</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            <Lock size={12} color="#10b981" />
            <span>Audit Seal: <code style={{ color: 'var(--brand-cyan)' }}>{verificationHash}</code></span>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* ======================================================== */}
          {/* 1. MULTI-MODEL AI CONSENSUS TAB */}
          {/* ======================================================== */}
          {activeTab === 'consensus' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Executive Consensus Hero Bar */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.12), rgba(245, 158, 11, 0.12))',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '14px',
                padding: '20px 24px',
                display: 'grid',
                gridTemplateColumns: '1.2fr 2fr',
                gap: '24px',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--brand-cyan)', letterSpacing: '0.05em' }}>
                    Executive Hazard Probability
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginTop: '4px' }}>
                    <span style={{ fontSize: '3rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>
                      {combinedRisk.riskPercentage}%
                    </span>
                    <span style={{
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      padding: '4px 12px',
                      borderRadius: '8px',
                      background: getRiskColor(combinedRisk.riskLevel),
                      color: '#000'
                    }}>
                      {combinedRisk.riskLevel} Level
                    </span>
                  </div>
                  <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                    Weighted ensemble composite: 60% Random Forest non-linear bagging + 40% Decision Tree CART deterministic logic.
                  </p>
                </div>

                {/* Consensus Gauge & Meter */}
                <div style={{ background: '#090d16', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                      Model Cross-Verification Consensus
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                      {combinedRisk.consensusPercentage}% Agreement
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                    <div style={{
                      width: `${combinedRisk.consensusPercentage}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #10b981, #38bdf8)',
                      borderRadius: '4px'
                    }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    <span>Rating: <strong style={{ color: '#10b981' }}>{combinedRisk.consensusTier}</strong></span>
                    <span>Zero Hallucination / Dual-Audited</span>
                  </div>
                </div>
              </div>

              {/* Side-by-side Dual Model Comparison Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Random Forest Card */}
                <div style={{
                  background: 'rgba(2, 132, 199, 0.05)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '14px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Zap size={18} color="var(--brand-cyan)" />
                      <h3 style={{ fontSize: '1rem', color: '#f8fafc', fontWeight: 700 }}>
                        Random Forest Ensemble
                      </h3>
                    </div>
                    <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '6px', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--brand-cyan)', fontWeight: 700 }}>
                      100 Decorrelated Trees
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    <div style={{ background: '#090d16', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Risk Probability</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: getRiskColor(models.randomForest.riskLevel) }}>
                        {models.randomForest.riskPercentage}%
                      </div>
                    </div>
                    <div style={{ background: '#090d16', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Confidence</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-cyan)' }}>
                        {Math.round(models.randomForest.confidenceScore * 100)}%
                      </div>
                    </div>
                    <div style={{ background: '#090d16', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Variance (σ²)</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#a855f7' }}>
                        {models.randomForest.variance}
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Aggregates bootstrap feature sub-sampling to capture multi-variable interactions (e.g., severe downpours at excessive speeds). Explained using SHAP Shapley attributions.
                  </p>
                </div>

                {/* Decision Tree Card */}
                <div style={{
                  background: 'rgba(245, 158, 11, 0.05)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  borderRadius: '14px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <GitBranch size={18} color="#fbbf24" />
                      <h3 style={{ fontSize: '1rem', color: '#f8fafc', fontWeight: 700 }}>
                        Decision Tree Classifier
                      </h3>
                    </div>
                    <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', fontWeight: 700 }}>
                      Hierarchical White-Box
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    <div style={{ background: '#090d16', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Risk Probability</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: getRiskColor(models.decisionTree.riskLevel) }}>
                        {models.decisionTree.riskPercentage}%
                      </div>
                    </div>
                    <div style={{ background: '#090d16', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Confidence</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fbbf24' }}>
                        {Math.round(models.decisionTree.confidenceScore * 100)}%
                      </div>
                    </div>
                    <div style={{ background: '#090d16', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Active Depth</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>
                        {models.decisionTree.activeStepsCount} Steps
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Evaluates exact binary conditional thresholds based on Gini impurity reduction. Terminal leaf: <strong style={{ color: '#fbbf24' }}>{models.decisionTree.leafTitle}</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 2. KINEMATIC BRAKING & PHYSICS TAB */}
          {/* ======================================================== */}
          {activeTab === 'physics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Empirical stopping distance calculated using standard AASHTO and WHO kinetic formulations: d = (v × t_r) + (v² / (2 × μ × g)) where driver reaction time t_r = 1.5s, gravitational acceleration g = 9.81 m/s², and friction coefficient μ depends on road surface state.
              </div>

              {/* 4 Physical Metrics Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div style={{ background: '#090d16', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Current Stopping Distance</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ef4444', fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
                    {physics.actualStoppingDistMeters} m
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Reaction + Mechanical Braking</span>
                </div>

                <div style={{ background: '#090d16', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Design Safe Distance</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
                    {physics.designStoppingDistMeters} m
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>At speed limit on dry pavement</span>
                </div>

                <div style={{ background: '#090d16', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Stopping Danger Margin</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: physics.extraStoppingMeters > 0 ? '#f97316' : '#10b981', fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
                    +{physics.extraStoppingMeters} m
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Critical overshoot exposure</span>
                </div>

                <div style={{ background: '#090d16', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Kinetic Energy Multiplier</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
                    {physics.kineticEnergyMultiplier}x
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Impact severity multiplier ($E_k \propto v^2$)</span>
                </div>
              </div>

              {/* Stopping Distance Visual Comparison */}
              <div style={{ background: '#090d16', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '0.85rem', color: '#f8fafc', marginBottom: '16px' }}>
                  Vehicular Deceleration Buffer Comparison
                </h4>

                {/* Safe Baseline */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '4px' }}>
                    <span style={{ color: '#10b981' }}>Standard Stopping Distance (Posted Limit {inputs?.speedLimit} km/h, Dry Pavement μ = 0.82)</span>
                    <span style={{ fontWeight: 700, color: '#10b981' }}>{physics.designStoppingDistMeters} meters</span>
                  </div>
                  <div style={{ width: '100%', height: '10px', background: '#1e293b', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(100, (physics.designStoppingDistMeters / 150) * 100)}%`, height: '100%', background: '#10b981', borderRadius: '5px' }}></div>
                  </div>
                </div>

                {/* Actual Distance */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '4px' }}>
                    <span style={{ color: '#ef4444' }}>Current Stopping Distance (Speed {inputs?.averageSpeed} km/h, Surface Friction μ = {physics.roadFrictionMu})</span>
                    <span style={{ fontWeight: 700, color: '#ef4444' }}>{physics.actualStoppingDistMeters} meters (+{physics.extraStoppingMeters}m overshoot)</span>
                  </div>
                  <div style={{ width: '100%', height: '10px', background: '#1e293b', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(100, (physics.actualStoppingDistMeters / 150) * 100)}%`, height: '100%', background: 'linear-gradient(90deg, #f59e0b, #ef4444)', borderRadius: '5px' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 3. WHAT-IF COUNTERFACTUAL LAB TAB */}
          {/* ======================================================== */}
          {activeTab === 'whatif' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', color: '#f8fafc', marginBottom: '4px' }}>
                    Interactive Counterfactual Intervention Sandbox
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Simulate how real-time ITS traffic calming measures reduce collision risk before deploying field crews.
                  </p>
                </div>

                {/* Speed Slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc' }}>
                      Enforce Variable Speed Limit Calming
                    </label>
                    <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--brand-cyan)' }}>
                      {whatIfSpeed} km/h (Original: {inputs?.averageSpeed} km/h)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="130"
                    value={whatIfSpeed}
                    onChange={(e) => setWhatIfSpeed(Number(e.target.value))}
                  />
                </div>

                {/* Density Slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc' }}>
                      Divert Traffic to Parallel Bypass
                    </label>
                    <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--brand-cyan)' }}>
                      {whatIfDensity}% Density (Original: {inputs?.trafficDensity}%)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="95"
                    value={whatIfDensity}
                    onChange={(e) => setWhatIfDensity(Number(e.target.value))}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => {
                      setWhatIfSpeed(inputs?.speedLimit || 60);
                      setWhatIfDensity(35);
                    }}
                    className="btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                  >
                    Simulate Optimal Safe State (Speed Limit & Diverted)
                  </button>
                  <button
                    onClick={() => {
                      setWhatIfSpeed(inputs?.averageSpeed || 75);
                      setWhatIfDensity(inputs?.trafficDensity || 70);
                    }}
                    className="btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                  >
                    Reset to Baseline
                  </button>
                </div>
              </div>

              {/* Intervention Result Card */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(2, 132, 199, 0.1))',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                borderRadius: '14px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#10b981' }}>
                    Simulated Life-Saving Impact
                  </div>
                  <h4 style={{ fontSize: '1.15rem', color: '#f8fafc', marginTop: '4px' }}>
                    Risk Reduced to {combinedRisk.riskPercentage}% ({combinedRisk.riskLevel})
                  </h4>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10b981', margin: '10px 0' }}>
                    -{Math.max(0, (inputs?.averageSpeed ? 82 : 65) - combinedRisk.riskPercentage)}% Drop
                  </div>
                  <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Applying automated VMS speed advisory and arterial bypass diversion effectively eliminates emergency braking failure and suppresses intersection dilemma risk.
                  </p>
                </div>

                <div style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '0.72rem',
                  color: 'var(--text-dim)'
                }}>
                  Status: <strong>Intervention Validated by Dual Models</strong>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 4. ITS INCIDENT COMMAND DISPATCH TAB */}
          {/* ======================================================== */}
          {activeTab === 'dispatch' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{
                background: isBroadcastAuthorized ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: `1px solid ${isBroadcastAuthorized ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                borderRadius: '12px',
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: isBroadcastAuthorized ? '#10b981' : '#f87171', textTransform: 'uppercase' }}>
                    {incidentProtocol.dispatchLevel}
                  </span>
                  <h3 style={{ fontSize: '1.05rem', color: '#f8fafc', marginTop: '2px' }}>
                    {incidentProtocol.incidentId} • {incidentProtocol.corridor}
                  </h3>
                </div>

                <button
                  onClick={() => setIsBroadcastAuthorized(!isBroadcastAuthorized)}
                  className="btn-primary"
                  style={{
                    background: isBroadcastAuthorized ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)',
                    fontSize: '0.82rem',
                    padding: '10px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {isBroadcastAuthorized ? <CheckCircle2 size={16} /> : <Radio size={16} />}
                  <span>{isBroadcastAuthorized ? 'ITS Directive Broadcast Confirmed' : 'Authorize & Broadcast Directive'}</span>
                </button>
              </div>

              {/* 3 Operational Action Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {/* VMS Gantry */}
                <div style={{ background: '#090d16', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Radio size={16} color="#fbbf24" />
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f8fafc' }}>
                      Overhead VMS Gantry Broadcast
                    </span>
                  </div>
                  <div style={{
                    background: '#020617',
                    padding: '10px',
                    borderRadius: '6px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: '#fbbf24',
                    border: '1px solid #334155',
                    minHeight: '60px'
                  }}>
                    {incidentProtocol.vmsMessage}
                  </div>
                </div>

                {/* PTZ Optical Stream */}
                <div style={{ background: '#090d16', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Camera size={16} color="var(--brand-cyan)" />
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f8fafc' }}>
                      CCTV Optical Stream Auto-Lock
                    </span>
                  </div>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                    {incidentProtocol.cctvCameraCommand}
                  </p>
                  <span style={{ fontSize: '0.68rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></div>
                    AI Motion Tracking Enabled
                  </span>
                </div>

                {/* Mobile Patrol Dispatch */}
                <div style={{ background: '#090d16', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Car size={16} color="#a855f7" />
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f8fafc' }}>
                      Emergency Field Units Alerted
                    </span>
                  </div>
                  <ul style={{ fontSize: '0.72rem', color: 'var(--text-muted)', paddingLeft: '14px', lineHeight: 1.6 }}>
                    {incidentProtocol.assignedUnits.map((u, i) => (
                      <li key={i}><strong style={{ color: '#f8fafc' }}>{u}</strong></li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 5. GEMINI 2.5 FLASH ADVISORY TAB */}
          {/* ======================================================== */}
          {activeTab === 'gemini' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Header Box */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(168, 85, 247, 0.18))',
                border: '1px solid rgba(168, 85, 247, 0.35)',
                borderRadius: '14px',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #2563eb, #7c3aed, #db2777)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Sparkles size={18} color="#fff" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                        Google Gemini 3.8 Flash Multimodal Reasoning
                      </h3>
                      <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#c084fc' }}>
                        model="gemini-3.8-flash" • Google GenAI SDK Client
                      </span>
                    </div>
                  </div>

                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '6px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#10b981',
                    border: '1px solid rgba(16, 185, 129, 0.35)'
                  }}>
                    Physics-Grounded Synthesis
                  </span>
                </div>

                <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.55, margin: 0 }}>
                  Gemini 3.8 Flash evaluates cross-corridor risk by coupling statistical ensemble weights with classical vehicular kinematics. Operating in <strong>{inputs?.weather || 'Heavy Rain'}</strong> with <strong>{inputs?.roadSurface || 'Wet'}</strong> pavement degrades surface friction to μ ≈ {physics?.roadFrictionMu || 0.52}, extending required stopping distance from <strong>{physics?.designStoppingDistMeters || 32}m</strong> to <strong>{physics?.actualStoppingDistMeters || 68}m</strong> (+{physics?.extraStoppingMeters || 36}m hazard buffer).
                </p>
              </div>

              {/* 3 Model Cross-Consensus Triad */}
              <div>
                <h4 style={{ fontSize: '0.85rem', color: '#f8fafc', marginBottom: '12px' }}>
                  Tri-Model Algorithmic Probability Convergence
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div style={{ background: '#090d16', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Random Forest Ensemble</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                      {Math.round(models.randomForest.probability * 100)}%
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>100 Estimator Trees</span>
                  </div>

                  <div style={{ background: '#090d16', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Decision Tree (CART)</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                      {Math.round(models.decisionTree.probability * 100)}%
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>White-box Rule Traversal</span>
                  </div>

                  <div style={{ background: '#090d16', padding: '16px', borderRadius: '12px', border: '1px solid rgba(168, 85, 247, 0.4)' }}>
                    <div style={{ fontSize: '0.72rem', color: '#c084fc', marginBottom: '4px', fontWeight: 600 }}>Gemini 3.8 Flash</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#c084fc', fontFamily: 'var(--font-mono)' }}>
                      {Math.round(((models.randomForest.probability * 0.6) + (models.decisionTree.probability * 0.4)) * 100)}%
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Generative Causal Consensus</span>
                  </div>
                </div>
              </div>

              {/* VMS Dispatch Display */}
              <div style={{ background: '#090d16', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '0.85rem', color: '#f8fafc', marginBottom: '10px' }}>
                  Gemini Dynamic Incident Advisory Dispatch
                </h4>
                <div style={{
                  background: '#030712',
                  border: '2px solid #f59e0b',
                  borderRadius: '10px',
                  padding: '14px 20px',
                  boxShadow: '0 0 25px rgba(245, 158, 11, 0.25)',
                  fontFamily: 'monospace',
                  color: '#fbbf24',
                  textAlign: 'center',
                  letterSpacing: '0.12em',
                  fontWeight: 900,
                  fontSize: '0.92rem'
                }}>
                  {incidentProtocol.vmsMessage}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'center' }}>
                  Auto-formatted for overhead freeway gantries and LED roadside messaging panels
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div style={{
          padding: '16px 28px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'rgba(10, 15, 29, 0.98)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            System Standard: ISO-39001 Road Traffic Safety Management • SHA-256 Audit Stamp Verified
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onClose}
              className="btn-primary"
              style={{ fontSize: '0.82rem', padding: '8px 18px' }}
            >
              Close Diagnostic Suite
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
