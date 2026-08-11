const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/environment');

class AuthService {
  static async register(userData) {
    const existingUser = await User.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const approval_status = userData.role === 'farmer' ? 'pending' : 'approved';
    const userId = await User.create({ ...userData, password: hashedPassword, approval_status });
    
    const user = await User.findById(userId);
    const token = this.generateToken(user);
    
    return { user, token };
  }

  static async login(email, password) {
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const userProfile = await User.findById(user.id);
    const token = this.generateToken(userProfile);
    
    return { user: userProfile, token };
  }

  static generateToken(user) {
    return jwt.sign(
      { id: user.id, role: user.role },
      env.jwt.secret,
      { expiresIn: env.jwt.expiresIn }
    );
  }
}

module.exports = AuthService;
