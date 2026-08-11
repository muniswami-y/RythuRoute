const express = require('express');
const addressController = require('../controllers/addressController');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/role');

const router = express.Router();

router.use(authMiddleware);
router.use(requireRole('customer'));

router.post('/', addressController.createAddress);
router.get('/mine', addressController.getMyAddresses);
router.delete('/:id', addressController.deleteAddress);

module.exports = router;
