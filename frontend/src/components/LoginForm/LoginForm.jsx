import React, { useState } from 'react';
import api from '../../config/apiConfig';

import { logo } from '../../assets/' 

function LoginForm() {
  const [formData, setFormData] = useState({
    user_email: '',
    user_password: '',
  });

  const [alert, setAlert] = useState({ message: '', type: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ตรวจสอบว่าฟอร์มกรอกข้อมูลครบถ้วนหรือไม่
    if (!formData.user_email || !formData.user_password) {
      setAlert({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน', type: 'danger' });
      return;
    }
    
    try {
      const response = await api.post('/api/login', formData);
      const { token, message, user_role, user_id, firstname } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user_role', user_role);
      localStorage.setItem('user_id', user_id);
      localStorage.setItem('firstname', firstname);

      setAlert({ message: response.data, type: 'success' }); // แสดงข้อความสำเร็จ
       // จัดการสถานะการเข้าสู่ระบบ
      localStorage.setItem('token', response.data.token); // เก็บ token ใน localStorage
      window.location.href = '/shop'; // เปลี่ยนเส้นทางไปยังหน้าโฮม
    } catch (error) {
      console.error('Error logging in:', error);
      const errorMessage = error.response?.data || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ';
      setAlert({ message: errorMessage, type: 'danger' }); // แสดงข้อความผิดพลาด
    }
  };

  return (
    <>
    {/* Start Modal_Login CSS */}
    <div
        className="modal fade"
        id="login"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {/* แสดง Alert หากมีข้อความ */}
              {alert.message && (
                <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                  {alert.message}
                  <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
              )}
              <div className="row">
                <div className="col-12 d-flex justify-content-center">
                  <img
                    src={ logo }
                    style={{ width: '100px' }}
                    alt="Logo"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-12 d-flex justify-content-center pt-3">
                  <h2>ล็อคอิน</h2>
                </div>
              </div>

              {/* ฟอร์มสำหรับล็อคอิน */}
              <form onSubmit={handleSubmit}>
                {/* เพิ่ม form */}
                <div className="row">
                  <div className="col-12 pt-3 px-5">
                    <label htmlFor="email" className="form-label">
                      อีเมล์(ใช้เป็น Username)
                    </label>
                    <input
                      name="user_email"
                      type="email"
                      className="form-control"
                      value={formData.user_email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12 pt-3 px-5">
                    <label htmlFor="password" className="form-label">รหัสผ่าน</label>
                    <input
                      type="password"
                      name="user_password"
                      className="form-control"
                      value={formData.user_password}
                      onChange={handleChange}
                      required
                    />
                    <a className="d-flex justify-content-end py-1" href="register">สมัครสมาชิก</a>
                  </div>
                </div>

                <div className="row">
                  <div className="d-flex justify-content-center pt-1 px-5 pb-5">
                    <button type="submit" className="btn btn-primary w-100">
                      ล็อคอิน
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginForm;
