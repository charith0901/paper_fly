import express from 'express';
import { 
  getAllNewspapers, 
  addNewspaper, 
  updateNewspaperPrice, 
  deleteNewspaper,
  getNewspaperByIdFunc 
} from '../controllers/newspaperController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllNewspapers);
router.get('/:id', getNewspaperByIdFunc);
// Protected routes
router.post('/', protect, addNewspaper);
router.patch('/:id', protect, updateNewspaperPrice);
router.delete('/:id', protect, admin, deleteNewspaper); // Only admins can delete

export default router;
