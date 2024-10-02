import React from 'react'
import { Link } from "react-router-dom";

function AppbarAdmin() {
  return (
    <>
          <nav className="head-admin pt-2 row">
            <h3 className="px-3 text-admin">Admin</h3>
            <div className='d-flex p-2'>
              <img className="pic-admin" src="dogadmin.png" alt="Add Dog" />
              <Link to="/home-admin" className="nav-link">รายชื่อสุนัข</Link>
            </div>
            <div className='d-flex p-2'>
              <img className="pic-admin" src="dogadmin.png" alt="Add Dog" />
              <Link to="/adddog" className="nav-link">เพิ่มสุนัข</Link>
            </div>
            <div className="d-flex p-2">
              <img className="pic-admin" src="docadmin.png" alt="Check Reservations" />
              <Link to="/reserve-admin" className="nav-link">เช็ครายการจอง</Link>
            </div>
            <div className="d-flex p-2">
              <img className="pic-admin" src="docadmin.png" alt="Postpone Pickup" />
              <Link to="/change-date" className="nav-link">เลือนวันรับ</Link>
            </div>
            <div className="d-flex p-2">
              <img className="pic-admin" src="listadmin.png" alt="Member List" />
              <Link to="/list-user" className="nav-link">รายชื่อสมาชิก</Link>
            </div>
            <div className="d-flex p-2">
              <img className="pic-admin" src="doc2admin.png" alt="Summary" />
              <Link to="/result" className="nav-link">สรุปยอด</Link>
            </div>
          </nav>
    </>
  )
}

export default AppbarAdmin