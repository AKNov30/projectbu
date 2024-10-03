// backend/controllers/authController.js

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const register = async (req, res) => {
  // ตรวจสอบความถูกต้องของข้อมูลที่ส่งมา
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstname, lastname, user_email, user_password, phone } = req.body;

  try {
    // ตรวจสอบว่ามีผู้ใช้ที่มีอีเมลนี้อยู่แล้วหรือไม่
    const existingUser = await User.findByEmail(user_email);
    if (existingUser) {
      return res.status(400).json({ message: 'อีเมลนี้ถูกใช้งานแล้ว' });
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(user_password, 10);

    // สร้างผู้ใช้ใหม่
    await User.create({
      user_email,
      user_password: hashedPassword,
      firstname,
      lastname,
      phone,
      user_role: 'member'
    });

    res.status(201).json({ message: 'สมัครสมาชิกสำเร็จ' });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก' });
  }
};

const login = async (req, res) => {
  // ตรวจสอบความถูกต้องของข้อมูลที่ส่งมา
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { user_email, user_password } = req.body;

  try {
    // ค้นหาผู้ใช้ตามอีเมล
    const user = await User.findByEmail(user_email);
    if (!user) {
      return res.status(400).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    // ตรวจสอบรหัสผ่าน
    const isMatch = await bcrypt.compare(user_password, user.user_password);
    if (!isMatch) {
      return res.status(400).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    // สร้าง JWT token
    const token = generateToken({ id: user.id, email: user.user_email, role: user.user_role });

    res.json({ token });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' });
  }
};

export { register, login };
