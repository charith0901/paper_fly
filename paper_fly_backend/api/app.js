// api/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getDatabase } from '../config/database.js';
import { initModels } from '../models/index.js';
import indexRoutes from '../routes/index.js';
import authRoutes from '../routes/authRoutes.js';
import newspaperRoutes from '../routes/newspaperRoutes.js';
import dailyRecieves from '../routes/dailyRecieves.js';
import billRoutes from '../routes/billRoutes.js';

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

const PORT = process.env.PORT || 3000;

// Start server after DB is ready
const startServer = async () => {
  try {
    await getDatabase();
    await initModels();
  } catch (err) {
    console.error('❌ DB Init Error:', err);
  }
};

// Start the server
startServer().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Failed to start server:', err);
});

export default app;
