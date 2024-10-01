// src/server.js

import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'; // เพิ่มการนำเข้า dotenv
import cors from 'cors';
import bcrypt from 'bcrypt';

dotenv.config(); // โหลดตัวแปรสภาพแวดล้อมจากไฟล์ .env

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
    process.exit(1); // ออกจากโปรเซสหากเชื่อมต่อไม่สำเร็จ
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
      return res.status(500).send('Error registering user');
    }

    if (results.length > 0) {
      return res.status(400).send('อีเมลนี้ถูกใช้งานแล้ว');
    }

    try {
      // เข้ารหัสรหัสผ่าน
      const hashedPassword = await bcrypt.hash(user_password, 10);

      // ปรับคำสั่ง SQL ให้ตรงกับชื่อคอลัมน์ในฐานข้อมูล และเพิ่ม user_role
      const sql = 'INSERT INTO users (user_email, user_password, firstname, lastname, phone, user_role) VALUES (?, ?, ?, ?, ?, ?)';

      // ส่งข้อมูลไปยังฐานข้อมูล รวมถึง user_role ที่มีค่าเป็น 'member'
      db.query(sql, [user_email, hashedPassword, firstname, lastname, phone, 'member'], (err, result) => {
        if (err) {
          console.error('Error inserting user:', err);
          return res.status(500).send('Error registering user');
        }
        res.status(201).send('User registered successfully');
      });
    } catch (error) {
      console.error('Error hashing password:', error);
      res.status(500).send('Error registering user');
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
