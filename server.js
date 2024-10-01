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

// เชื่อมต่อกับฐานข้อมูล
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

app.use(bodyParser.json());

// Endpoint สำหรับการสมัครสมาชิก
app.post('/api/register', (req, res) => {
  const { firstname, lastname, user_email, user_password, phone } = req.body;

  // ปรับคำสั่ง SQL ให้ตรงกับชื่อคอลัมน์ในฐานข้อมูล และเพิ่ม user_role
  const sql = 'INSERT INTO users (user_email, user_password, firstname, lastname, phone, user_role) VALUES (?, ?, ?, ?, ?, ?)';
  
  // ส่งข้อมูลไปยังฐานข้อมูล รวมถึง user_role ที่มีค่าเป็น 'member'
  db.query(sql, [user_email, user_password, firstname, lastname, phone, 'member'], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error registering user');
    }
    res.status(201).send('User registered successfully');
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
