import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['Traffic Authority Officer', 'Data Scientist / ML Engineer', 'Urban City Planner', 'Commuter'],
    default: 'Traffic Authority Officer'
  },
  department: { type: String, default: 'Intelligent Transportation Systems (ITS) Command Center' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
