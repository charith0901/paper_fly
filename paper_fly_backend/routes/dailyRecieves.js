import express from 'express';
import { 
  getAllDailyRecievesByBillId, 
  createDailyRecieve, 
  updateDailyRecieve, 
  deleteDailyRecieve,
  getDailyRecieveById 
} from '../controllers/dailyRecieveController.js';

const router = express.Router();

router.get('/:id', getDailyRecieveById);
router.get('/bill/:bill_id', getAllDailyRecievesByBillId);
router.post('/', createDailyRecieve);
router.put('/:id', updateDailyRecieve);
router.delete('/:id', deleteDailyRecieve);

export default router;