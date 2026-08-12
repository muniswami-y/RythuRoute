const Product = require('../models/Product');
const { success, error } = require('../utils/response');

// --- PUBLIC APIs ---

exports.getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    const filters = {
      category: req.query.category,
      search: req.query.search
    };

    const result = await Product.findAll(filters, limit, offset);
    
    return success(res, {
      products: result.products,
      pagination: {
        total: result.total,
        page,
        limit,
        totalPages: Math.ceil(result.total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getProductDetails = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return error(res, 'Product not found', 404);
    
    return success(res, product);
  } catch (err) {
    next(err);
  }
};


// --- FARMER APIs ---

exports.createProduct = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const currentUser = await User.findById(req.user.id);
    
    // Admins can always add products; Farmers can add products if approved or default
    if (req.user.role !== 'admin' && currentUser && currentUser.approval_status === 'rejected') {
      return error(res, 'Your farmer account has been rejected', 403);
    }

    const { name, description, category, price, unit, quantity_available } = req.body;
    let image_url = req.body.image_url || null;
    
    if (req.file) {
      image_url = `/uploads/products/${req.file.filename}`;
    }

    if (!name || !price || !unit || !quantity_available) {
      return error(res, 'Missing required fields', 400);
    }

    const productId = await Product.create({
      farmer_id: req.user.id,
      name, description, category, price, unit, quantity_available, image_url
    });

    return success(res, { productId }, 'Product created successfully', 201);
  } catch (err) {
    next(err);
  }
};

exports.getFarmerProducts = async (req, res, next) => {
  try {
    const products = await Product.findByFarmerId(req.user.id);
    return success(res, products);
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const updated = await Product.update(req.params.id, req.user.id, req.body);
    if (!updated) {
      return error(res, 'Product not found or you are not authorized to update it', 404);
    }
    return success(res, null, 'Product updated successfully');
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const deleted = await Product.delete(req.params.id, req.user.id);
    if (!deleted) {
      return error(res, 'Product not found or you are not authorized to delete it', 404);
    }
    return success(res, null, 'Product deactivated successfully');
  } catch (err) {
    next(err);
  }
};
