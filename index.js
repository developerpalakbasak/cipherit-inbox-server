require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors()); // enable CORS for all routes (can be adjusted later)

// In‑memory data store
let items = [];
let nextId = 1;

// Create a new item
const connectDB = require('./utils/db');
connectDB();

const Contact = require('./models/contact');

// Get all contacts from MongoDB
app.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
// Get contacts where isRead is true
app.get('/contacts/isRead', async (req, res) => {
  try {
    const contacts = await Contact.find({ isRead: true });
    res.status(200).json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get contacts where isReplyed is true
app.patch('/contacts/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    // Directly set isRead to true without requiring a request body
    const updated = await Contact.findByIdAndUpdate(id, { isRead: true }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Contact not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.patch('/contacts/:id/replyed', async (req, res) => {
  try {
    const { id } = req.params;
    // Directly set isReplyed to true without requiring a request body
    const updated = await Contact.findByIdAndUpdate(id, { isReplyed: true }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Contact not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
