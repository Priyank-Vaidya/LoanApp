// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema definitions
const FamilyMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  relationship: { type: String, required: true },
  income: { type: Number, required: true },
});

const ApplicationSchema = new mongoose.Schema({
  // Personal Details
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  occupation: String,
  annualIncome: Number,
  
  // Family Members
  familyMembers: [FamilyMemberSchema],
  
  // Selected Banks
  selectedBanks: [{ type: Number }],
  
  // Metadata
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'pending' }
});

const Application = mongoose.model('Application', ApplicationSchema);

// Routes
// In your backend server.js
app.post('/api/applications', async (req, res) => {
    try {
      // Validate required fields
      const { name, phone, email, address, familyMembers, selectedBanks } = req.body;
      
      if (!name || !phone || !email || !address) {
        return res.status(400).json({ 
          error: 'Please fill in all required fields' 
        });
      }
  
      if (!familyMembers || familyMembers.length === 0) {
        return res.status(400).json({ 
          error: 'Please add at least one family member' 
        });
      }
  
      if (!selectedBanks || selectedBanks.length === 0) {
        return res.status(400).json({ 
          error: 'Please select at least one bank' 
        });
      }
  
      const application = new Application(req.body);
      await application.save();
  
      res.status(201).json({
        message: 'Application submitted successfully',
        applicationId: application._id
      });
      
    } catch (error) {
      console.error('Error saving application:', error);
      res.status(500).json({ 
        error: 'An error occurred while saving your application. Please try again.' 
      });
    }
  });

app.get('/api/applications/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});