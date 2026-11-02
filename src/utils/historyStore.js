/**
 * Prediction History Persistence & Synchronization Store
 * Bridges MongoDB backend API and client-side localStorage fallback
 * Guarantees prediction logs persist across browser refreshes and offline operation
 */

import { INITIAL_PREDICTION_HISTORY } from '../data/seedHistoryData';

const LOCAL_STORAGE_KEY = 'smart_traffic_prediction_history';

/**
 * Initializes and retrieves cached prediction history from localStorage
 * Falls back to realistic seed history if empty
 */
export function getLocalPredictionHistory() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading history from localStorage:', e);
  }

  // Auto-seed with baseline realistic data if empty
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PREDICTION_HISTORY));
  } catch (e) {
    // Ignore storage quota or sandbox restrictions
  }
  return [...INITIAL_PREDICTION_HISTORY];
}

/**
 * Fetches history from MongoDB REST API; merges with local storage fallback
 */
export async function fetchFullPredictionHistory() {
  try {
    const res = await fetch('/api/history', {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(3000)
    });

    if (res.ok) {
      const dbRecords = await res.json();
      if (Array.isArray(dbRecords) && dbRecords.length > 0) {
        // Cache DB records into local storage as well
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dbRecords));
        } catch (e) {}
        return dbRecords;
      }
    }
  } catch (err) {
    // Backend offline or unreachable - use local storage
  }

  return getLocalPredictionHistory();
}

/**
 * Persists a new prediction record to local storage and syncs to backend if reachable
 */
export async function persistPredictionRecord(record) {
  const current = getLocalPredictionHistory();
  const standardizedRecord = {
    _id: record._id || `pred_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    timestamp: record.timestamp || new Date().toISOString(),
    modelUsed: record.modelUsed || record.prediction?.model || 'Random Forest',
    inputs: record.inputs || {},
    prediction: {
      probability: record.prediction?.probability ?? (Number(record.prediction?.riskPercentage || 50) / 100),
      riskPercentage: record.prediction?.riskPercentage ?? 50,
      riskLevel: record.prediction?.riskLevel || 'Moderate',
      confidenceScore: record.prediction?.confidenceScore ?? 0.92
    },
    shapExplanation: record.shapExplanation || record.shap || {
      baseValue: 0.28,
      featureContributions: []
    },
    limeExplanation: record.limeExplanation || record.lime || {
      rules: [],
      score: 0.89
    },
    recommendations: record.recommendations || [],
    user: record.user || 'Traffic Authority Officer'
  };

  const updated = [standardizedRecord, ...current.filter(item => item._id !== standardizedRecord._id)].slice(0, 80);

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }

  // Attempt backend push asynchronously
  try {
    fetch('/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: standardizedRecord.modelUsed,
        inputs: standardizedRecord.inputs,
        user: standardizedRecord.user
      })
    }).catch(() => {});
  } catch (e) {}

  return updated;
}

/**
 * Deletes a record by ID from local storage and backend
 */
export async function deletePredictionRecord(id) {
  const current = getLocalPredictionHistory();
  const updated = current.filter(item => item._id !== id);

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {}

  try {
    fetch(`/api/history/${id}`, {
      method: 'DELETE'
    }).catch(() => {});
  } catch (e) {}

  return updated;
}

/**
 * Resets history to baseline benchmark records
 */
export function seedBenchmarkRecords() {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PREDICTION_HISTORY));
  } catch (e) {}
  return [...INITIAL_PREDICTION_HISTORY];
}

/**
 * Clears all prediction history
 */
export function clearAllPredictionHistory() {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
  } catch (e) {}
  return [];
}
