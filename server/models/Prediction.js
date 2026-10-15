import mongoose from 'mongoose';

const PredictionSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  modelUsed: {
    type: String,
    enum: ['Random Forest', 'Decision Tree'],
    default: 'Random Forest'
  },
  inputs: {
    trafficDensity: { type: Number, required: true },
    averageSpeed: { type: Number, required: true },
    speedLimit: { type: Number, default: 60 },
    weather: { type: String, required: true },
    roadSurface: { type: String, required: true },
    roadType: { type: String, required: true },
    timeOfDay: { type: String, required: true },
    lighting: { type: String, required: true },
    historicalRiskIndex: { type: Number, default: 50 },
    locationName: { type: String, default: 'Metropolitan Junction 12' }
  },
  prediction: {
    probability: { type: Number, required: true },
    riskPercentage: { type: Number, required: true },
    riskLevel: {
      type: String,
      enum: ['Low', 'Moderate', 'High', 'Severe'],
      required: true
    },
    confidenceScore: { type: Number, default: 0.92 }
  },
  shapExplanation: {
    baseValue: { type: Number, default: 0.28 },
    featureContributions: [{
      feature: String,
      displayName: String,
      value: mongoose.Schema.Types.Mixed,
      shapValue: Number,
      impact: String
    }]
  },
  limeExplanation: {
    intercept: { type: Number, default: 0.30 },
    rules: [{
      rule: String,
      feature: String,
      weight: Number,
      impact: String
    }],
    score: { type: Number, default: 0.89 }
  },
  recommendations: [{
    category: String,
    title: String,
    description: String,
    urgency: String
  }],
  user: {
    type: String,
    default: 'Traffic Authority Officer'
  }
});

const Prediction = mongoose.models.Prediction || mongoose.model('Prediction', PredictionSchema);
export default Prediction;
