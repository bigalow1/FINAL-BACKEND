import express from 'express';

const router = express.Router();
const AdminController = require('../controllers/AdminController');
const { authenticate, authorizeRole } = require('../middlewares/authMiddlewares');

// Get all unapproved vendors
router.get('/vendors/pending', authenticate, authorizeRole('Admin'), AdminController.getPendingVendors);

// Approve a vendor
router.patch('/vendors/:vendorId/approve', authenticate, authorizeRole('Admin'), AdminController.approveVendor);

module.exports = router;
