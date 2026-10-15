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

export default function App() {
  const [activeTab, setActiveTab] = useState('prediction');
  const [selectedModel, setSelectedModel] = useState('Random Forest');
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(Date.now());
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // User Authentication State
  const [currentUser, setCurrentUser] = useState({
    id: 'usr_1',
    name: 'Mamoon Ahmed',
    email: 'officer@its.gov',
    role: 'Traffic Authority Officer',
    department: 'Central ITS Command Center'
  });

  // System Health Status State
  const [systemStatus, setSystemStatus] = useState({
    mongoStatus: 'connected',
    status: 'online'
  });

  // Hotspots List from Backend
  const [hotspots, setHotspots] = useState([]);

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
        const healthRes = await fetch('http://localhost:5000/api/health');
        if (healthRes.ok) {
          const healthData = await healthRes.json();
          setSystemStatus(healthData);
        }

        const hotspotsRes = await fetch('http://localhost:5000/api/hotspots');
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

  // Execute Prediction API Call
  const executePrediction = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/predict', {
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
        setRefreshTrigger(Date.now());
      } else {
        throw new Error('API Response Error');
      }
    } catch (err) {
      console.warn('Using client-side fallback engine:', err);
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
          <ExplainableAIView predictionResult={predictionResult} />
        )}

        {activeTab === 'history' && (
          <HistoryAndReports refreshTrigger={refreshTrigger} />
        )}

        {activeTab === 'users' && (
          <UserManagement currentUser={currentUser} setCurrentUser={setCurrentUser} />
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
      />
    </div>
  );
}
