const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/role');

const router = express.Router();

router.use(authMiddleware);

// Farmer routes
router.get('/farmer', requireRole('farmer'), orderController.getFarmerOrders);

// Customer routes
router.post('/', requireRole('customer'), orderController.createOrder);
router.get('/mine', requireRole('customer'), orderController.getMyOrders);
router.get('/:id', requireRole('customer'), orderController.getOrderDetails);

module.exports = router;
