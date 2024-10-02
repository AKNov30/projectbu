import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditUser() {
  const { id } = useParams(); // ดึง user_id จาก URL
  const navigate = useNavigate();
  const [user, setUser] = useState({
    user_email: '',
    firstname: '',
    lastname: '',
    phone: ''
  });

  useEffect(() => {
    // ดึงข้อมูลผู้ใช้จาก API เพื่อนำมาแสดงในฟอร์ม
    fetch(`http://localhost:5000/api/users/${id}`)
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => console.error('Error fetching user:', error));
  }, [id]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // อัปเดตข้อมูลผู้ใช้ในฐานข้อมูลผ่าน API
    fetch(`http://localhost:5000/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then(() => {
      alert('แก้ไขข้อมูลสำเร็จ');
      navigate.push('/list-user'); // กลับไปหน้ารายชื่อสมาชิกหลังจากแก้ไขเสร็จ
    })
    .catch(error => console.error('Error updating user:', error));
  };

  return (
    <div className="container">
      <h1>แก้ไขข้อมูลสมาชิก</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="user_email"
            value={user.user_email}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>ชื่อ</label>
          <input
            type="text"
            name="firstname"
            value={user.firstname}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>นามสกุล</label>
          <input
            type="text"
            name="lastname"
            value={user.lastname}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>เบอร์โทร</label>
          <input
            type="text"
            name="phone"
            value={user.phone}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">บันทึก</button>
      </form>
    </div>
  );
}

export default EditUser;
