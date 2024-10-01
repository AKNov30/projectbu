import React from 'react';

import { Link } from "react-router-dom";
import LoginForm from '../LoginForm/LoginForm';

function AppbarMain() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light">
        <a className="navbar-brand text-logo d-flex" href="">
          <img src="image/logo.png" alt="Logo" height="40" className="d-inline-block align-text-top" />
          <div className="pt-1 px-2">
            PuglifeHouse
          </div>
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse just-flex-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
            <Link as={Link} to="/" className="nav-link">หน้าแรก</Link>
            </li>
            <li className="nav-item">
            <Link as={Link} to="/shop" className="nav-link">ร้านค้า</Link>
            </li>
            <li className="nav-item">
            <Link as={Link} to="/cancle" className="nav-link">การจอง</Link>
            </li>
            <li className="nav-item">
            <Link as={Link} to="/history" className="nav-link">ประวัติการจอง</Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="">ติดต่อฉัน
                <img src="image/paws.png" alt="Logo" height="18" className="pb-1" />
              </a>
            </li>
          </ul>
        </div>

        <div className="collapse navbar-collapse just-flex-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item" style={{ cursor: 'pointer' }}>
              <a className="nav-link px-3" data-bs-toggle="modal" data-bs-target="#login">ล็อคอิน</a>
            </li>
          </ul>
        </div>
      </nav>

      <LoginForm />
    </>
  );
}

export default AppbarMain;
