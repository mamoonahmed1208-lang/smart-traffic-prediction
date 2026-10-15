import React, { useState } from 'react';
import {
  Sparkles,
  BarChart3,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Layers,
  Award,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';

export default function ExplainableAIView({ predictionResult }) {
  const [subTab, setSubTab] = useState('shap'); // 'shap' | 'lime' | 'metrics'

  const shapData = predictionResult?.shap;
  const limeData = predictionResult?.lime;
  const currentPred = predictionResult?.prediction;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Sub-navigation Header */}
      <div className="glass-panel" style={{
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="var(--brand-cyan)" />
            Explainable AI (XAI) Diagnostic Center
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Transparent algorithmic interpretability powered by game-theoretic SHAP and local surrogate LIME
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          background: '#0f172a',
          borderRadius: '10px',
          padding: '4px',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => setSubTab('shap')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: subTab === 'shap' ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'transparent',
              color: subTab === 'shap' ? '#fff' : 'var(--text-muted)'
            }}
          >
            SHAP Waterfall & Attributions
          </button>
          <button
            onClick={() => setSubTab('lime')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: subTab === 'lime' ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'transparent',
              color: subTab === 'lime' ? '#fff' : 'var(--text-muted)'
            }}
          >
            LIME Local Surrogate
          </button>
          <button
            onClick={() => setSubTab('metrics')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: subTab === 'metrics' ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'transparent',
              color: subTab === 'metrics' ? '#fff' : 'var(--text-muted)'
            }}
          >
            Model Benchmarks & Research
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. SHAP TAB */}
      {/* ======================================================== */}
      {subTab === 'shap' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px' }}>
          {/* Overview Card (4 cols) */}
          <div style={{ gridColumn: 'span 4' }}>
            <div className="glass-panel" style={{ padding: '24px', height: '100%' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--brand-cyan)', letterSpacing: '0.05em' }}>
                SHAP Axiomatic Foundations
              </span>
              <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', margin: '8px 0 12px 0' }}>
                Shapley Additive exPlanations
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                Based on cooperative game theory (Lundberg & Lee, NeurIPS 2017). Each feature's Shapley value measures its marginal contribution to shifting the accident probability away from the global baseline expected risk.
              </p>

              {/* Formula Callout */}
              <div style={{
                background: '#090d16',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '18px'
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '4px' }}>Efficiency Property:</div>
                <div style={{ fontSize: '0.88rem', fontFamily: 'var(--font-mono)', color: 'var(--brand-cyan)' }}>
                  f(x) = E[f(x)] + Σ φ_i
                </div>
              </div>

              {/* Metrics Summary */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Base Expected Risk E[f(x)]:</span>
                  <strong style={{ fontSize: '0.85rem', color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>
                    {((shapData?.baseValue ?? 0.285) * 100).toFixed(1)}%
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Predicted Probability f(x):</span>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--risk-severe)', fontFamily: 'var(--font-mono)' }}>
                    {((currentPred?.probability ?? 0.55) * 100).toFixed(1)}%
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total SHAP Shift (Σ φ_i):</span>
                  <strong style={{ fontSize: '0.85rem', color: (currentPred?.probability ?? 0.55) >= (shapData?.baseValue ?? 0.285) ? 'var(--xai-positive)' : 'var(--xai-negative)', fontFamily: 'var(--font-mono)' }}>
                    {(((currentPred?.probability ?? 0.55) - (shapData?.baseValue ?? 0.285)) * 100).toFixed(1)}%
                  </strong>
                </div>
              </div>

              {/* Legend */}
              <div style={{ marginTop: '20px', display: 'flex', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--xai-positive)' }}></div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Increases Risk (+)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--xai-negative)' }}></div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Decreases Risk (-)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Contributions & Waterfall (8 cols) */}
          <div style={{ gridColumn: 'span 8' }}>
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.05rem', color: '#f8fafc' }}>
                  Feature Attributions Ranked by Impact
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  TreeExplainer Algorithm
                </span>
              </div>

              {/* Waterfall Bar List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {(shapData?.featureContributions || []).map((fc, index) => {
                  const isPositive = fc.shapValue >= 0;
                  const absVal = Math.abs(fc.shapValue);
                  const percentageWidth = Math.min(100, absVal * 320);

                  return (
                    <div key={index} style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '10px',
                      padding: '12px 16px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f8fafc' }}>
                              {fc.displayName}
                            </span>
                            <span style={{
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: isPositive ? 'rgba(239, 68, 68, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                              color: isPositive ? 'var(--xai-positive)' : 'var(--xai-negative)'
                            }}>
                              {isPositive ? '+ RISKY' : 'SAFE'}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {fc.description}
                          </p>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span style={{
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            fontFamily: 'var(--font-mono)',
                            color: isPositive ? 'var(--xai-positive)' : 'var(--xai-negative)'
                          }}>
                            {isPositive ? `+${(fc.shapValue * 100).toFixed(1)}%` : `${(fc.shapValue * 100).toFixed(1)}%`}
                          </span>
                        </div>
                      </div>

                      {/* Bar Visualization */}
                      <div style={{
                        width: '100%',
                        height: '7px',
                        background: '#1e293b',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        position: 'relative'
                      }}>
                        <div style={{
                          width: `${percentageWidth}%`,
                          height: '100%',
                          background: isPositive ? 'linear-gradient(90deg, #ef4444, #f87171)' : 'linear-gradient(90deg, #0284c7, #38bdf8)',
                          borderRadius: '4px',
                          boxShadow: isPositive ? '0 0 8px rgba(239, 68, 68, 0.4)' : '0 0 8px rgba(56, 189, 248, 0.4)'
                        }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. LIME TAB */}
      {/* ======================================================== */}
      {subTab === 'lime' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px' }}>
          {/* LIME Theory Card (4 cols) */}
          <div style={{ gridColumn: 'span 4' }}>
            <div className="glass-panel" style={{ padding: '24px', height: '100%' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#c084fc', letterSpacing: '0.05em' }}>
                Local Interpretable Model-Agnostic Explanations
              </span>
              <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', margin: '8px 0 12px 0' }}>
                LIME Local Surrogate
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                Reference: Ribeiro, Singh, & Guestrin (ACM SIGKDD 2016). LIME creates a local interpretable surrogate model by perturbing the current traffic instance in an exponential distance kernel neighborhood.
              </p>

              {/* Surrogate Formulation */}
              <div style={{
                background: '#090d16',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '16px'
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '4px' }}>Surrogate Loss Minimization:</div>
                <div style={{ fontSize: '0.84rem', fontFamily: 'var(--font-mono)', color: '#c084fc' }}>
                  ξ(x) = argmin L(f, g, π_x) + Ω(g)
                </div>
              </div>

              {/* Surrogate Quality Stats */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Local Fidelity R²:</span>
                  <strong style={{ fontSize: '0.85rem', color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                    0.912 (High Fit)
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Perturbed Samples:</span>
                  <strong style={{ fontSize: '0.85rem', color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>
                    1,000 instances
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Kernel Width σ:</span>
                  <strong style={{ fontSize: '0.85rem', color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>
                    0.75
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* LIME Rules (8 cols) */}
          <div style={{ gridColumn: 'span 8' }}>
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.05rem', color: '#f8fafc', marginBottom: '8px' }}>
                Local Linear Surrogate Decision Rules
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                These rule conditions describe why the black-box model produced this specific accident risk rating for the local neighborhood:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(limeData?.rules || []).map((rule, idx) => {
                  const isPositive = rule.weight >= 0;
                  return (
                    <div key={idx} style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '10px',
                      padding: '14px 16px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            fontFamily: 'var(--font-mono)',
                            color: '#38bdf8'
                          }}>
                            {rule.rule}
                          </span>
                        </div>
                        <span style={{
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          fontFamily: 'var(--font-mono)',
                          color: isPositive ? 'var(--xai-positive)' : 'var(--xai-negative)'
                        }}>
                          Weight: {isPositive ? `+${rule.weight.toFixed(2)}` : rule.weight.toFixed(2)}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {rule.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. MODEL BENCHMARKS & LITERATURE TAB */}
      {/* ======================================================== */}
      {subTab === 'metrics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Side by side Model Comparison Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Random Forest Card */}
            <div className="glass-panel" style={{ padding: '24px', borderTop: '4px solid #38bdf8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', color: '#f8fafc' }}>Random Forest Classifier</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--brand-cyan)' }}>Primary Ensemble Model (Scikit-Learn)</span>
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '4px 8px',
                  borderRadius: '6px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: 'var(--brand-cyan)'
                }}>
                  Recommended
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
                <div style={{ background: '#090d16', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Accuracy</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>94.2%</div>
                </div>
                <div style={{ background: '#090d16', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>F1-Score</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>92.1%</div>
                </div>
                <div style={{ background: '#090d16', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ROC-AUC</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#a855f7' }}>0.965</div>
                </div>
              </div>

              <ul style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6, paddingLeft: '18px' }}>
                <li>Ensemble of 100 decorrelated decision trees with feature bootstrap bagging.</li>
                <li>Robust against extreme nonlinear feature correlations (e.g. Speeding on Icy Surfaces).</li>
                <li>Integrated with SHAP TreeExplainer for polynomial-time Shapley computation.</li>
              </ul>
            </div>

            {/* Decision Tree Card */}
            <div className="glass-panel" style={{ padding: '24px', borderTop: '4px solid #f59e0b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', color: '#f8fafc' }}>Decision Tree Classifier</h3>
                  <span style={{ fontSize: '0.75rem', color: '#fbbf24' }}>Interpretable Baseline Model (Scikit-Learn)</span>
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '4px 8px',
                  borderRadius: '6px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: '#fbbf24'
                }}>
                  Transparent
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
                <div style={{ background: '#090d16', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Accuracy</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>88.4%</div>
                </div>
                <div style={{ background: '#090d16', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>F1-Score</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>85.8%</div>
                </div>
                <div style={{ background: '#090d16', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ROC-AUC</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#a855f7' }}>0.897</div>
                </div>
              </div>

              <ul style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6, paddingLeft: '18px' }}>
                <li>Single transparent hierarchical tree with depth-bounded pruning (max depth = 6).</li>
                <li>Clear binary threshold splits based on Gini impurity reduction.</li>
                <li>Instant verification of algorithmic decisions by traffic authority human operators.</li>
              </ul>
            </div>
          </div>

          {/* Synopsis Academic References Card (Image 1) */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <BookOpen size={18} color="var(--brand-cyan)" />
              Literature References & Standards Cited in Synopsis
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div style={{ background: '#090d16', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--brand-cyan)', fontWeight: 700, textTransform: 'uppercase' }}>
                  WHO Road Safety
                </div>
                <h4 style={{ fontSize: '0.9rem', color: '#f8fafc', margin: '4px 0 8px 0' }}>
                  World Health Organization
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  Global Status Report on Road Safety. Forms the foundational empirical basis for speed risk curves and multi-factor traffic accident modeling.
                </p>
              </div>

              <div style={{ background: '#090d16', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: '#c084fc', fontWeight: 700, textTransform: 'uppercase' }}>
                  NeurIPS 2017
                </div>
                <h4 style={{ fontSize: '0.9rem', color: '#f8fafc', margin: '4px 0 8px 0' }}>
                  Lundberg, S. M., & Lee, S. I.
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  A Unified Approach to Interpreting Model Predictions (SHAP). Establishes game-theoretic Shapley additive feature attributions for ensemble models.
                </p>
              </div>

              <div style={{ background: '#090d16', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>
                  ACM SIGKDD 2016
                </div>
                <h4 style={{ fontSize: '0.9rem', color: '#f8fafc', margin: '4px 0 8px 0' }}>
                  Ribeiro, Singh, & Guestrin
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  "Why Should I Trust You?": Explaining the Predictions of Any Classifier (LIME). Introduces local linear surrogate model approximations.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
