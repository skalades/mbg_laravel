const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
  async register(username, password, role) {
    // Password validation logic
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      throw new Error('Password must be at least 8 characters and contain both letters and numbers.');
    }

    const existingUser = await userRepository.findByUsername(username);
    if (existingUser) {
      throw new Error('Username already taken');
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    return await userRepository.create({
      username,
      passwordHash,
      role: role || 'NUTRITIONIST'
    });
  }

  async login(username, password) {
    const user = await userRepository.findByUsername(username);
    if (!user) {
      throw new Error('Invalid Username or Password');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error('Invalid Username or Password');
    }

    const accessToken = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'your_super_secret_key_here',
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET || 'your_refresh_secret_key_here',
      { expiresIn: '7d' }
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await userRepository.saveRefreshToken(user.id, refreshToken, expiresAt);

    return { user, accessToken, refreshToken };
  }

  async refreshToken(token) {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'your_refresh_secret_key_here');
    const dbToken = await userRepository.findRefreshToken(decoded.id, token);

    if (!dbToken) {
      throw new Error('Invalid or expired refresh token');
    }

    const user = await userRepository.findById(decoded.id);
    const newAccessToken = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'your_super_secret_key_here',
      { expiresIn: '15m' }
    );

    return newAccessToken;
  }

  async logout(token) {
    await userRepository.deleteRefreshToken(token);
  }
}

module.exports = new AuthService();
