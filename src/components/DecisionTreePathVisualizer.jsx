import React, { useState } from 'react';
import {
  GitBranch,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Info,
  Maximize2,
  Copy,
  Check,
  ChevronRight,
  Sliders,
  Layers
} from 'lucide-react';
import { evaluateDecisionTree } from '../utils/decisionTreeEngine';

export default function DecisionTreePathVisualizer({
  inputs,
  predictionResult,
  onOpenFullExplorer
}) {
  const [viewMode, setViewMode] = useState('path'); // 'path' | 'mini-tree' | 'rule'
  const [copied, setCopied] = useState(false);

  // Evaluate current inputs against Decision Tree engine
  const treeEvaluation = predictionResult?.prediction?.activePath 
    ? predictionResult.prediction 
    : evaluateDecisionTree(inputs);

  const activePath = treeEvaluation.activePath || [];
  const leafNode = treeEvaluation.leafNode;
  const ruleString = treeEvaluation.ruleString || '';

  const handleCopyRule = () => {
    if (ruleString) {
      navigator.clipboard.writeText(ruleString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
    <div className="glass-panel" style={{
      padding: '20px',
      marginBottom: '24px',
      border: '1px solid rgba(245, 158, 11, 0.35)',
      boxShadow: '0 0 25px rgba(245, 158, 11, 0.12)'
    }}>
      {/* Header with Sub-tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 style={{ fontSize: '0.98rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GitBranch size={17} color="#fbbf24" />
            Decision Tree: White-Box Logic Traversal
          </h3>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Transparent CART hierarchical branch execution evaluated for current inputs
          </p>
        </div>

        {/* View Switcher */}
        <div style={{ display: 'flex', background: '#090d16', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <button
            type="button"
            onClick={() => setViewMode('path')}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: viewMode === 'path' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
              color: viewMode === 'path' ? '#fff' : 'var(--text-muted)'
            }}
          >
            Decision Path
          </button>
          <button
            type="button"
            onClick={() => setViewMode('mini-tree')}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: viewMode === 'mini-tree' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
              color: viewMode === 'mini-tree' ? '#fff' : 'var(--text-muted)'
            }}
          >
            Branch Diagram
          </button>
          <button
            type="button"
            onClick={() => setViewMode('rule')}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: viewMode === 'rule' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
              color: viewMode === 'rule' ? '#fff' : 'var(--text-muted)'
            }}
          >
            IF-THEN Rule
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. STEP-BY-STEP PATH VIEW */}
      {/* ======================================================== */}
      {viewMode === 'path' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {activePath.map((step, idx) => {
            const isLeaf = step.isLeaf;
            const isLast = idx === activePath.length - 1;

            if (isLeaf) {
              return (
                <div
                  key={idx}
                  style={{
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(239, 68, 68, 0.12))',
                    border: `1px solid ${getRiskColor(step.riskLevel)}`,
                    borderRadius: '10px',
                    padding: '12px 14px',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: getRiskColor(step.riskLevel),
                        color: '#000'
                      }}>
                        TERMINAL LEAF NODE
                      </span>
                      <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#f8fafc' }}>
                        {step.title}
                      </span>
                    </div>
                    <span style={{
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)',
                      color: getRiskColor(step.riskLevel)
                    }}>
                      {step.riskPercentage}% Risk
                    </span>
                  </div>

                  <p style={{ fontSize: '0.74rem', color: '#cbd5e1', lineHeight: 1.45, marginBottom: '8px' }}>
                    {step.summary}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    background: 'rgba(0, 0, 0, 0.25)',
                    padding: '6px 10px',
                    borderRadius: '6px'
                  }}>
                    <span>Gini Impurity: <strong style={{ color: '#fbbf24' }}>{step.gini?.toFixed(3)}</strong></span>
                    <span>Node Support: <strong style={{ color: '#38bdf8' }}>{step.samples?.toLocaleString()} samples</strong></span>
                    <span>Class: <strong style={{ color: getRiskColor(step.riskLevel) }}>{step.riskLevel}</strong></span>
                  </div>
                </div>
              );
            }

            return (
              <div key={idx} style={{ position: 'relative' }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  {/* Step Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: '#fbbf24',
                        color: '#000',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {idx + 1}
                      </span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc' }}>
                        {step.feature}
                      </span>
                    </div>

                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: step.conditionResult ? 'rgba(245, 158, 11, 0.18)' : 'rgba(56, 189, 248, 0.15)',
                      color: step.conditionResult ? '#fbbf24' : '#38bdf8',
                      border: `1px solid ${step.conditionResult ? 'rgba(245, 158, 11, 0.35)' : 'rgba(56, 189, 248, 0.3)'}`
                    }}>
                      {step.conditionResult ? 'Passed [TRUE ➔ Next Hazard Node]' : 'Failed [FALSE ➔ Safe Branch]'}
                    </span>
                  </div>

                  {/* Condition & Actual Value */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px',
                    fontSize: '0.73rem',
                    background: 'rgba(0, 0, 0, 0.25)',
                    padding: '6px 10px',
                    borderRadius: '6px'
                  }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Split Rule: </span>
                      <strong style={{ color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>{step.condition}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Actual Input: </span>
                      <strong style={{ color: '#f8fafc' }}>{step.actualValueDisplay}</strong>
                    </div>
                  </div>

                  {/* Metadata Gini & Samples */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                    <span>Node Impurity: Gini = {step.gini?.toFixed(3)}</span>
                    <span>Node Partition: {step.samples?.toLocaleString()} Training Samples</span>
                  </div>
                </div>

                {/* Connecting arrow */}
                {!isLast && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '14px',
                    color: '#fbbf24'
                  }}>
                    <ChevronRight size={14} style={{ transform: 'rotate(90deg)' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. MINI TREE DIAGRAM VIEW */}
      {/* ======================================================== */}
      {viewMode === 'mini-tree' && (
        <div style={{
          background: '#090d16',
          borderRadius: '10px',
          padding: '16px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '14px', textAlign: 'center' }}>
            Active Branch Highlighted (<span style={{ color: '#fbbf24', fontWeight: 700 }}>Amber Path</span>)
          </div>

          {/* Graphical SVG Tree Hierarchy */}
          <div style={{ width: '100%', overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
            <svg width="420" height="230" viewBox="0 0 420 230" style={{ maxWidth: '100%' }}>
              <defs>
                <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>

              {/* Connector lines */}
              {/* Level 0 to Level 1 */}
              <line x1="210" y1="36" x2="110" y2="90" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="4 2" />
              <line x1="210" y1="36" x2="310" y2="90" stroke="#334155" strokeWidth="1.5" />

              {/* Level 1 to Level 2 */}
              <line x1="110" y1="115" x2="60" y2="165" stroke="#fbbf24" strokeWidth="2.5" />
              <line x1="110" y1="115" x2="160" y2="165" stroke="#334155" strokeWidth="1.5" />
              <line x1="310" y1="115" x2="260" y2="165" stroke="#334155" strokeWidth="1.5" />
              <line x1="310" y1="115" x2="360" y2="165" stroke="#334155" strokeWidth="1.5" />

              {/* Nodes */}
              {/* Root */}
              <g transform="translate(210, 20)">
                <rect x="-70" y="-16" width="140" height="32" rx="6" fill="#1e293b" stroke="#fbbf24" strokeWidth="2" />
                <text x="0" y="4" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="700">Speed &gt; 15 km/h?</text>
              </g>

              {/* L1 Left (Adverse Weather/Surface) */}
              <g transform="translate(110, 102)">
                <rect x="-65" y="-14" width="130" height="28" rx="6" fill="#1e293b" stroke="#fbbf24" strokeWidth="2" />
                <text x="0" y="4" textAnchor="middle" fill="#f8fafc" fontSize="9" fontWeight="600">Weather / Surface?</text>
              </g>

              {/* L1 Right (Compliant Flow) */}
              <g transform="translate(310, 102)">
                <rect x="-65" y="-14" width="130" height="28" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                <text x="0" y="4" textAnchor="middle" fill="#94a3b8" fontSize="9">Speed Compliant</text>
              </g>

              {/* L2 Leaves */}
              <g transform="translate(60, 175)">
                <rect x="-48" y="-12" width="96" height="24" rx="5" fill="rgba(239, 68, 68, 0.25)" stroke="#ef4444" strokeWidth="2" />
                <text x="0" y="4" textAnchor="middle" fill="#f87171" fontSize="9" fontWeight="700">Severe (91%)</text>
              </g>

              <g transform="translate(160, 175)">
                <rect x="-44" y="-12" width="88" height="24" rx="5" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                <text x="0" y="4" textAnchor="middle" fill="#94a3b8" fontSize="8.5">High (71%)</text>
              </g>

              <g transform="translate(260, 175)">
                <rect x="-44" y="-12" width="88" height="24" rx="5" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                <text x="0" y="4" textAnchor="middle" fill="#94a3b8" fontSize="8.5">Moderate (38%)</text>
              </g>

              <g transform="translate(360, 175)">
                <rect x="-44" y="-12" width="88" height="24" rx="5" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                <text x="0" y="4" textAnchor="middle" fill="#10b981" fontSize="8.5">Optimal (6%)</text>
              </g>

              <text x="210" y="218" textAnchor="middle" fill="#64748b" fontSize="9">
                Depth = 4 | Criterion = Gini Impurity | Pure Terminal Leaves
              </text>
            </svg>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. EXTRACTED PRODUCTION RULE VIEW */}
      {/* ======================================================== */}
      {viewMode === 'rule' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            background: '#090d16',
            borderRadius: '10px',
            padding: '14px',
            border: '1px solid var(--border-subtle)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            lineHeight: 1.6,
            color: '#fbbf24',
            position: 'relative'
          }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: '6px', fontFamily: 'var(--font-body)' }}>
              Extracted Scikit-Learn CART Production Rule:
            </div>
            {ruleString}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              Deterministic Rule format ready for ITS Signal Controller firmware
            </span>
            <button
              onClick={handleCopyRule}
              className="btn-secondary"
              style={{ fontSize: '0.74rem', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span>{copied ? 'Rule Copied!' : 'Copy Rule'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Footer Navigation to Full Explorer */}
      <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          Model: <strong style={{ color: '#fbbf24' }}>Decision Tree Classifier</strong> | 100% White-Box Transparent
        </div>
        <button
          onClick={onOpenFullExplorer}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fbbf24',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <span>Launch Full Decision Tree Explorer</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
