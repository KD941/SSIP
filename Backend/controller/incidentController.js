import mongoose from 'mongoose';
import Incident from '../models/Incident.js';
import User from '../models/User.js';

/**
 * @desc    Get all incidents (for Admin)
 * @route   GET /api/incidents
 * @access  Private (Admin)
 */
export const getIncidents = async (req, res) => {
  try {
    // Fetch incidents and populate user details for reporter and assigned staff
    const incidents = await Incident.find({})
      .populate('reporterId', 'username role')
      .populate('assignedTo', 'username role')
      .sort({ createdAt: -1 }); // Show newest first

    res.status(200).json(incidents);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not fetch incidents.' });
    console.error(error);
  }
};

/**
 * @desc    Get incidents reported by the current user (for Citizen)
 * @route   GET /api/incidents/my-reports
 * @access  Private (Citizen)
 */
export const getMyReportedIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find({ reporterId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(incidents);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not fetch your reports.' });
  }
};

/**
 * @desc    Get tasks assigned to the current user (for Staff)
 * @route   GET /api/incidents/my-tasks
 * @access  Private (CleaningStaff)
 */
export const getMyAssignedTasks = async (req, res) => {
  try {
    // This finds incidents directly assigned to the staff user
    const tasks = await Incident.find({ assignedTo: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not fetch your tasks.' });
  }
};

/**
 * @desc    Create a new incident
 * @route   POST /api/incidents
 * @access  Private (Citizen)
 */
export const createIncident = async (req, res) => {
  const { description, location, photoUrl } = req.body;
  const reporterId = req.userId; // Attached by auth middleware

  if (!description || !location) {
    return res.status(400).json({ message: 'Description and location are required.' });
  }

  try {
    const newIncident = new Incident({
      reporterId,
      description,
      location, // Assuming location is a GeoJSON point object
      photoUrl,
    });

    const savedIncident = await newIncident.save();
    // Award points to citizen
    await User.findByIdAndUpdate(reporterId, { $inc: { 'profile.points': 10 } });
    res.status(201).json(savedIncident);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not create incident.' });
    console.error(error);
  }
};

/**
 * @desc    Update an incident's status or assignment
 * @route   PATCH /api/incidents/:id
 * @access  Private (Admin or Staff)
 */
export const updateIncidentStatus = async (req, res) => {
    const { id } = req.params;
    const { status, assignedTo } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: `No incident with id: ${id}` });
    }

    try {
        const updatedIncident = await Incident.findByIdAndUpdate(
            id,
            { status, assignedTo },
            { new: true, runValidators: true } // Return the updated document
        ).populate('reporterId', 'username').populate('assignedTo', 'username');

        if (!updatedIncident) {
            return res.status(404).json({ message: `Incident not found.` });
        }

        res.status(200).json(updatedIncident);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}