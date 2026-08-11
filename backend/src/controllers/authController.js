const AuthService = require('../services/authService');
const User = require('../models/User');
const { success, error } = require('../utils/response');

exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body;
    
    if (!name || !email || !password || !phone) {
      return error(res, 'All fields are required', 400);
    }

    const result = await AuthService.register({ name, email, phone, password, role });
    return success(res, result, 'Registration successful', 201);
  } catch (err) {
    if (err.message === 'Email already registered') {
      return error(res, err.message, 400);
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return error(res, 'Email and password are required', 400);
    }

    const result = await AuthService.login(email, password);
    return success(res, result, 'Login successful');
  } catch (err) {
    if (err.message === 'Invalid email or password') {
      return error(res, err.message, 401);
    }
    next(err);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return error(res, 'User not found', 404);
    }
    return success(res, user);
  } catch (err) {
    next(err);
  }
};
