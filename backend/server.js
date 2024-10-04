// src/server.js

import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'; 
import cors from 'cors';
import bcrypt from 'bcrypt';
import multer from 'multer';

dotenv.config();

const app = express();
const port = 5000;

app.use(express.json());
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
    const { user_id, user_role, firstname } = user; // ดึง user_id, user_role, firstname จากผลลัพธ์
    const token = 'your_generated_jwt_token'; // สร้าง JWT token ที่นี่ (คุณสามารถใช้ jwt.sign() เพื่อสร้าง token)

    res.status(200).json({
      token,
      message: 'เข้าสู่ระบบสำเร็จ',
      user_id,
      firstname, 
      user_role
    });
  } catch (error) {
    console.error('Error comparing password:', error);
    res.status(500).send('Error logging in');
  }
  });
});

//ListUser
// ดึงรายข้อมูล user มาแสดง
app.get('/api/users', (req, res) => {
  const sql = 'SELECT user_id, firstname, lastname, user_role FROM users';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).send('Error fetching users');
    }
    
    res.status(200).json(results);
  });
});

// ดึงข้อมูลผู้ใช้ตาม user_id 
app.get('/api/users/:user_id', (req, res) => {
  const { user_id } = req.params;
  const sql = 'SELECT firstname, lastname, user_email, phone FROM users WHERE user_id = ?';

  db.query(sql, [user_id], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).send('Error fetching user');
    }

    if (results.length === 0) {
      return res.status(404).send('User not found');
    }

    res.status(200).json(results[0]);
  });
});


// Endpoint สำหรับแก้ไขข้อมูล user
app.put('/api/users/:user_id', (req, res) => {
  const { user_id } = req.params;
  const { firstname, lastname, user_email, phone } = req.body;

  // ตรวจสอบว่าผู้ใช้มีอยู่ในฐานข้อมูลหรือไม่
  const checkUserSql = 'SELECT * FROM users WHERE user_id = ?';
  db.query(checkUserSql, [user_id], (err, results) => {
    if (err) {
      console.error('Error checking user:', err);
      return res.status(500).send('Error checking user');
    }

    // ถ้าไม่มีผู้ใช้นี้ในฐานข้อมูล
    if (results.length === 0) {
      return res.status(404).send('ไม่พบผู้ใช้งาน');
    }

    // อัปเดตข้อมูลผู้ใช้
    const updateSql = 'UPDATE users SET firstname = ?, lastname = ?, user_email = ?, phone = ? WHERE user_id = ?';
    db.query(updateSql, [firstname, lastname, user_email, phone, user_id], (err, result) => {
      if (err) {
        console.error('Error updating user:', err);
        return res.status(500).send('Error updating user');
      }
      res.status(200).send('ข้อมูลผู้ใช้ถูกอัปเดตเรียบร้อยแล้ว');
    });
  });
});


//addDog
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    return cb(null, "./public/images")
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`)
  },
})

const upload = multer({ storage })

app.post('/api/adddog',upload.array('files'), (req, res) => {
  // Check if the file was uploaded
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No file uploaded');
  }
  const { dogs_name, birthday, price, color, description, personality } = req.body;

  const sql = 'INSERT INTO dogs (`dogs_name`, `birthday`, `price`, `color`, `description`, `personality`, `image_url`) VALUES (?)';

  const fileNames = req.files.map(file => file.filename);

  const values = [
    dogs_name,
    birthday, 
    price, 
    color, 
    description, 
    personality,
    JSON.stringify(fileNames),
  ]

  db.query(sql, [values], (err, result) => {
    if (err) return res.status(500).send('Error inserting dog: ' + err.message);
    res.status(201).send('Dog added successfully');
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
