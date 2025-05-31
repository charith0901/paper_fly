import express from 'express';
import {
    getAllBills,
    getBillById,
    createBill,
    updateBill,
    deleteBill,
    calculateBillTotalsAndUpdate
} from '../controllers/billController.js';

const router = express.Router();

router.get('/', getAllBills);
router.get('/:id', getBillById);
router.post('/', createBill);
router.put('/:id', updateBill);
router.put('/:id/calculate',calculateBillTotalsAndUpdate)
router.delete('/:id', deleteBill);

export default router;
