import express from 'express';
import userRoutes from './routes/userRoutes.js';
import dotenv from 'dotenv';

// Initializing dotenv to read environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming requests with JSON payloads
app.use(express.json());

// Using user routes for handling CRUD operations
app.use('/api', userRoutes);

// Starting the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
