const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Move connection logic into an async function
async function connectToDatabase() {
    try {
        const localConnection = await mongoose.connect(
            process.env.LOCAL_MONGO_URI || "mongodb://admin:password@mongodb:27017/localDb?authSource=admin",
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );
        console.log('Connected to MongoDB');
        
        // Move sample data insertion here
        const existingUser = await LocalUser.findOne({ email: "test@example.com" });
        if (!existingUser) {
            const sampleData = [
                { name: "Test User 1", email: "test1@example.com" },
                { name: "Test User 2", email: "test2@example.com" },
                { name: "Test User 3", email: "test3@example.com" }
            ];
            await LocalUser.insertMany(sampleData);
            console.log('Sample data inserted');
        }
    } catch (error) {
        console.error('MongoDB connection error:', error);
        // Don't exit - let the app keep running and retry connection
    }
}

// Rest of your code (schemas, routes, etc.)

// Modified server startup
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await connectToDatabase();
});