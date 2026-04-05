const authService = require('../services/authService');
const userRepository = require('../repositories/userRepository');

exports.register = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const userId = await authService.register(username, password, role);
    res.status(201).json({ message: 'User registered successfully', userId });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const { user, accessToken, refreshToken } = await authService.login(username, password);

    // Set HTTP-Only Cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      domain: process.env.COOKIE_DOMAIN || '.skalades.biz.id',
      maxAge: 15 * 60 * 1000
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      domain: process.env.COOKIE_DOMAIN || '.skalades.biz.id',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: 'Login successful',
      user: { id: user.id, username: user.username, role: user.role, kitchen_id: user.kitchen_id }
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.refresh = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: 'No refresh token provided' });

  try {
    const newAccessToken = await authService.refreshToken(refreshToken);
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      domain: process.env.COOKIE_DOMAIN || '.skalades.biz.id',
      maxAge: 15 * 60 * 1000
    });
    res.json({ message: 'Token refreshed' });
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

exports.logout = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  try {
    if (refreshToken) await authService.logout(refreshToken);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await userRepository.findByUsername(req.user.username);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      title: user.title,
      role: user.role,
      kitchen_id: user.kitchen_id
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
};
