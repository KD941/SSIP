import SmartBin from '../models/SmartBin.js';

export const getBins = async (req, res) => {
  try {
    const bins = await SmartBin.find({});
    res.status(200).json(bins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBin = async (req, res) => {
  const { binId, location, fillLevel } = req.body;
  const newBin = new SmartBin({ 
      binId, 
      location: { type: 'Point', coordinates: location.coordinates },
      fillLevel 
    });
  try {
    await newBin.save();
    res.status(201).json(newBin);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};