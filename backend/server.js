// src/server.js

const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { fileURLToPath } = require("url");
const promptpayQR = require("promptpay-qr");
const qrcode = require("qrcode");


// Initialize environment variables
dotenv.config();

// Define __dirname for ES Modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000; //**test**
// const port = 5000;

// Serve static files from 'public/images' directory
app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use(express.json());
app.use(cors({
  origin: process.env.FE_PORT || 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true 
}));
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
    console.error("Database connection failed:", err);
    process.exit(1);
  }
  console.log("Connected to database");
  connection.release();
});

app.get("/", (req,res) => {
  res.send("Hello")
})

// Endpoint สำหรับการสมัครสมาชิก
app.post("/api/register", async (req, res) => {
  const { firstname, lastname, user_email, user_password, phone } = req.body;

  // ตรวจสอบว่ามีผู้ใช้ที่มีอีเมลนี้อยู่แล้วหรือไม่
  pool.query(
    "SELECT * FROM users WHERE user_email = ?",
    [user_email],
    async (err, results) => {
      if (err) {
        console.error("Error checking existing user:", err);
        return res.status(500).json("Error checking existing user");
      }

      if (results.length > 0) {
        return res.status(400).json("อีเมลนี้ถูกใช้งานแล้ว");
      }

      try {
        // เข้ารหัสรหัสผ่าน
        const hashedPassword = await bcrypt.hash(user_password, 10);

        const sql =
          "INSERT INTO users (user_email, user_password, firstname, lastname, phone, user_role) VALUES (?, ?, ?, ?, ?, ?)";

        pool.query(
          sql,
          [user_email, hashedPassword, firstname, lastname, phone, "member"],
          (err, result) => {
            if (err) {
              console.error("Error inserting user:", err);
              return res
                .status(500)
                .json("Error inserting user: " + err.message);
            }
            res.status(201).json("User registered successfully");
          }
        );
      } catch (error) {
        console.error("Error hashing password:", error);
        res.status(500).json("Error hashing password: " + error.message);
      }
    }
  );
});

// Endpoint สำหรับการเข้าสู่ระบบ
app.post("/api/login", async (req, res) => {
  const { user_email, user_password } = req.body;

  // ตรวจสอบว่าผู้ใช้มีอยู่ในฐานข้อมูลหรือไม่
  pool.query(
    "SELECT * FROM users WHERE user_email = ?",
    [user_email],
    async (err, results) => {
      if (err) {
        console.error("Error checking user:", err);
        return res.status(500).json("Error checking user");
      }

      // ถ้าผู้ใช้ไม่มีในฐานข้อมูล
      if (results.length === 0) {
        return res.status(400).json("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      }

      const user = results[0];

      try {
        // ตรวจสอบรหัสผ่านที่เข้ารหัส
        const match = await bcrypt.compare(user_password, user.user_password);
        if (!match) {
          return res.status(400).json("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        }

        // เข้าสู่ระบบสำเร็จ
        const { user_id, user_role, firstname } = user; // ดึง user_id, user_role, firstname จากผลลัพธ์
        const token = "your_generated_jwt_token"; // สร้าง JWT token ที่นี่ (คุณสามารถใช้ jwt.sign() เพื่อสร้าง token)

        res.status(200).json({
          token,
          message: "เข้าสู่ระบบสำเร็จ",
          user_id,
          firstname,
          user_role,
        });
      } catch (error) {
        console.error("Error comparing password:", error);
        res.status(500).json("Error logging in");
      }
    }
  );
});

// ListUser
// ดึงรายข้อมูล user มาแสดง
app.get("/api/users", (req, res) => {
  const page = parseInt(req.query.page) || 1; // หน้าที่ต้องการแสดง, ค่า default คือหน้า 1
  const limit = parseInt(req.query.limit) || 14; // จำนวนข้อมูลต่อหน้า, ค่า default คือ 10
  const offset = (page - 1) * limit; // จุดเริ่มต้นของข้อมูลในหน้านั้น ๆ

  const sql = `SELECT user_id, firstname, lastname, user_role FROM users LIMIT ? OFFSET ?`;

  pool.query(sql, [limit, offset], (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json("Error fetching users");
    }

    const countSql = "SELECT COUNT(*) AS total FROM users"; // ดึงจำนวนทั้งหมดของผู้ใช้เพื่อนำไปคำนวณจำนวนหน้า
    pool.query(countSql, (countErr, countResult) => {
      if (countErr) {
        console.error("Error fetching total users count:", countErr);
        return res.status(500).json("Error fetching total users count");
      }

      const totalUsers = countResult[0].total;
      const totalPages = Math.ceil(totalUsers / limit);

      res.status(200).json({
        users: results,
        totalPages,
        currentPage: page,
        totalUsers,
      });
    });
  });
});

// ดึงข้อมูลผู้ใช้ตาม user_id
app.get("/api/users/:user_id", (req, res) => {
  const { user_id } = req.params;
  const sql =
    "SELECT firstname, lastname, user_email, phone FROM users WHERE user_id = ?";

  pool.query(sql, [user_id], (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json("Error fetching user");
    }

    if (results.length === 0) {
      return res.status(404).json("User not found");
    }

    res.status(200).json(results[0]);
  });
});

// Endpoint สำหรับแก้ไขข้อมูล user
app.put("/api/users/:user_id", (req, res) => {
  const { user_id } = req.params;
  const { firstname, lastname, user_email, phone } = req.body;

  // ตรวจสอบว่าผู้ใช้มีอยู่ในฐานข้อมูลหรือไม่
  const checkUserSql = "SELECT * FROM users WHERE user_id = ?";
  pool.query(checkUserSql, [user_id], (err, results) => {
    if (err) {
      console.error("Error checking user:", err);
      return res.status(500).json("Error checking user");
    }

    // ถ้าไม่มีผู้ใช้นี้ในฐานข้อมูล
    if (results.length === 0) {
      return res.status(404).json("ไม่พบผู้ใช้งาน");
    }

    // อัปเดตข้อมูลผู้ใช้
    const updateSql =
      "UPDATE users SET firstname = ?, lastname = ?, user_email = ?, phone = ? WHERE user_id = ?";
    pool.query(
      updateSql,
      [firstname, lastname, user_email, phone, user_id],
      (err, result) => {
        if (err) {
          console.error("Error updating user:", err);
          return res.status(500).json("Error updating user");
        }
        res.status(200).json("ข้อมูลผู้ใช้ถูกอัปเดตเรียบร้อยแล้ว");
      }
    );
  });
});

// Endpoint สำหรับลบผู้ใช้
app.delete("/api/users/:user_id", (req, res) => {
  const { user_id } = req.params;

  // อัพเดตสถานะของสุนัขเป็น "available" ถ้าสถานะปัจจุบันเป็น "pending"
  const updateDogStatusSql = "UPDATE dogs SET status = 'available' WHERE status = 'pending' AND dog_id IN (SELECT dog_id FROM bookings WHERE user_id = ?)";
  pool.query(updateDogStatusSql, [user_id], (err, result) => {
    if (err) {
      console.error("Error updating dog status:", err);
      return res.status(500).json({ error: "Error updating dog status" });
    }

    // ลบข้อมูลการจองที่เกี่ยวข้องกับผู้ใช้ในตาราง bookings
    const deleteBookingsSql = "DELETE FROM bookings WHERE user_id = ?";
    pool.query(deleteBookingsSql, [user_id], (err, result) => {
      if (err) {
        console.error("Error deleting bookings:", err);
        return res.status(500).json({ error: "Error deleting bookings" });
      }

      // ตรวจสอบว่าผู้ใช้มีอยู่ในฐานข้อมูลหรือไม่
      const checkUserSql = "SELECT * FROM users WHERE user_id = ?";
      pool.query(checkUserSql, [user_id], (err, results) => {
        if (err) {
          console.error("Error checking user:", err);
          return res.status(500).json({ error: "Error checking user" });
        }

        // ถ้าไม่มีผู้ใช้นี้ในฐานข้อมูล
        if (results.length === 0) {
          return res.status(404).json({ error: "ไม่พบผู้ใช้งาน" });
        }

        // ลบผู้ใช้จากฐานข้อมูล
        const deleteUserSql = "DELETE FROM users WHERE user_id = ?";
        pool.query(deleteUserSql, [user_id], (err, result) => {
          if (err) {
            console.error("Error deleting user:", err);
            return res.status(500).json({ error: "Error deleting user" });
          }
          res.status(200).json({ message: "ผู้ใช้ถูกลบเรียบร้อยแล้ว" });
        });
      });
    });
  });
});

// AddDog
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

app.post("/api/adddog", upload.array("files", 4), (req, res) => {
  // Check if the file was uploaded
  if (!req.files || req.files.length === 0) {
    return res.status(400).json("No file uploaded");
  }
  const { dogs_name, birthday, price, color, description, personality } =
    req.body;

  const sql =
    "INSERT INTO dogs (`dogs_name`, `birthday`, `price`, `color`, `description`, `personality`, `image_url`, `status`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

  const fileNames = req.files.map((file) => `/images/${file.filename}`);

  const values = [
    dogs_name,
    birthday,
    price,
    color,
    description,
    personality,
    JSON.stringify(fileNames), // เก็บเป็น JSON string
    "available",
  ];

  pool.query(sql, values, (err, result) => {
    if (err) return res.status(500).json("Error inserting dog: " + err.message);
    res.status(201).json("Dog added successfully");
  });
});

// ดึงข้อมูลสุนัขทั้งหมดมาแสดงใน home-admin
app.get("/api/dogs", (req, res) => {
  const page = parseInt(req.query.page) || 1; // หน้าที่ต้องการแสดง, ค่า default คือหน้า 1
  const limit = parseInt(req.query.limit) || 14; // จำนวนข้อมูลต่อหน้า, ค่า default คือ 10
  const offset = (page - 1) * limit; // จุดเริ่มต้นของข้อมูลในหน้านั้น ๆ

  const sql = `SELECT dog_id, dogs_name, birthday, price, color FROM dogs LIMIT ? OFFSET ?`;
  pool.query(sql, [limit, offset], (err, results) => {
    if (err) return res.status(500).json("Error fetching dogs: " + err.message);

    // คำสั่งเพื่อดึงจำนวนข้อมูลทั้งหมดเพื่อนำไปคำนวณจำนวนหน้า
    const countSql = "SELECT COUNT(*) AS total FROM dogs";
    pool.query(countSql, (countErr, countResult) => {
      if (countErr) {
        return res
          .status(500)
          .json("Error fetching total dogs count: " + countErr.message);
      }

      const totalDogs = countResult[0].total;
      const totalPages = Math.ceil(totalDogs / limit); // จำนวนหน้าทั้งหมด

      res.json({
        dogs: results,
        totalPages,
        currentPage: page,
        totalDogs,
      });
    });
  });
});

// Endpoint สำหรับลบสุนัข
app.delete("/api/dogs/:dog_id", (req, res) => {
  const { dog_id } = req.params;

  // ลบข้อมูลการจองที่เกี่ยวข้องกับสุนัขในตาราง bookings ก่อน
  const deleteBookingsSql = "DELETE FROM bookings WHERE dog_id = ?";
  pool.query(deleteBookingsSql, [dog_id], (err, result) => {
    if (err) {
      console.error("Error deleting bookings:", err);
      return res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบข้อมูลการจอง" });
    }

    // ตรวจสอบว่าสุนัขที่ต้องการลบมีอยู่ในฐานข้อมูลหรือไม่
    const checkDogSql = "SELECT * FROM dogs WHERE dog_id = ?";
    pool.query(checkDogSql, [dog_id], (err, results) => {
      if (err) {
        console.error("Error checking dog:", err);
        return res.status(500).json({ error: "เกิดข้อผิดพลาดในการตรวจสอบสุนัข" });
      }

      // ถ้าไม่มีสุนัขนี้ในฐานข้อมูล
      if (results.length === 0) {
        return res.status(404).json({ error: "ไม่พบสุนัขในระบบ" });
      }

      const dog = results[0];
      const imageUrls = JSON.parse(dog.image_url); // แปลง JSON string กลับเป็น array

      // ลบสุนัขจากฐานข้อมูล
      const deleteDogSql = "DELETE FROM dogs WHERE dog_id = ?";
      pool.query(deleteDogSql, [dog_id], (err, result) => {
        if (err) {
          console.error("Error deleting dog from database:", err);
          return res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบสุนัขจากฐานข้อมูล" });
        }

        // ลบไฟล์รูปภาพจาก public/images
        imageUrls.forEach((imageUrl) => {
          const filePath = path.join(__dirname, "public", imageUrl); // สร้าง path สำหรับไฟล์
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error("Error deleting file:", err);
            }
          });
        });

        res.status(200).json({ message: "สุนัขถูกลบเรียบร้อยแล้ว" });
      });
    });
  });
});


// EditdogForm ดึงข้อมูลสุนัขหนึ่งตัว
app.get("/api/dogs/:dog_id", (req, res) => {
  const { dog_id } = req.params;

  const sql = "SELECT * FROM dogs WHERE dog_id = ?";
  pool.query(sql, [dog_id], (err, results) => {
    if (err) {
      console.error("Error fetching dog:", err);
      return res
        .status(500)
        .json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลสุนัข" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "ไม่พบสุนัขในระบบ" });
    }

    res.json(results[0]);
  });
});

app.put("/api/dogs/:dog_id", upload.array("files"), (req, res) => {
  const { dog_id } = req.params;
  const {
    dogs_name,
    birthday,
    price,
    color,
    description,
    personality,
    removeImages,
  } = req.body;

  // Initialize fileNames as empty array
  let fileNames = [];
  if (req.files && req.files.length > 0) {
    fileNames = req.files.map((file) => `/images/${file.filename}`);
  }

  // Check if we should append or overwrite existing image URLs
  const getExistingDogSql = "SELECT image_url FROM dogs WHERE dog_id = ?";
  pool.query(getExistingDogSql, [dog_id], (err, results) => {
    if (err) {
      console.error("Error fetching existing dog data:", err);
      return res
        .status(500)
        .json("Error fetching existing dog data: " + err.message);
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
      const imagesToDelete = existingImages.filter((image) =>
        removeImages.includes(image)
      );

      // Delete files from the public/images directory
      imagesToDelete.forEach((image) => {
        const filePath = path.join(__dirname, "public", image); // Construct the full path for the image
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          }
        });
      });

      imagesToKeep = existingImages.filter(
        (image) => !removeImages.includes(image)
      );
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
      JSON.stringify(allImageUrls),
      dog_id,
    ];

    pool.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error updating dog:", err);
        return res.status(500).json("Error updating dog: " + err.message);
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "ไม่พบสุนัขในระบบ" });
      }

      res.status(200).json("Dog updated successfully");
    });
  });
});

//แสดงประวัติการจอง page admin/change-date
app.get("/api/change-date", (req, res) => {
  const sql = `
    SELECT 
      b.booking_id, 
      b.user_id, 
      b.dog_id, 
      b.booking_date, 
      b.pickup_date, 
      b.status, 
      b.phone, 
      b.created_at, 
      d.dogs_name, 
      d.color, 
      d.price, 
      d.image_url,
      u.firstname,
      u.lastname,
      u.user_email
    FROM bookings b
    JOIN dogs d ON b.dog_id = d.dog_id
    JOIN users u ON b.user_id = u.user_id
    WHERE b.status IN ('successful', 'pending');
  `;
  pool.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database query error" });
    }

    result = result.map((row) => {
      let imageUrlArray = [];

      // ตรวจสอบว่า image_url เป็น JSON string หรือไม่
      try {
        imageUrlArray = JSON.parse(row.image_url); // แปลง JSON string เป็นอาเรย์
      } catch (error) {
        imageUrlArray = [row.image_url]; // ถ้าไม่ใช่ JSON string ใช้เป็นสตริงธรรมดา
      }

      // เลือกใช้รูปแรกจากอาเรย์ (ถ้ามี) และตรวจสอบว่า URL มี "/images/" อยู่แล้วหรือไม่
      const firstImageUrl = imageUrlArray.length > 0 ? imageUrlArray[0] : null;
      const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
      const finalImageUrl = `${backendUrl}${firstImageUrl}`; // ถ้ายังไม่มี "/images/"

      return {
        ...row,
        image_url: firstImageUrl ? finalImageUrl : null,
      };
    });

    res.json(result);
  });
});

// change-date put date,time
app.put("/api/change-date/:booking_id", (req, res) => {
  const { booking_id } = req.params; // รับ booking_id จาก URL parameter
  const { booking_date, pickup_date } = req.body; // รับ booking_date และ pickup_date จาก request body

  // ตรวจสอบว่ามีข้อมูลที่จำเป็นหรือไม่
  if (!booking_date || !pickup_date) {
    return res
      .status(400)
      .json({ error: "กรุณาใส่ข้อมูลวันที่และเวลาให้ครบถ้วน" });
  }

  // SQL query สำหรับอัปเดตข้อมูล booking_date และ pickup_date ตาม booking_id
  const sql = `
    UPDATE bookings 
    SET booking_date = ?, pickup_date = ? 
    WHERE booking_id = ?;
  `;

  // รันคำสั่ง SQL และส่งข้อมูลไปยังฐานข้อมูล
  pool.query(sql, [booking_date, pickup_date, booking_id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "ไม่พบรายการจองนี้" });
    }

    // ส่งผลลัพธ์กลับไปที่ฟรอนต์เอนด์เมื่ออัปเดตเสร็จสิ้น
    res.json({ message: "อัปเดตข้อมูลสำเร็จ" });
  });
});

// ดึงสุนัข status = "available"
app.get("/api/all-dogs", (req, res) => {
  const sql = 'SELECT * FROM dogs WHERE status = "available"';

  pool.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching available dogs:", err);
      return res.status(500).json({ message: "Error fetching available dogs" });
    }
    res.json(results); // ส่งข้อมูลสุนัขที่มีสถานะ available กลับไปในรูปแบบ JSON
  });
});

// reserve-admin
app.get("/api/reserve-admin", (req, res) => {
  const sql = `
    SELECT 
      users.user_id,
      users.firstname,
      users.lastname,
      users.user_email,
      bookings.booking_id,
      bookings.dog_id,
      bookings.created_at,
      bookings.booking_date,
      bookings.pickup_date,
      bookings.phone,
      bookings.status,
      dogs.image_url
    FROM 
      users
    INNER JOIN 
      bookings ON users.user_id = bookings.user_id
    INNER JOIN 
      dogs ON bookings.dog_id = dogs.dog_id
    WHERE bookings.status = "pending";
    `;

  pool.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching reservations:", err);
      return res.status(500).json({ message: "Error fetching reservations" });
    }
    res.json(results); // ส่งข้อมูลการจองที่มีสถานะ pending กลับไปในรูปแบบ JSON
  });
});

// reserve-admin-info
app.get("/api/reserve-admin/:id", (req, res) => {
  const reservationId = req.params.id;
  const sql = `
      SELECT 
          dogs.dogs_name,
          dogs.dog_id,
          dogs.price,
          dogs.image_url,
          bookings.booking_id,
          bookings.created_at,
          bookings.booking_date,
          bookings.pickup_date,
          bookings.phone,
          bookings.slip_url,
          users.user_id,
          users.firstname,
          users.lastname,
          users.user_email
      FROM 
          dogs 
      JOIN 
          bookings ON dogs.dog_id = bookings.dog_id
      JOIN 
          users AS users ON bookings.user_id = users.user_id
      WHERE
          bookings.booking_id = ?;
  `;

  pool.query(sql, [reservationId], (err, results) => {
      if (err) {
          console.error("Error fetching reservation:", err);
          return res.status(500).json({ message: "Error fetching reservation", error: err });
      }
      if (results.length === 0) {
          return res.status(404).json({ message: "Reservation not found" });
      }
      res.json(results[0]);
  });
});

// ยืนยันการรับ reserveInfo
app.post("/api/confirm-receive/:bookingId", upload.single('slip'), (req, res) => {
  const bookingId = req.params.bookingId;
  const { dogId } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "Slip file is required" });
  }

  const slipUrl = `/images/${req.file.filename}`;

  const updateBookingQuery = `
    UPDATE bookings 
    SET status = 'successful', slip2_url = ? 
    WHERE booking_id = ?;
  `;

  const updateDogQuery = `
    UPDATE dogs 
    SET status = 'sold' 
    WHERE dog_id = ?;
  `;

  pool.query(updateBookingQuery, [slipUrl, bookingId], (err) => {
    if (err) {
      console.error("Error updating booking:", err);
      return res.status(500).json({ message: "Error updating booking" });
    }

    pool.query(updateDogQuery, [dogId], (err) => {
      if (err) {
        console.error("Error updating dog status:", err);
        return res.status(500).json({ message: "Error updating dog status" });
      }

      res.json({ message: "Booking confirmed and dog status updated successfully" });
    });
  });
});

//result สรุปยอด
app.get("/api/result-admin", (req, res) => {
  const sql = `
    SELECT 
        bookings.booking_id,
        bookings.user_id,
        bookings.dog_id,
        bookings.created_at,
        bookings.status,
        bookings.booking_date,
        users.firstname,
        users.lastname,
        dogs.dogs_name,
        dogs.price
    FROM 
        bookings
    INNER JOIN 
        users ON bookings.user_id = users.user_id
    INNER JOIN 
        dogs ON bookings.dog_id = dogs.dog_id
    WHERE 
        bookings.status = 'successful';
    `;

  pool.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching result:", err);
      return res.status(500).json({ message: "Error fetching result" });
    }
    res.json(results); 
  });
});

// ดึงข้อมูลสุนัขทั้งหมดมาแสดงใน Shop
app.get("/api/shop-dogs", (req, res) => {
  const { page = 1, limit = 10, color, age, price } = req.query;
  const offset = (page - 1) * limit;

  let sql =
    'SELECT dog_id, dogs_name, birthday, price, color, image_url FROM dogs WHERE status = "available"';
  let countSql =
    'SELECT COUNT(*) AS total FROM dogs WHERE status = "available"';
  const filters = [];

  if (color && color !== "ทั้งหมด") {
    filters.push(`color = "${color}"`);
  }

  if (age && age !== "ทั้งหมด") {
    const ageInDays = {
      "14d": 14,
      "28d": 28,
      "2m": 60,
      "3m": 90,
    }[age];

    if (ageInDays) {
      filters.push(`DATEDIFF(CURDATE(), birthday) <= ${ageInDays}`);
    }
  }

  if (price && price !== "all") {
    const priceRange = {
      2024: [0, 2500],
      2023: [2500, 3500],
      2022: [3500, 4500],
      2021: [4500, 5500],
    }[price];

    if (priceRange) {
      filters.push(`price BETWEEN ${priceRange[0]} AND ${priceRange[1]}`);
    }
  }

  if (filters.length) {
    const filterString = filters.join(" AND ");
    sql += ` AND ${filterString}`;
    countSql += ` AND ${filterString}`;
  }

  sql += ` LIMIT ${limit} OFFSET ${offset}`;

  // Query to get total count of available dogs for pagination
  pool.query(countSql, (err, countResult) => {
    if (err) {
      console.error("Error counting shop dogs:", err);
      return res.status(500).json("Error counting shop dogs: " + err.message);
    }

    const totalItems = countResult[0].total;
    const totalPages = Math.ceil(totalItems / limit);

    console.log("Total items:", totalItems); // Debug จำนวนรายการทั้งหมด
    console.log("Total pages:", totalPages); // Debug จำนวนหน้าที่คำนวณได้

    // Query to get filtered data
    pool.query(sql, (err, results) => {
      if (err) {
        console.error("Error fetching shop dogs:", err);
        return res.status(500).json("Error fetching shop dogs: " + err.message);
      }

      // ส่งข้อมูลสุนัขพร้อมกับ totalPages กลับไป
      res.json({
        dogs: results, // ข้อมูลสุนัขที่ถูกกรองแล้ว
        totalPages, // จำนวนหน้าทั้งหมด
      });
    });
  });
});

// detaildog
app.get("/api/dogs/:dog_id", (req, res) => {
  const { dog_id } = req.params;
  const sql =
    "SELECT dog_id, dogs_name, birthday, price, color, image_url, personality FROM dogs WHERE dog_id = ?";
  pool.query(sql, [dog_id], (err, results) => {
    if (err) {
      console.error("Error fetching dog details:", err);
      return res
        .status(500)
        .json({ message: "Error fetching dog details", error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Dog not found" });
    }
    res.json(results[0]);
  });
});

// สร้าง PromptPay QR Code
app.post("/api/generate-qr", async (req, res) => {
  const { price, promptpayNumber } = req.body;

  try {
    // สร้างข้อมูล PromptPay QR
    const qrData = promptpayQR(promptpayNumber, { amount: price });

    // สร้างภาพ QR Code จากข้อมูลที่ได้
    qrcode.toDataURL(qrData, (err, url) => {
      if (err) {
        console.error("Error generating QR Code image:", err);
        return res
          .status(500)
          .json({ error: "Error generating QR Code image" });
      }

      // ส่ง URL ของภาพ QR Code กลับไปที่ฝั่งไคลเอนต์
      res.status(200).json({ qrCodeUrl: url });
    });
  } catch (error) {
    console.error("Error generating PromptPay QR Code:", error);
    res.status(500).json({ error: "Error generating PromptPay QR Code" });
  }
});

// Endpoint สำหรับการยืนยันการจอง
app.post("/api/book", upload.single("slip"), async (req, res) => {
  const { user_id, dog_id, booking_date, pickup_date, phone } = req.body;

  // ตรวจสอบว่ามีไฟล์สลิปถูกอัปโหลดหรือไม่
  const slipUrl = req.file ? `/images/${req.file.filename}` : null;

  // SQL query to insert a new booking
  const sqlInsertBooking = `
      INSERT INTO bookings 
      (user_id, dog_id, booking_date, pickup_date, status, phone, slip_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`;

  const status = "pending"; // Default status for new bookings

  try {
    // Insert booking into the bookings table
    const [result] = await pool
      .promise()
      .execute(sqlInsertBooking, [
        user_id,
        dog_id,
        booking_date,
        pickup_date,
        status,
        phone,
        slipUrl,
      ]);

    const sqlUpdateDogStatus = `
        UPDATE dogs 
        SET status = ? 
        WHERE dog_id = ?`;

    await pool.promise().execute(sqlUpdateDogStatus, [status, dog_id]);

    res
      .status(200)
      .json({ booking_id: result.insertId, message: "Booking successful!" });
  } catch (error) {
    console.error("Error inserting booking:", error);
    res
      .status(500)
      .json({ message: "Error processing booking", error: error.message });
  }
});

// แสดงรายการการจองของ user
app.get("/api/user-dogs", (req, res) => {
  const user_id = req.query.user_id; // รับ user_id จาก query string

  const sql = `
      SELECT 
          bookings.booking_id, 
          bookings.user_id, 
          bookings.dog_id,
          bookings.phone, 
          bookings.created_at,
          bookings.booking_date, 
          bookings.pickup_date, 
          bookings.status,
          bookings.slip_url,
          dogs.dogs_name, 
          dogs.price, 
          dogs.color, 
          dogs.image_url, 
          users.firstname, 
          users.lastname,
          users.user_email
      FROM bookings
      JOIN dogs ON bookings.dog_id = dogs.dog_id
      JOIN users ON bookings.user_id = users.user_id
      WHERE bookings.user_id = ? 
      AND bookings.status NOT IN ('canceled', 'successful');
  `;

  //แสดงประวัติการจอง
  app.get("/api/history", (req, res) => {
    const user_id = req.query.user_id;

    const sql = `
      SELECT 
        bookings.booking_id, 
        bookings.user_id, 
        bookings.dog_id,
        bookings.booking_date,
        bookings.created_at,
        bookings.status,
        dogs.dogs_name, 
        dogs.price
      FROM bookings
      JOIN dogs ON bookings.dog_id = dogs.dog_id
      WHERE bookings.user_id = ? AND bookings.status IN ('canceled', 'successful');
    `;

    pool.query(sql, [user_id], (err, results) => {
      if (err) {
        console.error("Error fetching data:", err);
        return res.status(500).json({ error: "Error fetching data" });
      }

      res.status(200).json(results);
    });
  });

  // Endpoint สำหรับอัปโหลดสลิป
  app.post(
    "/api/upload-slip/:booking_id",
    upload.single("slip"),
    async (req, res) => {
      const { booking_id } = req.params;

      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const slipUrl = `/images/${req.file.filename}`; // Get the file URL

      // Update the booking with the slip URL
      const sqlUpdateSlip =
        "UPDATE bookings SET slip_url = ? WHERE booking_id = ?";

      try {
        await pool.promise().execute(sqlUpdateSlip, [slipUrl, booking_id]);

        res
          .status(200)
          .json({ message: "Slip uploaded successfully", slipUrl });
      } catch (error) {
        console.error("Error uploading slip:", error);
        res
          .status(500)
          .json({ message: "Error uploading slip", error: error.message });
      }
    }
  );

  pool.query(sql, [user_id], (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ error: "Error fetching data" });
    }

    res.status(200).json(results);
  });
});

//ยกเลิกการจอง
app.put("/api/cancel-booking", async (req, res) => {
  const { booking_id, dog_id } = req.body;

  const sqlUpdateBooking = "UPDATE bookings SET status = ? WHERE booking_id = ?";
  const sqlUpdateDog = "UPDATE dogs SET status = ? WHERE dog_id = ?";

  try {
      await pool.promise().execute(sqlUpdateBooking, ["canceled", booking_id]);
      await pool.promise().execute(sqlUpdateDog, ["available", dog_id]);

      res.status(200).json({ message: "การจองถูกยกเลิกเรียบร้อยแล้ว" });
  } catch (error) {
      console.error("Error canceling booking:", error);
      res.status(500).json({ message: "Error canceling booking", error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
