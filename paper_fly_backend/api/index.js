import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import serverless from 'serverless-http';
import { getDatabase } from '../config/database.js';
import { initModels } from '../models/index.js';
import indexRoutes from '../routes/index.js';
import authRoutes from '../routes/authRoutes.js';
import newspaperRoutes from '../routes/newspaperRoutes.js';
import dailyRecieves from '../routes/dailyRecieves.js';
import billRoutes from '../routes/billRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', indexRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/newspapers', newspaperRoutes);
app.use('/api/dailyReceives', dailyRecieves);
app.use('/api/bills', billRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Paper Fly API with Sequelize support' });
});

// Initialize database and models before exporting handler
let isInitialized = false;
const initialize = async () => {
  if (!isInitialized) {
    try {
      await getDatabase();
      await initModels();
      isInitialized = true;
    } catch (err) {
      console.error('DB Init Error:', err);
      throw err;
    }
  }
};


const handler = async (event, context) => {
  await initialize();
  return serverless(app)(event, context);
};

export default handler;
