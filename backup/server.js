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

// Endpoint สำหรับการชำระเงินผ่าน QR Code
app.post('/api/pay', async (req, res) => {
  const { user_id, dog_id, pickup_date, pickup_time } = req.body;

  // ตรวจสอบว่ากรอกข้อมูลครบถ้วน
  if (!user_id || !dog_id || !pickup_date || !pickup_time) {
    return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }

  // ตรวจสอบว่าผู้ใช้และสุนัขมีอยู่ในระบบ
  const userSql = 'SELECT * FROM users WHERE user_id = ?';
  const dogSql = 'SELECT * FROM dogs WHERE dog_id = ? AND status = "available"'; // ตรวจสอบว่าสุนัขว่างสำหรับการจอง

  pool.query(userSql, [user_id], (userErr, userResults) => {
    if (userErr) {
      console.error('Error fetching user:', userErr);
      return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้' });
    }

    if (userResults.length === 0) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้ในระบบ' });
    }

    pool.query(dogSql, [dog_id], (dogErr, dogResults) => {
      if (dogErr) {
        console.error('Error fetching dog:', dogErr);
        return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสุนัข' });
      }

      if (dogResults.length === 0) {
        return res.status(404).json({ message: 'ไม่พบสุนัขในระบบหรือสุนัขนี้ไม่ว่างสำหรับการจอง' });
      }

      const dogPrice = dogResults[0].price;
      const halfPrice = dogPrice / 2;

      const booking_date = new Date().toISOString().split('T')[0]; // วันที่ทำการจอง
      const status = 'pending';

      // สร้างการจองในฐานข้อมูล
      const insertBookingSql = 'INSERT INTO bookings (user_id, dog_id, booking_date, pickup_date, pickup_time, status) VALUES (?, ?, ?, ?, ?, ?)';
      pool.query(insertBookingSql, [user_id, dog_id, booking_date, pickup_date, pickup_time, status], (insertErr, insertResult) => {
        if (insertErr) {
          console.error('Error inserting booking:', insertErr);
          return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสร้างการจอง' });
        }

        const booking_id = insertResult.insertId;

        // ดึงหมายเลขโทรศัพท์ของผู้ใช้สำหรับสร้าง QR Code
        const userPhone = userResults[0].phone;

        if (!userPhone) {
          return res.status(400).json({ message: 'ไม่พบหมายเลขโทรศัพท์ของผู้ใช้สำหรับสร้าง QR Code' });
        }

        // สร้าง QR Code สำหรับ PromptPay ด้วยหมายเลขโทรศัพท์และจำนวนเงิน
        const paymentAmount = halfPrice;

        promptpayQR(userPhone, { amount: paymentAmount }, (qrErr, buffer) => {
          if (qrErr) {
            console.error('Error generating PromptPay QR Code:', qrErr);
            return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสร้าง QR Code' });
          }

          // บันทึก QR Code เป็นไฟล์ PNG
          const filename = `booking_${booking_id}.png`;
          const qrCodePath = path.join(__dirname, 'public/images', filename);

          fs.writeFile(qrCodePath, buffer, (writeErr) => {
            if (writeErr) {
              console.error('Error saving QR Code image:', writeErr);
              return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึก QR Code' });
            }

            const qrCodeURL = `/images/${filename}`;

            // เปลี่ยนสถานะสุนัขเป็น "booked"
            const updateDogStatusSql = 'UPDATE dogs SET status = ? WHERE dog_id = ?';
            pool.query(updateDogStatusSql, ['booked', dog_id], (updateErr, updateResult) => {
              if (updateErr) {
                console.error('Error updating dog status:', updateErr);
                return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตสถานะสุนัข' });
              }

              // ส่ง URL ของ QR Code กลับไปยัง Frontend พร้อมกับ booking_id และจำนวนเงิน
              return res.status(200).json({ booking_id, qrCode: qrCodeURL, amount: paymentAmount });
            });
          });
        });
      });
    });
  });
});

// Endpoint สำหรับยืนยันการชำระเงินและอัปเดตสถานะการจอง
app.post('/api/pay/confirm', (req, res) => {
  const { booking_id } = req.body;

  // ตรวจสอบว่ากรอก booking_id
  if (!booking_id) {
    return res.status(400).json({ message: 'กรุณาให้ booking_id' });
  }

  // ตรวจสอบว่าการจองมีอยู่ในระบบ
  const checkBookingSql = 'SELECT * FROM bookings WHERE booking_id = ?';
  pool.query(checkBookingSql, [booking_id], (checkErr, checkResults) => {
    if (checkErr) {
      console.error('Error checking booking:', checkErr);
      return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการตรวจสอบการจอง' });
    }

    if (checkResults.length === 0) {
      return res.status(404).json({ message: 'ไม่พบการจองในระบบ' });
    }

    const booking = checkResults[0];

    if (booking.status === 'confirm') {
      return res.status(400).json({ message: 'การจองนี้ได้รับการยืนยันแล้ว' });
    }

    // อัปเดตสถานะการจองเป็น 'confirm'
    const updateBookingSql = 'UPDATE bookings SET status = ? WHERE booking_id = ?';
    pool.query(updateBookingSql, ['confirm', booking_id], (updateErr, updateResult) => {
      if (updateErr) {
        console.error('Error updating booking status:', updateErr);
        return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตสถานะการจอง' });
      }

      res.status(200).json({ message: 'การจองได้รับการยืนยันแล้ว' });
    });
  });
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
