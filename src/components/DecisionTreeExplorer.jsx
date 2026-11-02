import React, { useState } from 'react';
import {
  GitBranch,
  Layers,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Search,
  Filter,
  Copy,
  Check,
  Info,
  ArrowRight,
  TrendingUp,
  Cpu,
  BookOpen,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from 'lucide-react';
import {
  DECISION_TREE_NODES,
  DECISION_TREE_FEATURE_IMPORTANCE,
  evaluateDecisionTree,
  getAllExtractedRules
} from '../utils/decisionTreeEngine';

export default function DecisionTreeExplorer({ currentInputs, onApplyInputsToStudio }) {
  const [selectedDepth, setSelectedDepth] = useState(4); // 1 to 4
  const [selectedNode, setSelectedNode] = useState(null);
  const [ruleFilter, setRuleFilter] = useState('ALL'); // 'ALL' | 'Severe' | 'High' | 'Moderate' | 'Low'
  const [explorerTab, setExplorerTab] = useState('tree'); // 'tree' | 'rules' | 'metrics' | 'pruning'
  const [copiedRuleId, setCopiedRuleId] = useState(null);

  // Evaluate active path for current inputs
  const inputsToUse = currentInputs || {
    trafficDensity: 75,
    averageSpeed: 85,
    speedLimit: 60,
    weather: 'Heavy Rain',
    roadSurface: 'Wet',
    roadType: 'Intersection',
    timeOfDay: 'Morning Peak',
    lighting: 'Daylight',
    historicalRiskIndex: 70
  };

  const currentEval = evaluateDecisionTree(inputsToUse);
  const activeNodeIds = new Set(currentEval.activeNodeIds);
  const allRules = getAllExtractedRules();

  // Filter rules
  const filteredRules = ruleFilter === 'ALL'
    ? allRules
    : allRules.filter(r => r.riskLevel === ruleFilter);

  // Filter nodes based on selected pruning depth
  const visibleNodes = DECISION_TREE_NODES.filter(n => n.depth <= selectedDepth);

  const getRiskColor = (level) => {
    switch (level) {
      case 'Severe': return '#ef4444';
      case 'High': return '#f97316';
      case 'Moderate': return '#f59e0b';
      default: return '#10b981';
    }
  };

  const handleCopy = (ruleId, text) => {
    navigator.clipboard.writeText(text);
    setCopiedRuleId(ruleId);
    setTimeout(() => setCopiedRuleId(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        borderLeft: '4px solid #f59e0b'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              padding: '2px 8px',
              borderRadius: '6px',
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#fbbf24',
              border: '1px solid rgba(245, 158, 11, 0.3)'
            }}>
              WHITE-BOX MODEL
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Scikit-Learn CART Architecture
            </span>
          </div>
          <h2 style={{ fontSize: '1.35rem', color: '#f8fafc', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <GitBranch size={22} color="#fbbf24" />
            Decision Tree Architecture & Interactive Explorer
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Transparent binary decision splits, Gini impurity reduction, active scenario tracing, and deterministic ITS rule book
          </p>
        </div>

        {/* Navigation Sub-Tabs */}
        <div style={{ display: 'flex', background: '#090d16', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
          <button
            onClick={() => setExplorerTab('tree')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: explorerTab === 'tree' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
              color: explorerTab === 'tree' ? '#fff' : 'var(--text-muted)'
            }}
          >
            Visual Tree Topology
          </button>
          <button
            onClick={() => setExplorerTab('rules')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: explorerTab === 'rules' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
              color: explorerTab === 'rules' ? '#fff' : 'var(--text-muted)'
            }}
          >
            Rule Extraction Engine
          </button>
          <button
            onClick={() => setExplorerTab('pruning')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: explorerTab === 'pruning' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
              color: explorerTab === 'pruning' ? '#fff' : 'var(--text-muted)'
            }}
          >
            Pruning & Complexity Lab
          </button>
          <button
            onClick={() => setExplorerTab('metrics')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: explorerTab === 'metrics' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
              color: explorerTab === 'metrics' ? '#fff' : 'var(--text-muted)'
            }}
          >
            Feature Split Importance
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. VISUAL TREE TOPOLOGY TAB */}
      {/* ======================================================== */}
      {explorerTab === 'tree' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px' }}>
          {/* Main Tree Canvas (8 cols) */}
          <div style={{ gridColumn: 'span 8' }}>
            <div className="glass-panel" style={{ padding: '24px' }}>
              {/* Controls bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc' }}>
                    Active Pruning Depth:
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[1, 2, 3, 4].map(depth => (
                      <button
                        key={depth}
                        onClick={() => setSelectedDepth(depth)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          border: 'none',
                          cursor: 'pointer',
                          background: selectedDepth === depth ? '#fbbf24' : 'rgba(255, 255, 255, 0.05)',
                          color: selectedDepth === depth ? '#000' : 'var(--text-muted)'
                        }}
                      >
                        Depth {depth}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.74rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fbbf24', boxShadow: '0 0 8px #fbbf24' }}></div>
                    <span style={{ color: '#f8fafc' }}>Active Scenario Path</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#334155' }}></div>
                    <span style={{ color: 'var(--text-muted)' }}>Inactive Branch</span>
                  </div>
                </div>
              </div>

              {/* Hierarchical Tree Levels Display */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {[0, 1, 2, 3, 4].filter(d => d <= selectedDepth).map(depthLevel => {
                  const nodesAtDepth = visibleNodes.filter(n => n.depth === depthLevel);
                  if (nodesAtDepth.length === 0) return null;

                  return (
                    <div key={depthLevel} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: 'var(--text-dim)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        <span>Level {depthLevel} {depthLevel === 0 ? '(Root Split)' : depthLevel === selectedDepth ? '(Pruned Leaves)' : ''}</span>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }}></div>
                      </div>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${Math.min(nodesAtDepth.length, 4)}, 1fr)`,
                        gap: '12px'
                      }}>
                        {nodesAtDepth.map(node => {
                          const isActive = activeNodeIds.has(node.id);
                          const isSelected = selectedNode?.id === node.id;
                          const isLeaf = node.isLeaf;

                          return (
                            <div
                              key={node.id}
                              onClick={() => setSelectedNode(node)}
                              style={{
                                background: isSelected
                                  ? 'rgba(245, 158, 11, 0.15)'
                                  : isActive
                                    ? 'rgba(245, 158, 11, 0.08)'
                                    : 'rgba(255, 255, 255, 0.02)',
                                border: isSelected
                                  ? '2px solid #fbbf24'
                                  : isActive
                                    ? '1.5px solid rgba(245, 158, 11, 0.6)'
                                    : '1px solid var(--border-subtle)',
                                borderRadius: '10px',
                                padding: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: isActive ? '0 0 15px rgba(245, 158, 11, 0.15)' : 'none',
                                position: 'relative'
                              }}
                            >
                              {/* Active Pulse Pill */}
                              {isActive && (
                                <div style={{
                                  position: 'absolute',
                                  top: '8px',
                                  right: '8px',
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  background: '#fbbf24',
                                  boxShadow: '0 0 8px #fbbf24'
                                }}></div>
                              )}

                              {/* Node Type & Gini */}
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                <span style={{
                                  fontSize: '0.65rem',
                                  fontWeight: 800,
                                  textTransform: 'uppercase',
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                  background: isLeaf ? getRiskColor(node.riskLevel) : '#1e293b',
                                  color: isLeaf ? '#000' : 'var(--text-muted)'
                                }}>
                                  {isLeaf ? node.riskLevel : `Node ${node.id.replace('node_', '')}`}
                                </span>
                                <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--brand-cyan)' }}>
                                  Gini: {node.gini.toFixed(3)}
                                </span>
                              </div>

                              {/* Title / Condition */}
                              <div style={{
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                color: isActive ? '#fbbf24' : '#f8fafc',
                                marginBottom: '4px',
                                lineHeight: 1.3
                              }}>
                                {isLeaf ? node.title : node.displayCondition}
                              </div>

                              {/* Distribution bar */}
                              <div style={{ marginTop: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-dim)', marginBottom: '3px' }}>
                                  <span>Samples: {node.samples.toLocaleString()}</span>
                                  <span>{isLeaf ? `${node.riskPercentage}% Risk` : `${Math.round(node.predProb * 100)}% Risk`}</span>
                                </div>
                                <div style={{ width: '100%', height: '4px', background: '#1e293b', borderRadius: '2px', overflow: 'hidden', display: 'flex' }}>
                                  <div style={{
                                    width: `${Math.round((node.value[1] / (node.value[0] + node.value[1])) * 100)}%`,
                                    background: isLeaf ? getRiskColor(node.riskLevel) : '#f59e0b'
                                  }}></div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Node Inspector Sidebar (4 cols) */}
          <div style={{ gridColumn: 'span 4' }}>
            <div className="glass-panel" style={{ padding: '24px', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Info size={18} color="#fbbf24" />
                <h3 style={{ fontSize: '1.05rem', color: '#f8fafc' }}>
                  Node Diagnostic Inspector
                </h3>
              </div>

              {selectedNode ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Selected Node Identity
                    </span>
                    <h4 style={{ fontSize: '0.98rem', color: '#f8fafc', marginTop: '2px' }}>
                      {selectedNode.isLeaf ? selectedNode.title : selectedNode.feature}
                    </h4>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: selectedNode.isLeaf ? getRiskColor(selectedNode.riskLevel) : '#1e293b',
                      color: selectedNode.isLeaf ? '#000' : '#fbbf24',
                      display: 'inline-block',
                      marginTop: '4px'
                    }}>
                      {selectedNode.isLeaf ? `Terminal Leaf (${selectedNode.riskLevel})` : `Internal Split (Depth ${selectedNode.depth})`}
                    </span>
                  </div>

                  {/* Mathematical Gini Metrics */}
                  <div style={{
                    background: '#090d16',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Gini Impurity</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                        {selectedNode.gini.toFixed(3)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Samples Count</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                        {selectedNode.samples.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Rationale & Physics */}
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Traffic Physics Rationale
                    </span>
                    <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.5, marginTop: '4px' }}>
                      {selectedNode.description || selectedNode.summary}
                    </p>
                  </div>

                  {/* Recommended ITS Countermeasure */}
                  <div style={{
                    background: 'rgba(245, 158, 11, 0.08)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '8px',
                    padding: '12px'
                  }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldAlert size={14} />
                      Targeted ITS Countermeasure
                    </span>
                    <p style={{ fontSize: '0.76rem', color: '#f8fafc', lineHeight: 1.45, marginTop: '4px' }}>
                      {selectedNode.countermeasure}
                    </p>
                  </div>

                  {/* Current Scenario Evaluation */}
                  <div style={{
                    background: activeNodeIds.has(selectedNode.id) ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${activeNodeIds.has(selectedNode.id) ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-subtle)'}`,
                    borderRadius: '8px',
                    padding: '10px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {activeNodeIds.has(selectedNode.id) ? (
                        <>
                          <CheckCircle2 size={15} color="#10b981" />
                          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#10b981' }}>
                            Traversed in Current Scenario
                          </span>
                        </>
                      ) : (
                        <>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#64748b' }}></div>
                          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                            Branch bypassed under current inputs
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{
                  height: '240px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  color: 'var(--text-dim)',
                  padding: '20px'
                }}>
                  <GitBranch size={32} style={{ opacity: 0.3, marginBottom: '12px' }} />
                  <p style={{ fontSize: '0.8rem' }}>
                    Click any node in the tree diagram to inspect its Gini reduction, sample distribution, and ITS countermeasure.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. RULE EXTRACTION ENGINE TAB */}
      {/* ======================================================== */}
      {explorerTab === 'rules' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Filter Bar */}
          <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={16} color="var(--brand-cyan)" />
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc' }}>
                Filter Extracted Production Rules:
              </span>
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['ALL', 'Severe', 'High', 'Moderate', 'Low'].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setRuleFilter(lvl)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    background: ruleFilter === lvl ? (lvl === 'ALL' ? '#38bdf8' : getRiskColor(lvl)) : 'rgba(255, 255, 255, 0.05)',
                    color: ruleFilter === lvl ? '#000' : 'var(--text-muted)'
                  }}
                >
                  {lvl} Rules ({lvl === 'ALL' ? allRules.length : allRules.filter(r => r.riskLevel === lvl).length})
                </button>
              ))}
            </div>
          </div>

          {/* Rules Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredRules.map((r, i) => (
              <div
                key={r.leafId}
                className="glass-panel"
                style={{
                  padding: '16px 20px',
                  borderLeft: `4px solid ${getRiskColor(r.riskLevel)}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: getRiskColor(r.riskLevel),
                      color: '#000',
                      textTransform: 'uppercase'
                    }}>
                      {r.riskLevel} Risk ({r.percentage}%)
                    </span>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
                      {r.title}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Support: <strong style={{ color: '#fff' }}>{r.samples} samples</strong> ({r.samplePct}%)
                    </span>
                    <button
                      onClick={() => handleCopy(r.leafId, r.ruleText)}
                      className="btn-secondary"
                      style={{ fontSize: '0.72rem', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      {copiedRuleId === r.leafId ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                      <span>{copiedRuleId === r.leafId ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Formal Rule Text */}
                <div style={{
                  background: '#090d16',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.76rem',
                  color: '#fbbf24',
                  lineHeight: 1.5,
                  marginBottom: '10px'
                }}>
                  {r.ruleText}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  <span>Automated Action: <strong style={{ color: '#cbd5e1' }}>{r.countermeasure}</strong></span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>Gini: {r.gini?.toFixed(3)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. PRUNING & COMPLEXITY LAB TAB */}
      {/* ======================================================== */}
      {explorerTab === 'pruning' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={18} color="#fbbf24" />
              Decision Tree Pruning Simulator
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
              Cost-Complexity Pruning (ccp_alpha) eliminates leaf nodes that add little explanatory power, preventing overfitting on noisy accident samples while maintaining maximum human interpretability.
            </p>

            {/* Slider */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>
                  Maximum Tree Depth (max_depth)
                </label>
                <span style={{ fontSize: '0.88rem', fontFamily: 'var(--font-mono)', color: '#fbbf24', fontWeight: 700 }}>
                  Depth = {selectedDepth}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="4"
                value={selectedDepth}
                onChange={(e) => setSelectedDepth(Number(e.target.value))}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                <span>Depth 1 (Decision Stump)</span>
                <span>Depth 2 (Coarse)</span>
                <span>Depth 3 (Balanced)</span>
                <span>Depth 4 (Full Tree)</span>
              </div>
            </div>

            {/* Simulated Model Metrics at this Depth */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <div style={{ background: '#090d16', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Active Nodes</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>
                  {visibleNodes.length}
                </div>
              </div>
              <div style={{ background: '#090d16', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Estimated Accuracy</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>
                  {selectedDepth === 1 ? '74.2%' : selectedDepth === 2 ? '81.5%' : selectedDepth === 3 ? '85.9%' : '88.4%'}
                </div>
              </div>
              <div style={{ background: '#090d16', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Interpretability</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fbbf24' }}>
                  {selectedDepth <= 2 ? 'Maximum' : selectedDepth === 3 ? 'High' : 'Optimal'}
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', marginBottom: '8px' }}>
              Bias-Variance Tradeoff Analysis
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
              Comparative breakdown between the single pruned Decision Tree and the Random Forest ensemble:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24', marginBottom: '4px' }}>
                  Decision Tree (White-Box Benchmark)
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  Generates deterministic binary decision rules that can be audited by non-technical traffic police officers and translated directly into traffic signal timing plans.
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', marginBottom: '4px' }}>
                  Random Forest (Black-Box Ensemble)
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  Averages 100 decorrelated decision trees. Improves accuracy from 88.4% to 94.2% by reducing variance, but loses direct inspectability without SHAP and LIME surrogate approximations.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. FEATURE SPLIT IMPORTANCE TAB */}
      {/* ======================================================== */}
      {explorerTab === 'metrics' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="#fbbf24" />
            Decision Tree Feature Split Importances (Mean Decrease in Impurity)
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
            Computed by summing the Gini impurity reduction $\Delta Gini$ achieved by all binary splits on each feature, normalized across the 5,000 traffic training samples.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {DECISION_TREE_FEATURE_IMPORTANCE.map((feat, idx) => (
              <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div>
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#f8fafc' }}>
                      {feat.displayName}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
                      ({feat.description})
                    </span>
                  </div>
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#fbbf24' }}>
                    {(feat.importance * 100).toFixed(1)}%
                  </span>
                </div>

                <div style={{ width: '100%', height: '7px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${feat.importance * 100 * 2.5}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #f59e0b, #ef4444)',
                    borderRadius: '4px'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
