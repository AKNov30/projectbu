import React from 'react'
import { Link } from "react-router-dom";

// image
import { doc2Admin, listAdmin, docAdmin, dogAdmin, userAdmin, result, time, list } from '../../assets'

function AppbarAdmin() {
  return (
    <>
          <nav className="head-admin p-4 row">

            <div className='d-flex p-2'>
              <img className="pic-admin" src={ list } alt="Add Dog" />
              <Link to="/admin/home-admin" className="nav-link">รายชื่อสุนัข</Link>
            </div>
            <div className='d-flex p-2'>
              <img className="pic-admin" src={ dogAdmin } alt="Add Dog" />
              <Link to="/admin/adddog" className="nav-link">เพิ่มสุนัข</Link>
            </div>
            <div className="d-flex p-2">
              <img className="pic-admin" src={ docAdmin } alt="Check Reservations" />
              <Link to="/admin/reserve-admin" className="nav-link">เช็ครายการจอง</Link>
            </div>
            <div className="d-flex p-2">
              <img className="pic-admin" src={ time } alt="Postpone Pickup" />
              <Link to="/admin/change-date" className="nav-link">เลื่อนวันรับ</Link>
            </div>
            <div className="d-flex p-2">
              <img className="pic-admin" src={ userAdmin } alt="Member List" />
              <Link to="/admin/list-user" className="nav-link">รายชื่อสมาชิก</Link>
            </div>
            <div className="d-flex p-2">
              <img className="pic-admin" src={ result } alt="Summary" />
              <Link to="/admin/result" className="nav-link">สรุปยอด</Link>
            </div>
          </nav>
    </>
  )
}

export default AppbarAdmin