import mongoose from 'mongoose';

const taskSchema = mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['CitizenReport', 'BinFull', 'AdminRequest']
  },
  sourceId: { // ID of the incident, smart bin, etc.
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'sourceModel'
  },
  sourceModel: {
    type: String,
    required: true,
    enum: ['Incident', 'SmartBin']
  },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Assigned', 'InProgress', 'Completed', 'Resolved'],
    default: 'Pending',
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  zone: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone' }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

export default Task;