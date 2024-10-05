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
      <nav className="navbar navbar-expand-lg navbar-light">
        <a className="navbar-brand text-logo d-flex" href="">
          <img src={logo} alt="Logo" height="40" className="d-inline-block align-text-top" />
          <div className="pt-1 px-2">PuglifeHouse</div>
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse just-flex-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/" className="nav-link">หน้าแรก</Link>
            </li>
            <li className="nav-item">
              <Link to="/shop" className="nav-link">ร้านค้า</Link>
            </li>
            {isLoggedIn && userRole === 'member' && ( // แสดงเมื่อ login และ userRole = member
              <>
                <li className="nav-item">
                  <Link to="/cancle" className="nav-link">การจอง</Link>
                </li>
                <li className="nav-item">
                  <Link to="/history" className="nav-link">ประวัติการจอง</Link>
                </li>
              </>
            )}
            <li className="nav-item">
              <a className="nav-link" href="">ติดต่อฉัน
                <img src={paws} alt="Logo" height="18" className="pb-1" />
              </a>
            </li>
          </ul>
        </div>

        <div className="collapse navbar-collapse just-flex-end" id="navbarNav">
          <ul className="navbar-nav">
            {isLoggedIn ? (
              <li className="nav-item dropstart">
                <a
                  className="nav-link dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {firstName}
                  {/* {userRole === 'admin' ? 'Admin' : 'Member'} */}
                </a>
                <ul className="dropdown-menu">
                  {userRole === 'admin' && (
                    <li>
                      <a href='/admin/home-admin' className="nav-link" style={{ cursor: 'pointer' }} >
                        Admin Dashboard
                      </a>
                    </li>
                  )}
                  <li>
                    <a className="dropdown-item" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                      ออกจากระบบ
                    </a>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item" style={{ cursor: 'pointer' }}>
                <a className="nav-link px-3" data-bs-toggle="modal" data-bs-target="#login">
                  ล็อคอิน
                </a>
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
