const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/role');

const router = express.Router();

router.use(authMiddleware);
router.use(requireRole('admin'));

router.get('/stats', adminController.getDashboardStats);
router.get('/farmers', adminController.getFarmers);
router.put('/farmers/:id/status', adminController.updateFarmerStatus);
router.get('/orders', adminController.getOrders);
router.get('/users', adminController.getUsers);
router.get('/products', adminController.getProducts);

module.exports = router;
