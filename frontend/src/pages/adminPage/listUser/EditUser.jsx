import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertSave } from '../../../components/alert/Alert';
import { apiUrl } from '../../../config/apiConfig';

import { logo, back } from '../../../assets/'

function EditUser() {
  const { id } = useParams(); // ดึง user_id จาก URL
  const navigate = useNavigate();
  const [user, setUser] = useState({
    user_email: '',
    firstname: '',
    lastname: '',
    phone: ''
  });

  // State สำหรับควบคุมการแสดง Alert
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    // ดึงข้อมูลผู้ใช้จาก API เพื่อนำมาแสดงในฟอร์ม
    fetch(`${ apiUrl }/api/users/${id}`)
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => console.error('Error fetching user:', error));
  }, [id]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // อัปเดตข้อมูลผู้ใช้ในฐานข้อมูลผ่าน API
    fetch(`${ apiUrl }/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    })
      .then(response => response.json())
      .then(() => {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate('/admin/list-user'); // กลับไปหน้ารายชื่อสมาชิกหลังจากแก้ไขเสร็จ
        }, 3000);
      })
      .catch(error => {
        console.error('Error updating user:', error);
        setShowError(true); // แสดง Alert ข้อผิดพลาด
        // ซ่อน Alert หลังจาก 3 วินาที
        setTimeout(() => {
          setShowError(false);
        }, 3000);
      });
  };

  return (
    <>
      <div className="row fix-row">
        <div className="col-12 pt-1">
          <a className="p-2 d-flex" href="/admin/list-user" style={{ color: 'black', cursor: 'pointer' }}>
            <img src={back} alt="Back" style={{ width: '25px' }} />
            ย้อนกลับ
          </a>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-12 pt-3 d-flex justify-content-center">
            <img src={logo} style={{ width: '100px' }} alt="Banner Image" />
          </div>
          <div className="col-12 pt-3 d-flex justify-content-center">
            <h1>แก้ไขข้อมูลสมาชิก</h1>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">อีเมล/Username</label>
            <input
              type="email"
              name="user_email"
              value={user.user_email}
              onChange={handleChange}
              className="form-control mb-3"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">ชื่อ</label>
            <input
              type="text"
              name="firstname"
              value={user.firstname}
              onChange={handleChange}
              className="form-control mb-3"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">นามสกุล</label>
            <input
              type="text"
              name="lastname"
              value={user.lastname}
              onChange={handleChange}
              className="form-control mb-3"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">เบอร์โทรศัพท์</label>
            <input
              type="text"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              className="form-control mb-3"
              required
            />
          </div>
          <AlertSave
            onConfirm={handleSubmit}
            title={"คุณแน่ใจหรือไม่ที่จะแก้ไขข้อมูล?"}
            confirmText={"ยืนยัน"}
            successMessage={"แก้ไขสำเร็จ"}
          >
            <div className="row d-flex justify-content-center">
              <button type="button" className="btn btn-primary btn-edit">บันทึก</button>
            </div>
            
          </AlertSave>
      </form>
      {/* แสดง Alert สำเร็จ */}
      {showSuccess && (
        <div className="alert alert-success alert-dismissible fade show mt-3" role="alert">
          แก้ไขข้อมูลสำเร็จ!
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setShowSuccess(false)}></button>
        </div>
      )}

      {/* แสดง Alert ข้อผิดพลาด */}
      {showError && (
        <div className="alert alert-danger alert-dismissible fade show mt-3" role="alert">
          เกิดข้อผิดพลาดในการแก้ไขข้อมูล กรุณาลองใหม่อีกครั้ง
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setShowError(false)}></button>
        </div>
      )}
    </div >
    </>
  );
}

export default EditUser;
