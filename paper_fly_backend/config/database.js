import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Database configuration
const DB_NAME = process.env.DB_NAME || 'paper_fly';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '1234';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;

// Create database if it doesn't exist
const createDbIfNotExists = async () => {
  // First connect without specifying database to create it if needed
  const tempSequelize = new Sequelize({
    dialect: 'mysql',
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASSWORD,
    logging: true,
  });

  try {
    await tempSequelize.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    console.log(`Ensured database '${DB_NAME}' exists.`);
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  } finally {
    await tempSequelize.close();
  }
};

// Initialize Sequelize with MySQL
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  logging: console.log,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false 
    }
  }
});

// Test the connection
const initDatabase = async () => {
  try {
    // Ensure database exists
    //await createDbIfNotExists();
    
    // Connect to database
    await sequelize.authenticate();
    console.log('MySQL database connection established successfully.');
    
    // Sync all models with database
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized.');
    
    // Initialize temporary admin user
    await initializeAdminUser();
    
    return sequelize;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

// Function to initialize admin user
const initializeAdminUser = async () => {
  try {
    // Import User model dynamically to avoid circular dependency
    const User = (await import('../models/User.js')).default;
    
    // Check if admin user exists
    const adminExists = await User.findOne({ 
      where: { email: 'admin@paperfly.com' } 
    });
    
    // If admin doesn't exist, create one
    if (!adminExists) {
      // Create admin user
      await User.create({
        username: 'admin',
        email: 'admin@paperfly.com',
        password: '1234',
        role: 'admin'
      });
    }
  } catch (error) {
    console.error('Error initializing admin user:', error);
  }
};

// Create a singleton database instance
let dbInstance = null;

export const getDatabase = async () => {
  if (!dbInstance) {
    dbInstance = await initDatabase();
  }
  return dbInstance;
};

export { sequelize };
export default { getDatabase, sequelize };
