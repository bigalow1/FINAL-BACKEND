import jwt from 'jsonwebtoken';
import user from '../models/user.js';   


exports.authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await user.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};


exports.authorizeRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    next();
  };
};
