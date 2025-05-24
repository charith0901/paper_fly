import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getDatabase } from './config/database.js';
import { initModels } from './models/index.js';
import indexRoutes from './routes/index.js';
import authRoutes from './routes/authRoutes.js';
import newspaperRoutes from './routes/newspaperRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize database and models
const startServer = async () => {
  try {
    await getDatabase();
    await initModels();

    // Middleware
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Routes
    app.use('/api', indexRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/newspapers', newspaperRoutes);

    // Default route
    app.get('/', (req, res) => {
      res.json({ message: 'Welcome to Paper Fly API with Sequelize support' });
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
