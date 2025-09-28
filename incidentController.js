import Incident from '../models/Incident.js';
import User from '../models/User.js';

export const getIncidents = async (req, res) => {
  try {
    // Populate reporter's username
    const incidents = await Incident.find({}).populate('reporterId', 'username');
    res.status(200).json(incidents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createIncident = async (req, res) => {
  const { reporterId, location, description } = req.body;
  const newIncident = new Incident({
    reporterId,
    location: { type: 'Point', coordinates: location.coordinates },
    description,
  });
  try {
    await newIncident.save();
    // Award points to citizen
    await User.findByIdAndUpdate(reporterId, { $inc: { 'profile.points': 10 } });
    res.status(201).json(newIncident);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateIncidentStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const updatedIncident = await Incident.findByIdAndUpdate(id, { status }, { new: true });
        res.status(200).json(updatedIncident);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}