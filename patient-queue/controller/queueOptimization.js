// Dynamic Queue Optimization System with Patient Notification (Node.js + AI + Twilio)

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const axios = require('axios');
const twilio = require('twilio');
const sendNotification = require('../services/twilioService');
const Patient = require('../models/Patients');

require('dotenv').config();

// Twilio Configuration
const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const TWILIO_PHONE = process.env.TWILIO_PHONE;

// Patient Schema with Severity and Estimated Time
const PatientSchema = new mongoose.Schema({
    name: String,
    phone: String, // Added for notifications
    severity: Number, // 1 (Low) to 5 (High)
    doctorAssigned: String,
    estimatedTime: Number, // Predicted by AI in minutes
    status: { type: String, default: 'waiting' }, // waiting, in-progress, completed
    checkInTime: { type: Date, default: Date.now }
});
//const Patient = mongoose.model('Patient', PatientSchema);

// Doctor Schema to Track Availability
const DoctorSchema = new mongoose.Schema({
    name: String,
    available: Boolean,
    ongoingCases: Number, // Number of active patients
    avgTimePerCase: Number // AI-predicted time per case
});
const Doctor = mongoose.model('Doctor', DoctorSchema);


// Function to Optimize Queue and Notify Patients
const optimizeQueue = async () => {
    try {
        const patients = await Patient.find({ status: 'waiting' }).sort('-severity checkInTime');
        const doctors = await Doctor.find({ available: true }).sort('ongoingCases');

        for (let patient of patients) {
            if (doctors.length > 0) {
                let doctor = doctors[0]; // Assign to the least busy doctor
                
                // Predict Estimated Time using AI API
                const response = await axios.post('http://localhost:5001/predict', {
                    num_patients: doctor.ongoingCases + 1
                });
                patient.estimatedTime = response.data.predicted_wait_time;
                patient.doctorAssigned = doctor.name;
                patient.status = 'in-progress';
                await patient.save();

                // Update Doctor Load
                doctor.ongoingCases += 1;
                if (doctor.ongoingCases >= 3) doctor.available = false; // Example limit
                await doctor.save();

                // Send Notification to Patient
                if (patient.phone) {
                    sendNotification(patient.phone, `Hello ${patient.name}, you have been assigned to Dr. ${doctor.name}. Your estimated wait time is ${patient.estimatedTime} minutes.`);
                }
            }
        }
    } catch (error) {
        console.error('Queue Optimization Error:', error);
    }
};

// Run Queue Optimization Every Minute
setInterval(optimizeQueue, 60000);

console.log('Router starting');
// Get Current Optimized Queue
router.get('/queue', async (req, res) => {
    try {
        const queue = await Patient.find().sort('-severity checkInTime');
        res.status(200).json(queue);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});
console.log('Router End');
module.exports = router;
