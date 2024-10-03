// backend/routes/auth.js

import express from 'express';
import { register, login } from '../controllers/authController.js';
import { body } from 'express-validator';

const router = express.Router();

// Route สำหรับการสมัครสมาชิก
router.post(
  '/register',
  [
    body('firstname').notEmpty().withMessage('ชื่อไม่ควรเว้นว่าง'),
    body('lastname').notEmpty().withMessage('นามสกุลไม่ควรเว้นว่าง'),
    body('user_email').isEmail().withMessage('อีเมลไม่ถูกต้อง'),
    body('user_password')
      .isLength({ min: 6 })
      .withMessage('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
    body('phone').isMobilePhone().withMessage('เบอร์โทรศัพท์ไม่ถูกต้อง'),
  ],
  register
);

// Route สำหรับการเข้าสู่ระบบ
router.post(
  '/login',
  [
    body('user_email').isEmail().withMessage('อีเมลไม่ถูกต้อง'),
    body('user_password').notEmpty().withMessage('รหัสผ่านไม่ควรเว้นว่าง'),
  ],
  login
);

export default router;