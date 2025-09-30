import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const signup = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with that email already exists.' });
    }

    existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User with that username already exists.' });
    }

    const newUser = new User({
      username,
      email,
      password, // Pass the plain password to the model
      role: role || 'Citizen', // Default role to 'Citizen' if not provided
      profile: {
        points: 0,
        incidentsReported: 0,
      },
    });

    await newUser.save();

    const token = jwt.sign(
      { email: newUser.email, id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ result: newUser, token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong during signup.' });
    console.error(error);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isPasswordCorrect = await existingUser.matchPassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id, role: existingUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong during login.' });
    console.error(error);
  }
};