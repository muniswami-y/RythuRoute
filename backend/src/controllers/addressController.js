const Address = require('../models/Address');
const { success, error } = require('../utils/response');

exports.createAddress = async (req, res, next) => {
  try {
    const { recipient_name, phone, address, city, state, pincode, latitude, longitude } = req.body;
    
    if (!recipient_name || !phone || !address || !city || !state || !pincode) {
      return error(res, 'All address fields are required', 400);
    }

    const addressId = await Address.create({
      customer_id: req.user.id,
      recipient_name, phone, address, city, state, pincode, latitude, longitude
    });

    return success(res, { addressId }, 'Address created successfully', 201);
  } catch (err) {
    next(err);
  }
};

exports.getMyAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.findByCustomer(req.user.id);
    return success(res, addresses);
  } catch (err) {
    next(err);
  }
};

exports.deleteAddress = async (req, res, next) => {
  try {
    const deleted = await Address.delete(req.params.id, req.user.id);
    if (!deleted) {
      return error(res, 'Address not found or unauthorized', 404);
    }
    return success(res, null, 'Address deleted successfully');
  } catch (err) {
    next(err);
  }
};
