import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PredictionStudio from './components/PredictionStudio';
import ExplainableAIView from './components/ExplainableAIView';
import RiskHotspotMap from './components/RiskHotspotMap';
import LiveIoTSimulator from './components/LiveIoTSimulator';
import HistoryAndReports from './components/HistoryAndReports';
import GraphicalReports from './components/GraphicalReports';
import UserManagement from './components/UserManagement';
import ArchitectureModal from './components/ArchitectureModal';
import AuthModal from './components/AuthModal';
import ExclusivePredictionModal from './components/ExclusivePredictionModal';
import { executeClientPrediction } from './utils/clientMlEngine';
import { executeGeminiPrediction, getGeminiApiKey } from './utils/geminiAiEngine';
import { DEFAULT_HOTSPOTS } from './data/hotspotsData';
import { persistPredictionRecord } from './utils/historyStore';
import { getCurrentUser } from './utils/authStore';
import { CheckCircle2, X, Mail, ShieldCheck, ArrowRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('prediction');
  const [selectedModel, setSelectedModel] = useState('Random Forest');
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(Date.now());
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isExclusiveModalOpen, setIsExclusiveModalOpen] = useState(false);

  // User Authentication State
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [registrationToast, setRegistrationToast] = useState(null);

  // Auto-dismiss registration message toast
  useEffect(() => {
    if (registrationToast) {
      const timer = setTimeout(() => {
        setRegistrationToast(null);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [registrationToast]);

  // System Health Status State
  const [systemStatus, setSystemStatus] = useState({
    mongoStatus: 'connected',
    status: 'online'
  });

  // Hotspots List (Initialized with full high-fidelity fallback data)
  const [hotspots, setHotspots] = useState(DEFAULT_HOTSPOTS);

  // Traffic Model Inputs State
  const [inputs, setInputs] = useState({
    trafficDensity: 75,
    averageSpeed: 85,
    speedLimit: 60,
    weather: 'Heavy Rain',
    roadSurface: 'Wet',
    roadType: 'Intersection',
    timeOfDay: 'Morning Peak',
    lighting: 'Daylight',
    historicalRiskIndex: 70,
    locationName: 'Metropolitan Junction 12'
  });

  // Prediction and XAI Result State
  const [predictionResult, setPredictionResult] = useState(null);

  // Check Backend Health & Hotspots on Mount
  useEffect(() => {
    const fetchStatusAndHotspots = async () => {
      try {
        const healthRes = await fetch('/api/health');
        if (healthRes.ok) {
          const healthData = await healthRes.json();
          setSystemStatus(healthData);
        }

        const hotspotsRes = await fetch('/api/hotspots');
        if (hotspotsRes.ok) {
          const hotspotsData = await hotspotsRes.json();
          setHotspots(hotspotsData);
        }
      } catch (err) {
        console.warn('Backend connection note:', err.message);
      }
    };

    fetchStatusAndHotspots();
    executePrediction();
  }, []);

  // Re-run prediction whenever selectedModel changes
  useEffect(() => {
    executePrediction();
  }, [selectedModel]);

  // Execute Prediction API Call
  const executePrediction = async () => {
    setLoading(true);
    try {
      if (selectedModel === 'Gemini 3.8 Flash') {
        // Try backend first if available, else run browser-side Gemini engine
        let data = null;
        try {
          const response = await fetch('/api/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: 'Gemini 3.8 Flash',
              inputs,
              geminiApiKey: getGeminiApiKey(),
              user: currentUser.name
            }),
            signal: AbortSignal.timeout(3500)
          });
          if (response.ok) {
            data = await response.json();
          }
        } catch (netErr) {
          // Node server offline or timed out, run client Gemini engine
        }

        if (!data || !data.success) {
          data = await executeGeminiPrediction(inputs);
        }

        setPredictionResult(data);
        await persistPredictionRecord({
          _id: data.predictionId || `pred_gemini_${Date.now()}`,
          modelUsed: 'Gemini 3.8 Flash',
          inputs,
          prediction: data.prediction,
          shap: data.shap,
          lime: data.lime,
          recommendations: data.recommendations,
          user: currentUser.name
        });
        setRefreshTrigger(Date.now());
        return;
      }

      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel,
          inputs,
          user: currentUser.name
        })
      });

      if (response.ok) {
        const data = await response.json();
        setPredictionResult(data);
        await persistPredictionRecord({
          _id: data.predictionId,
          modelUsed: selectedModel,
          inputs,
          prediction: data.prediction,
          shap: data.shap,
          lime: data.lime,
          recommendations: data.recommendations,
          user: currentUser.name
        });
        setRefreshTrigger(Date.now());
      } else {
        throw new Error('API Response Error');
      }
    } catch (err) {
      console.warn('Using client-side ML & XAI fallback engine:', err.message);
      const fallbackResult = selectedModel === 'Gemini 3.8 Flash'
        ? await executeGeminiPrediction(inputs)
        : executeClientPrediction(inputs, selectedModel);

      setPredictionResult(fallbackResult);
      await persistPredictionRecord({
        modelUsed: selectedModel,
        inputs,
        prediction: fallbackResult.prediction,
        shap: fallbackResult.shap,
        lime: fallbackResult.lime,
        recommendations: fallbackResult.recommendations,
        user: currentUser.name
      });
      setRefreshTrigger(Date.now());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        systemStatus={systemStatus}
        onOpenExclusive={() => setIsExclusiveModalOpen(true)}
        lastMessageTrigger={registrationToast}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '24px' }}>
        {activeTab === 'prediction' && (
          <PredictionStudio
            inputs={inputs}
            setInputs={setInputs}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            onPredict={executePrediction}
            predictionResult={predictionResult}
            loading={loading}
            setActiveTab={setActiveTab}
            onOpenExclusive={() => setIsExclusiveModalOpen(true)}
          />
        )}

        {activeTab === 'hotspots' && (
          <RiskHotspotMap
            hotspots={hotspots}
            onSelectHotspot={(hotspot) => {
              setInputs(prev => ({
                ...prev,
                locationName: hotspot.name,
                averageSpeed: hotspot.currentAvgSpeed,
                speedLimit: hotspot.speedLimit,
                weather: hotspot.weatherStatus,
                historicalRiskIndex: hotspot.currentRiskScore
              }));
              setActiveTab('prediction');
            }}
          />
        )}

        {activeTab === 'iot' && (
          <LiveIoTSimulator />
        )}

        {activeTab === 'reports' && (
          <GraphicalReports hotspots={hotspots} />
        )}

        {activeTab === 'benchmarks' && (
          <ExplainableAIView predictionResult={predictionResult} currentInputs={inputs} />
        )}

        {activeTab === 'history' && (
          <HistoryAndReports refreshTrigger={refreshTrigger} />
        )}

        {activeTab === 'users' && (
          <UserManagement
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            onRegistrationSuccess={(data) => setRegistrationToast(data)}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(10, 15, 29, 0.95)',
        padding: '20px 24px',
        marginTop: 'auto'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#f8fafc' }}>
              Explainable Smart Traffic Accident Prediction System
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Based on Research: WHO Road Safety, SHAP (Lundberg & Lee, NeurIPS 2017), LIME (Ribeiro et al., ACM SIGKDD 2016)
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)' }}>
              React 19
            </span>
            <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)' }}>
              Node.js + Express
            </span>
            <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)' }}>
              MongoDB Live
            </span>
            <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)' }}>
              Scikit-Learn
            </span>
            <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)' }}>
              SHAP & LIME
            </span>
          </div>
        </div>
      </footer>

      {/* Global Registration Successful Toast Alert */}
      {registrationToast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          zIndex: 99999,
          background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.95), rgba(4, 120, 87, 0.95))',
          backdropFilter: 'blur(16px)',
          border: '1px solid #10b981',
          borderRadius: '12px',
          padding: '14px 18px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(16, 185, 129, 0.35)',
          maxWidth: '460px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          color: '#f8fafc',
          animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: '2px'
          }}>
            <CheckCircle2 size={22} color="#34d399" />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#ffffff' }}>
                Registration Successful!
              </span>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                background: 'rgba(255, 255, 255, 0.2)',
                color: '#ecfdf5',
                padding: '1px 6px',
                borderRadius: '4px'
              }}>
                {registrationToast.user?.badgeId || 'ITS-ACTIVE'}
              </span>
            </div>

            <p style={{ fontSize: '0.78rem', color: '#e2e8f0', margin: '4px 0 6px 0', lineHeight: 1.4 }}>
              {registrationToast.registrationMessage?.message || registrationToast.message || `Welcome to Intelligent Traffic Systems, ${registrationToast.user?.name}!`}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: '#a7f3d0' }}>
              <Mail size={12} />
              <span>Official confirmation message received by {registrationToast.user?.email || 'user'}</span>
            </div>
          </div>

          <button
            onClick={() => setRegistrationToast(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              padding: '2px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Dismiss message"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Modals */}
      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onLogin={(user) => setCurrentUser(user)}
        onRegistrationSuccess={(data) => setRegistrationToast(data)}
      />

      <ExclusivePredictionModal
        isOpen={isExclusiveModalOpen}
        onClose={() => setIsExclusiveModalOpen(false)}
        inputs={inputs}
        currentUser={currentUser}
      />
    </div>
  );
}
