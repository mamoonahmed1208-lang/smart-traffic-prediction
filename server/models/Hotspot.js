import mongoose from 'mongoose';

const HotspotSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  corridor: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  currentRiskScore: { type: Number, required: true },
  riskLevel: {
    type: String,
    enum: ['Low', 'Moderate', 'High', 'Severe'],
    required: true
  },
  historicalAccidentsCount: { type: Number, default: 0 },
  averageDailyVolume: { type: Number, default: 25000 },
  speedLimit: { type: Number, default: 60 },
  currentAvgSpeed: { type: Number, default: 45 },
  weatherStatus: { type: String, default: 'Clear' },
  activeAlert: { type: String, default: null },
  cctvActive: { type: Boolean, default: true },
  iotSensorsCount: { type: Number, default: 4 },
  primaryHazardFactor: { type: String, default: 'High Speed Variance' },
  updatedAt: { type: Date, default: Date.now }
});

const Hotspot = mongoose.models.Hotspot || mongoose.model('Hotspot', HotspotSchema);
export default Hotspot;
