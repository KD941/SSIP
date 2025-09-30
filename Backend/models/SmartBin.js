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
  fillLevel: {
    type: Number,
    default: 0,
    min: 0, // Percentage cannot be less than 0
    max: 100, // Percentage cannot be more than 100
  },
  status: { type: String, enum: ['Active', 'Full', 'Maintenance'], default: 'Active' },
  zoneId: { type: String },
}, { timestamps: true });

// Add a 2dsphere index for geospatial queries on the location field
smartBinSchema.index({ location: '2dsphere' });

const SmartBin = mongoose.model('SmartBin', smartBinSchema);

export default SmartBin;