import express from 'express';
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  exportLeadsCsv,
} from '../controllers/leadController';
import { protect, admin } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { createLeadSchema, updateLeadSchema } from '../utils/validationSchemas';

const router = express.Router();

router.route('/').post(protect, validateRequest(createLeadSchema), createLead).get(protect, getLeads);
router.route('/export').get(protect, exportLeadsCsv);
router.route('/:id').get(protect, getLeadById).put(protect, validateRequest(updateLeadSchema), updateLead).delete(protect, admin, deleteLead);

export default router;
