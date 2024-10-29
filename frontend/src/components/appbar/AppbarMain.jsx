import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom"; // นำเข้า useNavigate เพื่อใช้เปลี่ยนเส้นทาง
import LoginForm from '../LoginForm/LoginForm';

//image
import { logo, paws } from '../../assets/'

function AppbarMain() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token')); // ตรวจสอบสถานะล็อกอิน
  const [userRole, setUserRole] = useState(localStorage.getItem('user_role') || '');
  const [firstName, setFirstName] = useState(localStorage.getItem('firstname') || 'User');

  const navigate = useNavigate(); // ใช้ useNavigate เพื่อเปลี่ยนเส้นทาง

  const handleLogout = () => {
    localStorage.removeItem('token'); // ลบ token ออกจาก localStorage
    localStorage.removeItem('user_role'); // ลบ role ออกจาก localStorage
    localStorage.removeItem('firstname'); // ลบ firstname ออกจาก localStorage
    setIsLoggedIn(false); // อัปเดตสถานะล็อกอิน
    setUserRole(''); // รีเซ็ต userRole
    setFirstName('User');
    navigate('/'); // เปลี่ยนเส้นทางไปยังหน้าแรก
  };

  useEffect(() => {
    const role = localStorage.getItem('user_role');
    const name = localStorage.getItem('firstname');
    // console.log('Current role:', role); // เพิ่มบรรทัดนี้เพื่อตรวจสอบค่า role
    setUserRole(role || '');
    setFirstName(name || 'User');
  }, [isLoggedIn]);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light d-flex justify-content-between">
  <div className="d-flex">
    <Link className="navbar-brand text-logo d-flex px-2" to="/">
      <img src={logo} alt="Logo" height="40" className="d-inline-block align-text-top" />
      <div className="pt-1 px-2">PuglifeHouse</div>
    </Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
  </div>

  <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
  <ul className="navbar-nav">
  {/* แสดงลิงก์ "หน้าแรก" และ "ร้านค้า" เฉพาะสำหรับผู้ใช้ที่ไม่ใช่ admin */}
  {userRole !== 'admin' && (
    <>
      <li className="nav-item">
        <Link to="/" className="nav-link">หน้าแรก</Link>
      </li>
      <li className="nav-item">
        <Link to="/shop" className="nav-link">ร้านค้า</Link>
      </li>
      <li className="nav-item">
        <Link to="/contact" className="nav-link">ติดต่อฉัน</Link>
      </li>
    </>
  )}

  {/* เมนูสำหรับผู้ใช้ที่ล็อกอินและไม่ใช่ admin */}
  {isLoggedIn && userRole === 'member' && (
    <>
      <li className="nav-item">
        <Link to="/cancle" className="nav-link">การจอง</Link>
      </li>
      <li className="nav-item">
        <Link to="/history" className="nav-link">ประวัติการจอง</Link>
      </li>
    </>
  )}

{isLoggedIn && userRole === 'admin' && (
    <>
      <li className="nav-item">
        <Link to="/admin/home-admin" className="nav-link">ระบบแอดมิน</Link>
      </li>
    </>
  )}
</ul>


  </div>

  <div className="d-flex align-items-center">
    <ul className="navbar-nav px-2 text-brown d-flex align-items-center">
      {isLoggedIn ? (

          <div class="d-flex">
            
            <div class="d-flex align-items-center">
              {userRole} : {firstName} | 
            </div>

            <div class="px-2">
              <a className="btn btn-danger px-4 " onClick={handleLogout} role="button">ออกจากระบบ</a>
            </div>
            
          </div>
        
      ) : (
        <li className="nav-item" style={{ cursor: 'pointer' }}>
          <a className="btn btn-primary px-4" data-bs-toggle="modal" data-bs-target="#login" role="button">ล็อคอิน</a>
        </li>
      )}
    </ul>
  </div>
</nav>


      <LoginForm />
    </>
  );
}

export default AppbarMain;
