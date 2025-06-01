import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getDatabase } from './config/database.js';
import { initModels } from './models/index.js';
import indexRoutes from './routes/index.js';
import authRoutes from './routes/authRoutes.js';
import newspaperRoutes from './routes/newspaperRoutes.js';
import dailyRecieves from './routes/dailyRecieves.js';
import billRoutes from './routes/billRoutes.js';
import serverless from 'serverless-http';
dotenv.config();

const app = express();
let isInitialized = false;

const initializeApp = async () => {
  if (!isInitialized) {
    await getDatabase();
    await initModels();
    isInitialized = true;
  }
};

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

// Wrap in serverless function
const handler = async (req, res) => {
  await initializeApp();
  return serverless(app)(req, res);
};

export { handler };
