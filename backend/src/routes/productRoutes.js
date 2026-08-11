const express = require('express');
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/role');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductDetails);

// Farmer routes (Protected)
router.use(authMiddleware);
router.use(requireRole('farmer'));

router.get('/farmer/mine', productController.getFarmerProducts);
router.post('/', upload.single('image'), productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
