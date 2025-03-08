const Patient = require('../models/Patients');

// 1️⃣ Check-in a new patient
exports.checkInPatient = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: "Name is required" });

        const newPatient = new Patient({ name });
        await newPatient.save();

        req.io.emit('queueUpdated'); // Notify all clients via WebSocket
        res.status(201).json({ message: 'Check-in successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// 2️⃣ Get current queue
exports.getQueue = async (req, res) => {
    try {
        const queue = await Patient.find({ status: 'waiting' }).sort('checkInTime');
        res.status(200).json(queue);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// 3️⃣ Update patient status
exports.updatePatientStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        const patient = await Patient.findByIdAndUpdate(id, { status }, { new: true });
        if (!patient) return res.status(404).json({ message: "Patient not found" });

        req.io.emit('queueUpdated'); // Notify all clients
        res.status(200).json({ message: 'Status updated', patient });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// 4️⃣ Remove a patient
exports.removePatient = async (req, res) => {
    try {
        const { id } = req.params;

        const patient = await Patient.findByIdAndDelete(id);
        if (!patient) return res.status(404).json({ message: "Patient not found" });

        req.io.emit('queueUpdated'); // Notify all clients
        res.status(200).json({ message: 'Patient removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};
