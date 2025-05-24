import User from './User.js';
import NewsPaper from './NewsPaper.js';
import Bill from './Bill.js';
import DailyRecieve from './DailyRecieve.js';

// Export all models
export {
    User,
    NewsPaper,
    Bill,
    DailyRecieve,
};

// Export a function to initialize all models
export const initModels = async () => {
    // Import sequelize instance
    const { sequelize } = await import('../config/database.js');
    
    // Define relationships between models
    Bill.hasMany(DailyRecieve, { foreignKey: 'bill_id', as: 'dailyReceive' });
    DailyRecieve.belongsTo(Bill, { foreignKey: 'bill_id', as: 'bill' });
    
    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');
};
