// src/components/Register.js

import React, { useState } from 'react';
import Swal from 'sweetalert2';
import api from '../../config/apiConfig';

import { logo, back } from '../../assets/'

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    user_email: '',
    user_password: '',
    user_password_confirm: '',
    phone: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // ล้างข้อความแสดงข้อผิดพลาดเมื่อผู้ใช้เริ่มพิมพ์ใหม่ในฟิลด์รหัสผ่านหรือยืนยันรหัสผ่าน
    if (name === 'user_password' || name === 'user_password_confirm') {
      setError('');
      setSuccess('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.user_password !== formData.user_password_confirm) {
      setError('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    try {
      const response = await api.post('/api/register', formData);
      Swal.fire({
        title: 'สมัครสมาชิกสำเร็จ!',
        text: response.data || "Saved!",
        icon: 'success',
        confirmButtonText: 'ตกลง',
      });
      setFormData({
        firstname: '',
        lastname: '',
        user_email: '',
        user_password: '',
        user_password_confirm: '',
        phone: '',
      }); // ล้างฟอร์มหลังจากสมัครสมาชิกสำเร็จ
    } catch (error) {
      alert('Error registering user: ' + error.response.data);
    }
  };

  return (
    <>
      <div className="container">
        {/* Back Button */}
        <div className="row fix-row">
          <div className="col-12 pt-1">
            <a
              className="px-2 d-flex"
              href="shop"
              style={{ color: 'black', cursor: 'pointer' }}
            >
              <img src={back} style={{ width: '25px' }} alt="Back" />
              ย้อนกลับ
            </a>
          </div>
        </div>

        {/* Logo */}
        <div className="row">
          <div className="col-12 pt-3 d-flex justify-content-center">
            <img src={logo} style={{ width: '100px' }} alt="Banner Image" />
          </div>
        </div>

        {/* Title */}
        <div className="row">
          <div className="col-12 pt-3 d-flex justify-content-center">
            <h1>สมัครสมาชิก</h1>
          </div>
        </div>

        {/* RegisterForm */}
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-xl-4 pt-3"></div>
            <div className="col-xl-2 pt-3">
              <label className="form-label">ชื่อ</label>
              <input
                type="text"
                name="firstname"
                className="form-control"
                value={formData.firstname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-xl-2 pt-3">
              <label className="form-label">นามสกุล</label>
              <input
                type="text"
                name="lastname"
                className="form-control"
                value={formData.lastname}
                onChange={handleChange}
                required
              />
            </div>
          </div>


          <div className="row">
            <div className="col-xl-4 pt-3"></div>
            <div className="col-xl-4 pt-3">
              <label className="form-label">อีเมล์(ใช้เป็น Username)</label>
              <input
                type="email"
                name="user_email"
                className="form-control"
                value={formData.user_email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-xl-4 pt-3"></div>
            <div className="col-xl-4 pt-3">
              <label className="form-label">รหัสผ่าน</label>
              <input
                type="password"
                name="user_password"
                className="form-control"
                value={formData.user_password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-xl-4 pt-3"></div>
            <div className="col-xl-4 pt-3">
              <label className="form-label">ยืนยันรหัสผ่าน</label>
              <input
                type="password"
                name="user_password_confirm"
                className="form-control"
                value={formData.user_password_confirm}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-xl-4 pt-3"></div>
            <div className="col-xl-4 pt-3">
              <label className="form-label">เบอร์โทรศัพท์</label>
              <input
                type="text"
                name="phone"
                className="form-control"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-xl-4 pt-3"></div>
            <div className="col-xl-4 pt-3">
              <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '50px' }}>สมัครสมาชิก</button>
              <div className="pt-3">
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default RegisterForm;
