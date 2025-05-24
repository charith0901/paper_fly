import User from './User.js';
import NewsPaper from './NewsPaper.js';

// Define model associations here
// Example: User.hasMany(Post);

// Export all models
export {
    User,
    NewsPaper,
};

// Export a function to initialize all models
export const initModels = async () => {
    // Import sequelize instance
    const { sequelize } = await import('../config/database.js');

    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');
};
