import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: [
      'Traffic Authority Officer',
      'Data Scientist / ML Engineer',
      'Urban City Planner',
      'Highway Patrol Commander',
      'Commuter'
    ],
    default: 'Traffic Authority Officer'
  },
  department: { type: String, default: 'Intelligent Transportation Systems (ITS) Command Center' },
  badgeId: { type: String },
  messages: [
    {
      id: { type: String },
      title: { type: String },
      message: { type: String },
      type: { type: String, default: 'success' },
      badgeId: { type: String },
      role: { type: String },
      department: { type: String },
      recipientEmail: { type: String },
      createdAt: { type: Date, default: Date.now },
      read: { type: Boolean, default: false }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
