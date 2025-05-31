import Stock from '../models/Stock.js';
import { getNewspaperById } from './newspaperController.js';

// Create a new stock entry
export const createStock = async (req) => {
    try {
        const { newspaperId, initialCopies, soldCopies, dailyRecieveId } = req.body;

        const newStock = await Stock.create({
            newspaperId,
            initialCopies,
            soldCopies,
            dailyRecieveId
        });

        return newStock;
    } catch (error) {
        console.error(error);
        return null;
    }
};

// Get all stock entries
export const getAllStocksByDailyRecieveId = async (dailyRecieveId) => {
    try {
        const stocks = await Stock.findAll({
            where: {
                dailyRecieveId:dailyRecieveId
            }
        });
        //with newspaper details
        for (const stock of stocks) {
            const newspaper = await getNewspaperById(stock.newspaperId);
            stock.dataValues.newspaper_name = newspaper ? newspaper.newspaper_name : 'Unknown Newspaper';
            stock.dataValues.newspaper_price = newspaper ? newspaper.price : 0;
        }

        if (!stocks) {
            console.error('No stock entries found');
            return null;
        }

        return stocks;
    } catch (error) {
        console.error(error);
        return null;
    }
};

// Get a single stock entry by ID
export const getStockById = async (req) => {
    try {
        const { id } = req.params;

        const stock = await Stock.findByPk(id);

        if (!stock) {
            console.error('Stock entry not found');
            return null
        }

        return stock;
    } catch (error) {
        console.error(error);
        return null;
    }
};

// Update a stock entry by ID
export const updateStock = async (req) => {
    try {
        const { id } = req.params;
        const { newspaperId, initialCopies, soldCopies } = req.body;

        const stock = await Stock.findByPk(id);

        if (!stock) {
            console.error('Stock entry not found');
            return null;
        }

        await stock.update({
            newspaperId,
            initialCopies,
            soldCopies,
            dailyRecieveId: stock.dailyRecieveId
        });

        return stock;
    } catch (error) {
        console.error(error);
        return null;
    }
};

// Delete a stock entry by ID
export const deleteStock = async (req) => {
    try {
        const { id } = req.params;

        const stock = await Stock.findByPk(id);

        if (!stock) {
            console.error('Stock entry not found');
            return null;
        }

        await stock.destroy();

        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
};
