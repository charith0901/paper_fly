import { Bill, DailyRecieve } from '../models/index.js';
import { createDailyRecieve } from './dailyRecieveController.js';
import { getAllStocksByDailyRecieveId } from './stockController.js';

export const createBill = async (req, res) => {
    try {
        const { startDate, profitRate } = req.body;
        console.log('Creating bill with data:', startDate, profitRate);
        if (!startDate || !profitRate) {
            return res.status(400).json({ message: 'Please provide startDate, amount, and profitRate' });
        }
        const endDate = new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 7));
        const bill = await Bill.create({
            startDate,
            endDate,
            profitRate,
            initialCost: 0,
            unsoldCost: 0,
            soldCost:0,
            profit:0,
            payment:0,
            status: 'ongoing'
        });
        [1, 2, 3, 4, 5, 6, 7].forEach(async (day) => {
            await createDailyRecieve({
                body: {
                    date: new Date(new Date(startDate).setDate(new Date(startDate).getDate() + day)),
                    newspaperCopies: [],
                    bill_id: bill.id
                }
            });
        });
        res.status(201).json(bill);
    } catch (error) {
        console.error('Error creating bill:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const getAllBills = async (req, res) => {
    try {
        const bills = await Bill.findAll();
        res.json(bills);
    } catch (error) {
        console.error('Error fetching bills:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getBillById = async (req, res) => {
    try {
        const { id } = req.params;
        const bill = await Bill.findByPk(id);
        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }
        res.json(bill);
    } catch (error) {
        console.error('Error fetching bill:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateBill = async (req, res) => {
    try {
        const { id } = req.params;
        const { startDate, endDate, profitRate, totalIncome, totalExpense } = req.body;

        const bill = await Bill.findByPk(id);
        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }

        // Update bill fields
        bill.startDate = startDate || bill.startDate;
        bill.endDate = endDate || bill.endDate;
        bill.profitRate = profitRate || bill.profitRate;

        await bill.save();
        res.json(bill);
    } catch (error) {
        console.error('Error updating bill:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
export const calculateBillTotalsAndUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const bill = await Bill.findByPk(id);
        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }
        const dailyReceives = await DailyRecieve.findAll({ where: { bill_id: id } });
        if (!dailyReceives || dailyReceives.length === 0) {
            return res.status(404).json({ message: 'No daily receives found for this bill' });
        }
        let initialCost = 0;
        let unsoldCost = 0;
        let soldCost = 0;
        let profit = 0;
        let payment = 0;

        for (const dailyReceive of dailyReceives) {
            const stocks = await getAllStocksByDailyRecieveId(dailyReceive.id);
            for (let stock of stocks) {
                stock = stock.dataValues;
                console.log(stock)
                initialCost += stock.initialCopies * stock.newspaper_price;
                unsoldCost += (stock.initialCopies - stock.soldCopies) * stock.newspaper_price;
            }
        }
        soldCost = initialCost - unsoldCost;
        profit = soldCost * (bill.profitRate / 100);
        payment = soldCost - profit;

        console.log(initialCost +' '+soldCost+' '+profit+' '+payment+' '+unsoldCost+' ')

        bill.initialCost = initialCost;
        bill.unsoldCost = unsoldCost;
        bill.soldCost = soldCost;
        bill.profit = profit;
        bill.payment = payment;
        bill.status = 'bill_calculated';

        await bill.save();
        res.json(bill);

    } catch (error) {
        console.error('Error calculating bill totals:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteBill = async (req, res) => {
    try {
        const { id } = req.params;
        const bill = await Bill.findByPk(id);
        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }
        await bill.destroy();
        res.json({ message: 'Bill deleted successfully' });
    } catch (error) {
        console.error('Error deleting bill:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
