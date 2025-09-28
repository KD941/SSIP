import mongoose from 'mongoose';

const smartBinSchema = mongoose.Schema({
  binId: { type: String, required: true, unique: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  fillLevel: { type: Number, default: 0 }, // Percentage
  status: { type: String, enum: ['Active', 'Full', 'Maintenance'], default: 'Active' },
  zoneId: { type: String },
}, { timestamps: true });

const SmartBin = mongoose.model('SmartBin', smartBinSchema);

export default SmartBin;