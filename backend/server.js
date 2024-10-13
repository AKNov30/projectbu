// src/server.js

import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'; 
import cors from 'cors';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import promptpayQR from 'promptpay-qr'; 
import qrcode from 'qrcode';  

// Initialize environment variables
dotenv.config();

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 5000;

// Serve static files from 'public/images' directory
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// เชื่อมต่อกับฐานข้อมูล MySQL ด้วย Connection Pool (แนะนำ)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ตรวจสอบการเชื่อมต่อกับฐานข้อมูล
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
  console.log('Connected to database');
  connection.release();
});

// Endpoint สำหรับการสมัครสมาชิก
app.post('/api/register', async (req, res) => {
  const { firstname, lastname, user_email, user_password, phone } = req.body;

  // ตรวจสอบว่ามีผู้ใช้ที่มีอีเมลนี้อยู่แล้วหรือไม่
  pool.query('SELECT * FROM users WHERE user_email = ?', [user_email], async (err, results) => {
    if (err) {
      console.error('Error checking existing user:', err);
      return res.status(500).json('Error checking existing user'); 
    }

    if (results.length > 0) {
      return res.status(400).json('อีเมลนี้ถูกใช้งานแล้ว');
    }

    try {
      // เข้ารหัสรหัสผ่าน
      const hashedPassword = await bcrypt.hash(user_password, 10);

      const sql = 'INSERT INTO users (user_email, user_password, firstname, lastname, phone, user_role) VALUES (?, ?, ?, ?, ?, ?)';

      pool.query(sql, [user_email, hashedPassword, firstname, lastname, phone, 'member'], (err, result) => {
        if (err) {
          console.error('Error inserting user:', err);
          return res.status(500).json('Error inserting user: ' + err.message); 
        }
        res.status(201).json('User registered successfully');
      });
    } catch (error) {
      console.error('Error hashing password:', error);
      res.status(500).json('Error hashing password: ' + error.message); 
    }
  });
});

// Endpoint สำหรับการเข้าสู่ระบบ
app.post('/api/login', async (req, res) => {
  const { user_email, user_password } = req.body;

  // ตรวจสอบว่าผู้ใช้มีอยู่ในฐานข้อมูลหรือไม่
  pool.query('SELECT * FROM users WHERE user_email = ?', [user_email], async (err, results) => {
    if (err) {
      console.error('Error checking user:', err);
      return res.status(500).json('Error checking user');
    }

    // ถ้าผู้ใช้ไม่มีในฐานข้อมูล
    if (results.length === 0) {
      return res.status(400).json('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }

    const user = results[0];

    try {
      // ตรวจสอบรหัสผ่านที่เข้ารหัส
      const match = await bcrypt.compare(user_password, user.user_password);
      if (!match) {
        return res.status(400).json('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
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
      res.status(500).json('Error logging in');
    }
  });
});

// ListUser
// ดึงรายข้อมูล user มาแสดง
app.get('/api/users', (req, res) => {
  const sql = 'SELECT user_id, firstname, lastname, user_role FROM users';

  pool.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json('Error fetching users');
    }
    
    res.status(200).json(results);
  });
});

// ดึงข้อมูลผู้ใช้ตาม user_id 
app.get('/api/users/:user_id', (req, res) => {
  const { user_id } = req.params;
  const sql = 'SELECT firstname, lastname, user_email, phone FROM users WHERE user_id = ?';

  pool.query(sql, [user_id], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json('Error fetching user');
    }

    if (results.length === 0) {
      return res.status(404).json('User not found');
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
  pool.query(checkUserSql, [user_id], (err, results) => {
    if (err) {
      console.error('Error checking user:', err);
      return res.status(500).json('Error checking user');
    }

    // ถ้าไม่มีผู้ใช้นี้ในฐานข้อมูล
    if (results.length === 0) {
      return res.status(404).json('ไม่พบผู้ใช้งาน');
    }

    // อัปเดตข้อมูลผู้ใช้
    const updateSql = 'UPDATE users SET firstname = ?, lastname = ?, user_email = ?, phone = ? WHERE user_id = ?';
    pool.query(updateSql, [firstname, lastname, user_email, phone, user_id], (err, result) => {
      if (err) {
        console.error('Error updating user:', err);
        return res.status(500).json('Error updating user');
      }
      res.status(200).json('ข้อมูลผู้ใช้ถูกอัปเดตเรียบร้อยแล้ว');
    });
  });
});

// Endpoint สำหรับลบผู้ใช้
app.delete('/api/users/:user_id', (req, res) => {
  const { user_id } = req.params;

  // ตรวจสอบว่าผู้ใช้มีอยู่ในฐานข้อมูลหรือไม่
  const checkUserSql = 'SELECT * FROM users WHERE user_id = ?';
  pool.query(checkUserSql, [user_id], (err, results) => {
    if (err) {
      console.error('Error checking user:', err);
      return res.status(500).json({ error: 'Error checking user' });
    }

    // ถ้าไม่มีผู้ใช้นี้ในฐานข้อมูล
    if (results.length === 0) {
      return res.status(404).json({ error: 'ไม่พบผู้ใช้งาน' });
    }

    // ลบผู้ใช้จากฐานข้อมูล
    const deleteSql = 'DELETE FROM users WHERE user_id = ?';
    pool.query(deleteSql, [user_id], (err, result) => {
      if (err) {
        console.error('Error deleting user:', err);
        return res.status(500).json({ error: 'Error deleting user' });
      }
      res.status(200).json({ message: 'ผู้ใช้ถูกลบเรียบร้อยแล้ว' });
    });
  });
});


// AddDog
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    return cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

app.post('/api/adddog', upload.array('files', 4), (req, res) => {
  // Check if the file was uploaded
  if (!req.files || req.files.length === 0) {
    return res.status(400).json('No file uploaded');
  }
  const { dogs_name, birthday, price, color, description, personality } = req.body;

  const sql = 'INSERT INTO dogs (`dogs_name`, `birthday`, `price`, `color`, `description`, `personality`, `image_url`, `status`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

  const fileNames = req.files.map(file => `/images/${file.filename}`);

  const values = [
    dogs_name,
    birthday, 
    price, 
    color, 
    description, 
    personality,
    JSON.stringify(fileNames), // เก็บเป็น JSON string
    'available',
  ];

  pool.query(sql, values, (err, result) => {
    if (err) return res.status(500).json('Error inserting dog: ' + err.message);
    res.status(201).json('Dog added successfully');
  });
});

// ดึงข้อมูลสุนัขทั้งหมดมาแสดงใน home-admin
app.get('/api/dogs', (req, res) => {
  const sql = 'SELECT dog_id, dogs_name, birthday, price, color FROM dogs';
  pool.query(sql, (err, results) => {
    if (err) return res.status(500).json('Error fetching dogs: ' + err.message);
    res.json(results);
  });
});

// Endpoint สำหรับลบสุนัข
app.delete('/api/dogs/:dog_id', (req, res) => {
  const { dog_id } = req.params;

  // ตรวจสอบว่าสุนัขที่ต้องการลบมีอยู่ในฐานข้อมูลหรือไม่
  const checkDogSql = 'SELECT * FROM dogs WHERE dog_id = ?';
  pool.query(checkDogSql, [dog_id], (err, results) => {
    if (err) {
      console.error('Error checking dog:', err);
      return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการตรวจสอบสุนัข' });
    }

    // ถ้าไม่มีสุนัขนี้ในฐานข้อมูล
    if (results.length === 0) {
      return res.status(404).json({ error: 'ไม่พบสุนัขในระบบ' });
    }

    const dog = results[0];
    const imageUrls = JSON.parse(dog.image_url); // แปลง JSON string กลับเป็น array

    // ลบสุนัขจากฐานข้อมูล
    const deleteDogSql = 'DELETE FROM dogs WHERE dog_id = ?';
    pool.query(deleteDogSql, [dog_id], (err, result) => {
      if (err) {
        console.error('Error deleting dog:', err);
        return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบสุนัข' });
      }

      // ลบไฟล์รูปภาพจาก public/images
      imageUrls.forEach(imageUrl => {
        const filePath = path.join(__dirname, 'public', imageUrl); // สร้าง path สำหรับไฟล์
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error deleting file:', err);
          }
        });
      });

      res.status(200).json({ message: 'สุนัขถูกลบเรียบร้อยแล้ว' });
    });
  });
});

// EditdogForm ดึงข้อมูลสุนัขหนึ่งตัว
app.get('/api/dogs/:dog_id', (req, res) => {
  const { dog_id } = req.params;

  const sql = 'SELECT * FROM dogs WHERE dog_id = ?';
  pool.query(sql, [dog_id], (err, results) => {
    if (err) {
      console.error('Error fetching dog:', err);
      return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลสุนัข' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'ไม่พบสุนัขในระบบ' });
    }

    res.json(results[0]);
  });
});

app.put('/api/dogs/:dog_id', upload.array('files'), (req, res) => {
  const { dog_id } = req.params;
  const { dogs_name, birthday, price, color, description, personality, removeImages } = req.body;

  // Initialize fileNames as empty array
  let fileNames = [];
  if (req.files && req.files.length > 0) {
    fileNames = req.files.map(file => `/images/${file.filename}`);
  }

  // Check if we should append or overwrite existing image URLs
  const getExistingDogSql = 'SELECT image_url FROM dogs WHERE dog_id = ?';
  pool.query(getExistingDogSql, [dog_id], (err, results) => {
    if (err) {
      console.error('Error fetching existing dog data:', err);
      return res.status(500).json('Error fetching existing dog data: ' + err.message);
    }

    // If the dog exists, merge existing image URLs
    let existingImages = [];
    if (results.length > 0) {
      existingImages = JSON.parse(results[0].image_url); // Get existing image URLs
    }

    // Remove images specified for deletion
    let imagesToKeep = existingImages;
    if (removeImages && Array.isArray(removeImages)) {
      // Identify images that need to be deleted from the filesystem
      const imagesToDelete = existingImages.filter(image => removeImages.includes(image));
      
      // Delete files from the public/images directory
      imagesToDelete.forEach(image => {
        const filePath = path.join(__dirname, 'public', image); // Construct the full path for the image
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error deleting file:', err);
          }
        });
      });

      imagesToKeep = existingImages.filter(image => !removeImages.includes(image));
    }

    // Combine existing and new image URLs
    const allImageUrls = [...imagesToKeep, ...fileNames];

    const sql = `
      UPDATE dogs 
      SET 
        dogs_name = ?, 
        birthday = ?, 
        price = ?, 
        color = ?, 
        description = ?, 
        personality = ?, 
        image_url = ?
      WHERE dog_id = ?
    `;

    const values = [
      dogs_name,
      birthday, 
      price, 
      color, 
      description, 
      personality,
      JSON.stringify(allImageUrls), // Combine existing and new URLs
      dog_id // Condition for updating the specific dog
    ];

    pool.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error updating dog:', err);
        return res.status(500).json('Error updating dog: ' + err.message);
      }

      // Check if any rows were affected (indicating the dog was found and updated)
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'ไม่พบสุนัขในระบบ' });
      }

      res.status(200).json('Dog updated successfully');
    });
  });
});


// ดึงข้อมูลสุนัขทั้งหมดมาแสดงใน Shop
app.get('/api/shop-dogs', (req, res) => {
  const sql = 'SELECT dog_id, dogs_name, birthday, price, color, image_url FROM dogs WHERE status = "available"';
  pool.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching shop dogs:', err);
      return res.status(500).json('Error fetching shop dogs: ' + err.message);
    }
    res.json(results);
  });
});

app.get('/api/dogs/:dog_id', (req, res) => {
  const { dog_id } = req.params;
  const sql = 'SELECT dog_id, dogs_name, birthday, price, color, image_url, personality FROM dogs WHERE dog_id = ?';
  pool.query(sql, [dog_id], (err, results) => {
    if (err) {
      console.error('Error fetching dog details:', err);
      return res.status(500).json({ message: 'Error fetching dog details', error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Dog not found' });
    }
    res.json(results[0]);
  });
});

// สร้าง PromptPay QR Code 
app.post('/api/generate-qr', async (req, res) => {
  const { price, promptpayNumber } = req.body;

  try {
    // สร้างข้อมูล PromptPay QR
    const qrData = promptpayQR(promptpayNumber, { amount: price });

    // สร้างภาพ QR Code จากข้อมูลที่ได้
    qrcode.toDataURL(qrData, (err, url) => {
      if (err) {
        console.error('Error generating QR Code image:', err);
        return res.status(500).json({ error: 'Error generating QR Code image' });
      }

      // ส่ง URL ของภาพ QR Code กลับไปที่ฝั่งไคลเอนต์
      res.status(200).json({ qrCodeUrl: url });
    });
  } catch (error) {
    console.error('Error generating PromptPay QR Code:', error);
    res.status(500).json({ error: 'Error generating PromptPay QR Code' });
  }
});



// Endpoint สำหรับการยืนยันการจอง
app.post('/api/book', upload.single('slip'), async (req, res) => {
  const { user_id, dog_id, booking_date, pickup_date, phone } = req.body;

  // ตรวจสอบว่ามีไฟล์สลิปถูกอัปโหลดหรือไม่
  const slipUrl = req.file ? `/images/${req.file.filename}` : null;

  // SQL query to insert a new booking
  const sqlInsertBooking = `
      INSERT INTO bookings 
      (user_id, dog_id, booking_date, pickup_date, status, phone, slip_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`;

  const status = 'pending'; // Default status for new bookings

  try {
    // Insert booking into the bookings table
    const [result] = await pool.promise().execute(sqlInsertBooking, [user_id, dog_id, booking_date, pickup_date, status, phone, slipUrl]);

    // SQL query to update the status in the dogs table to match the booking status
    const sqlUpdateDogStatus = `
        UPDATE dogs 
        SET status = ? 
        WHERE dog_id = ?`;

    // Update the dog status to match the booking status
    await pool.promise().execute(sqlUpdateDogStatus, [status, dog_id]);

    // Return success response with booking ID
    res.status(200).json({ booking_id: result.insertId, message: 'Booking successful!' });
  } catch (error) {
    console.error('Error inserting booking:', error);
    res.status(500).json({ message: 'Error processing booking', error: error.message });
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
