import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database path
const dataDir = path.join(__dirname, '..', 'data');
const dbPath = path.join(dataDir, 'database.sqlite');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: console.log,
});

// Test the connection
const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQLite database connection established successfully.');
    
    // Sync all models with database
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized.');
    
    // Initialize temporary admin user
    await initializeAdminUser();
    
    return sequelize;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
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
      
      console.log('Temporary admin user created:');
      console.log('Email: admin@paperfly.com');
      console.log('Password: admin123');
      console.log('IMPORTANT: Change these credentials in production!');
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
