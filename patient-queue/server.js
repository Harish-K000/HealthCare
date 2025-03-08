console.log("Server is starting...");

// Import required modules
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();


console.log("Dependencies loaded");

// Initialize Express app and server
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
    }
});

console.log("Express server initialized");

// Connect to MongoDB
connectDB()
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB Connection Error:", err));

// Middleware
app.use(cors());
app.use(bodyParser.json());

console.log("Middleware applied");

// Routes
app.use('/api/patients', require('./route/patientsRoute'));
app.use('/api/queue', require('./route/QueueRoutes'));

console.log("Routes loaded");

// WebSocket Connection
io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => console.log(' Client disconnected'));
});

// Start Server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


