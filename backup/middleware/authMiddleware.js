// backend/middleware/authMiddleware.js

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No Token Provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // เพิ่มข้อมูลผู้ใช้ใน request object
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};

export default authMiddleware;
