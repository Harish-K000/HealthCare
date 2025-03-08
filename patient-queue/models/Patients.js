const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    status: { type: String, default: 'waiting' },
    checkInTime: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Patient', PatientSchema);
