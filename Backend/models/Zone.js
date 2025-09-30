import mongoose from 'mongoose';

const zoneSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  // GeoJSON Polygon to define the zone boundaries
  bounds: {
    type: { type: String, enum: ['Polygon'], default: 'Polygon' },
    coordinates: { type: [[[Number]]], required: true } // Array of LinearRing coordinate arrays
  },
  assignedStaff: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

const Zone = mongoose.model('Zone', zoneSchema);

export default Zone;