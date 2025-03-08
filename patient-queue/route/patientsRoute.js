const express = require('express');
const router = express.Router();
const {
    checkInPatient,
    getQueue,
    updatePatientStatus,
    removePatient
} = require('../controller/patientController');

// Define Routes
router.post('/check-in', checkInPatient); // Check-in a patient
router.get('/queue', getQueue); // Get queue
router.put('/update-status/:id', updatePatientStatus); // Update status
router.delete('/remove/:id', removePatient); // Remove patient

module.exports = router;
