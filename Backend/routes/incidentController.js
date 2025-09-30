import mongoose from 'mongoose';
import Incident from '../models/Incident.js';

/**
 * @desc    Get all incidents
 * @route   GET /api/incidents
 * @access  Private (requires authentication)
 */
export const getIncidents = async (req, res) => {
  try {
    // Fetch incidents and populate user details for reporter and assigned staff
    const incidents = await Incident.find({})
      .populate('reporterId', 'username role')
      .populate('assignedToStaffId', 'username role')
      .sort({ createdAt: -1 }); // Show newest first

    res.status(200).json(incidents);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not fetch incidents.' });
    console.error(error);
  }
};

/**
 * @desc    Create a new incident
 * @route   POST /api/incidents
 * @access  Private (requires authentication)
 */
export const createIncident = async (req, res) => {
  const { description, location, photoUrl } = req.body;

  // Note: We assume `req.userId` is added by an authentication middleware
  // after verifying the user's JWT.
  const reporterId = req.userId;

  if (!description || !location) {
    return res.status(400).json({ message: 'Description and location are required.' });
  }

  try {
    const newIncident = new Incident({
      reporterId,
      description,
      location,
      photoUrl,
    });

    const savedIncident = await newIncident.save();
    res.status(201).json(savedIncident);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not create incident.' });
    console.error(error);
  }
};

/**
 * @desc    Update an incident's status or assignment
 * @route   PATCH /api/incidents/:id
 * @access  Private (Admin or CleaningStaff)
 */
export const updateIncidentStatus = async (req, res) => {
  const { id } = req.params;
  const { status, assignedToStaffId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: `No incident with id: ${id}` });
  }

  try {
    const updatedIncident = await Incident.findByIdAndUpdate(
      id,
      { status, assignedToStaffId },
      { new: true, runValidators: true } // Return the updated document and run schema validators
    );

    if (!updatedIncident) {
      return res.status(404).json({ message: `Incident not found.` });
    }

    res.status(200).json(updatedIncident);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not update incident.' });
    console.error(error);
  }
};