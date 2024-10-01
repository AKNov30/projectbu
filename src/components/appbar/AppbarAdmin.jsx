import React from 'react'

function AppbarAdmin() {
  return (
    <>
          <nav className="head-admin pt-2">
            <h3 className="px-3 text-admin">Admin</h3>
            <div>
              <img className="pic-admin" src="image/dogadmin.png" alt="Add Dog" />
              <a className="admin-text" href="adddog.html">เพิ่มสุนัข</a>
            </div>
            <div className="pt-2">
              <img className="pic-admin" src="image/docadmin.png" alt="Check Reservations" />
              <a className="admin-text" href="reserve-admin.html">เช็ครายการจอง</a>
            </div>
            <div className="pt-2">
              <img className="pic-admin" src="image/docadmin.png" alt="Postpone Pickup" />
              <a className="admin-text" href="date.html">เลือนวันรับ</a>
            </div>
            <div className="pt-2">
              <img className="pic-admin" src="image/listadmin.png" alt="Member List" />
              <a className="admin-text" href="listname.html">รายชื่อสมาชิก</a>
            </div>
            <div className="pt-2">
              <img className="pic-admin" src="image/doc2admin.png" alt="Summary" />
              <a className="admin-text" href="result.html">สรุปยอด</a>
            </div>
          </nav>
    </>
  )
}

export default AppbarAdmin