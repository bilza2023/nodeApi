const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connections

const localConnection = mongoose.createConnection(process.env.LOCAL_MONGO_URI || "mongodb://admin:password@localhost:27017/localDb?authSource=admin", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Connection error handling

localConnection.on('error', (error) => {
    console.error('Local MongoDB connection error:', error);
});

``
localConnection.once('open', () => {
    console.log('Connected to Local MongoDB');
});

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
});

// Create models for both connections
const LocalUser = localConnection.model('User', userSchema);

app.get('/', (req, res) => res.status(200).json({ message: "Welcome to API" }));

// Routes for online database

app.get('/db', async (req, res) => {
    try {
        const users = await LocalUser.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Routes for local database
// Route to add a user to the local database

localConnection.once('open', async () => {
    console.log('Connected to Local MongoDB');

    // Insert sample data for testing
    try {
        const existingUser = await LocalUser.findOne({ email: "test@example.com" });
        if (!existingUser) {
            const sampleData = [
                { name: "Test User 1", email: "test1@example.com" },
                { name: "Test User 2", email: "test2@example.com" },
                { name: "Test User 3", email: "test3@example.com" }
            ];
            await LocalUser.insertMany(sampleData);
            console.log('Sample data inserted into Local MongoDB');
        } else {
            console.log('Sample data already exists in Local MongoDB');
        }
    } catch (error) {
        console.error('Error inserting sample data:', error.message);
    }
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});