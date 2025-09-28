import mongoose from 'mongoose';

const incidentSchema = mongoose.Schema({
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  location: {
    type: { type: String, enum: ['Point'], required: true, default: 'Point' },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  description: { type: String, required: true },
  photoUrl: { type: String }, // URL to the uploaded image
  status: {
    type: String,
    enum: ['Pending', 'Assigned', 'InProgress', 'Resolved'],
    default: 'Pending',
  },
  assignedToStaffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

const Incident = mongoose.model('Incident', incidentSchema);

export default Incident;