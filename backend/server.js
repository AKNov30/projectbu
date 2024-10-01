// src/server.js

import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'; 
import cors from 'cors';
import bcrypt from 'bcrypt';

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// เชื่อมต่อกับฐานข้อมูล
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
  console.log('Connected to database');
});

// Endpoint สำหรับการสมัครสมาชิก
app.post('/api/register', async (req, res) => {
  const { firstname, lastname, user_email, user_password, phone } = req.body;

  // ตรวจสอบว่ามีผู้ใช้ที่มีอีเมลนี้อยู่แล้วหรือไม่
  db.query('SELECT * FROM users WHERE user_email = ?', [user_email], async (err, results) => {
    if (err) {
      console.error('Error checking existing user:', err);
      return res.status(500).send('Error checking existing user'); 
    }

    if (results.length > 0) {
      return res.status(400).send('อีเมลนี้ถูกใช้งานแล้ว');
    }

    try {
      // เข้ารหัสรหัสผ่าน
      const hashedPassword = await bcrypt.hash(user_password, 10);

      const sql = 'INSERT INTO users (user_email, user_password, firstname, lastname, phone, user_role) VALUES (?, ?, ?, ?, ?, ?)';

      db.query(sql, [user_email, hashedPassword, firstname, lastname, phone, 'member'], (err, result) => {
        if (err) {
          console.error('Error inserting user:', err);
          return res.status(500).send('Error inserting user: ' + err.message); 
        }
        res.status(201).send('User registered successfully');
      });
    } catch (error) {
      console.error('Error hashing password:', error);
      res.status(500).send('Error hashing password: ' + error.message); 
    }
  });
});

// Endpoint สำหรับการเข้าสู่ระบบ
app.post('/api/login', async (req, res) => {
  const { user_email, user_password } = req.body;

  // ตรวจสอบว่าผู้ใช้มีอยู่ในฐานข้อมูลหรือไม่
  db.query('SELECT * FROM users WHERE user_email = ?', [user_email], async (err, results) => {
    if (err) {
      console.error('Error checking user:', err);
      return res.status(500).send('Error checking user');
    }

    // ถ้าผู้ใช้ไม่มีในฐานข้อมูล
    if (results.length === 0) {
      return res.status(400).send('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }

    const user = results[0];

    try {
      // ตรวจสอบรหัสผ่านที่เข้ารหัส
      const match = await bcrypt.compare(user_password, user.user_password);
      if (!match) {
        return res.status(400).send('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      }

    // เข้าสู่ระบบสำเร็จ
    const { user_id, user_role } = user; // ดึง user_id และ user_role จากผลลัพธ์
    const token = 'your_generated_jwt_token'; // สร้าง JWT token ที่นี่ (คุณสามารถใช้ jwt.sign() เพื่อสร้าง token)

    res.status(200).json({
      token,
      message: 'เข้าสู่ระบบสำเร็จ',
      user_id: user.id, 
      user_role: user.user_role
    });
  } catch (error) {
    console.error('Error comparing password:', error);
    res.status(500).send('Error logging in');
  }
  });
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
