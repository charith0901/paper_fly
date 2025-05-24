import { DailyRecieve, NewsPaper } from '../models/index.js';
import { sequelize } from '../config/database.js';

// Create a new daily receive record
export const createDailyRecieve = async (req, res) => {
  try {
    const { date, newspaperCopies } = req.body;

    // Validate input
    if (!date || !newspaperCopies || !Array.isArray(newspaperCopies)) {
      return res.status(400).json({ 
        message: 'Please provide date and newspaperCopies array' 
      });
    }

    // Verify newspaper IDs exist
    const newspaperIds = newspaperCopies.map(item => item.newspaper_id);
    const newspapers = await NewsPaper.findAll({
      where: { id: newspaperIds }
    });

    if (newspapers.length !== newspaperIds.length) {
      return res.status(400).json({
        message: 'One or more newspaper IDs are invalid'
      });
    }

    // Create daily receive record
    const dailyRecieve = await DailyRecieve.create({
      date,
      newspaperCopies,
      bill_id: req.body.bill_id || null
    });

    res.status(201).json(dailyRecieve);
  } catch (error) {
    console.error('Error creating daily receive record:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all daily receive records
export const getAllDailyRecieves = async (req, res) => {
  try {
    const dailyRecieves = await DailyRecieve.findAll();
    res.json(dailyRecieves);
  } catch (error) {
    console.error('Error fetching daily receive records:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific daily receive record by ID
export const getDailyRecieveById = async (req, res) => {
  try {
    const { id } = req.params;
    const dailyRecieve = await DailyRecieve.findByPk(id);
    
    if (!dailyRecieve) {
      return res.status(404).json({ message: 'Daily receive record not found' });
    }
    
    // Get associated newspapers
    const newspapers = await dailyRecieve.getNewspapers();
    
    res.json({
      ...dailyRecieve.toJSON(),
      newspapers
    });
  } catch (error) {
    console.error('Error fetching daily receive record:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a daily receive record
export const updateDailyRecieve = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, newspaperCopies } = req.body;
    
    const dailyRecieve = await DailyRecieve.findByPk(id);
    
    if (!dailyRecieve) {
      return res.status(404).json({ message: 'Daily receive record not found' });
    }
    
    // If updating newspaperCopies, verify newspaper IDs exist
    if (newspaperCopies && Array.isArray(newspaperCopies)) {
      const newspaperIds = newspaperCopies.map(item => item.newspaper_id);
      const newspapers = await NewsPaper.findAll({
        where: { id: newspaperIds }
      });
      
      if (newspapers.length !== newspaperIds.length) {
        return res.status(400).json({
          message: 'One or more newspaper IDs are invalid'
        });
      }
    }
    
    // Update record
    await dailyRecieve.update({
      date: date || dailyRecieve.date,
      newspaperCopies: newspaperCopies || dailyRecieve.newspaperCopies,
      bill_id: req.body.bill_id !== undefined ? req.body.bill_id : dailyRecieve.bill_id
    });
    
    res.json(dailyRecieve);
  } catch (error) {
    console.error('Error updating daily receive record:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a daily receive record
export const deleteDailyRecieve = async (req, res) => {
  try {
    const { id } = req.params;
    const dailyRecieve = await DailyRecieve.findByPk(id);
    
    if (!dailyRecieve) {
      return res.status(404).json({ message: 'Daily receive record not found' });
    }
    
    await dailyRecieve.destroy();
    
    res.json({ message: 'Daily receive record deleted successfully' });
  } catch (error) {
    console.error('Error deleting daily receive record:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
