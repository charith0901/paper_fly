import { DailyRecieve, NewsPaper } from '../models/index.js';
import { createStock,getAllStocksByDailyRecieveId } from './stockController.js';

// Create a new daily receive record
export const createDailyRecieve = async (req) => {
  try {
    const { date, newspaperCopies } = req.body;

    // Validate input
    if (!date || !newspaperCopies || !Array.isArray(newspaperCopies)) {
      console.error('Invalid input data');
    }

    // Verify newspaper IDs exist
    const newspaperIds = newspaperCopies.map(item => item.newspaper_id);
    const newspapers = await NewsPaper.findAll({
      where: { id: newspaperIds }
    });
    if (newspapers.length !== newspaperIds.length) {
      throw new Error('One or more newspaper IDs are invalid');
    }

    // Create daily receive record
    const dailyRecieve = await DailyRecieve.create({
      date,
      bill_id: req.body.bill_id || null
    });
    newspaperCopies.forEach(async (newspaper) => {
      await createStock({
        body: {
          newspaperId: newspaper.newspaper_id,
          initialCopies: newspaper.initialCopies || 0,
          soldCopies: 0,
          dailyRecieveId: dailyRecieve.id
        }
      });
    });

    return dailyRecieve;
  } catch (error) {
    console.error('Error creating daily receive record:', error);
  }
};

// Get all daily receive records
export const getAllDailyRecievesByBillId = async (req, res) => {
  try {
    const { bill_id } = req.params;
    console.log(bill_id)
    const dailyRecieves = await DailyRecieve.findAll({
      where: { bill_id },
      order: [['date', 'ASC']]
    });

    const dailyRecievesWithNewspapers = await Promise.all(
      dailyRecieves.map(async (dailyRecieve) => {
        const newspapers = await getAllStocksByDailyRecieveId(dailyRecieve.id);
        return {
          ...dailyRecieve.toJSON(),
          newspapers
        };
      })
    );
    res.status(200).json(dailyRecievesWithNewspapers);
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
    const newspapersStock = await getAllStocksByDailyRecieveId(dailyRecieve.id);

    res.json({
      ...dailyRecieve.toJSON(),
      newspapersStock
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
    const { date, newspapersStock } = req.body;

    const dailyRecieve = await DailyRecieve.findByPk(id);

    if (!dailyRecieve) {
      return res.status(404).json({ message: 'Daily receive record not found' });
    }

    // If updating newspaperCopies, verify newspaper IDs exist
    if (newspapersStock && Array.isArray(newspapersStock)) {
      const newspaperIds = newspapersStock.map(item => item.newspaper_id);
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
      bill_id: req.body.bill_id !== undefined ? req.body.bill_id : dailyRecieve.bill_id
    });
    // Update newspapers stock
    if (newspapersStock && Array.isArray(newspapersStock)) {
      // Delete existing stocks
      const existingStocks = await getAllStocksByDailyRecieveId(dailyRecieve.id);
      for (const stock of existingStocks) {
        await stock.destroy();
      }

      // Create new stocks
      for (const newspaper of newspapersStock) {
        await createStock({
          body: {
            newspaperId: newspaper.newspaper_id,
            initialCopies: newspaper.initialCopies || 0,
            soldCopies: newspaper.soldCopies || 0,
            dailyRecieveId: dailyRecieve.id
          }
        });
      }
    }

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
