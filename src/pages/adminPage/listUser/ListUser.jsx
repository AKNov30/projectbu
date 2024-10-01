import React from 'react'

function ListUser() {
  return (
    <>
    <div className="container-fluid">
            <div className="row">
                <div className="col-1"></div>
                <div className="col-11 pt-3 d-flex justify-content-center">
                    <h1>รายชื่อสมาชิก</h1>
                </div>
            </div>

            <div className="row">
                <div className="col-xl-1 col-lg-1 col-md-0"></div>
                <div className="col-xl-10 col-lg-2 col-md-2 pt-3">
                    <table className="table bg-grey border">
                        <thead>
                            <tr>
                                <th className="text-center" style={{ width: '5%' }}>รหัส</th>
                                <th style={{ width: '10%' }}>ชื่อ-นามสกุล</th>
                                <th style={{ width: '5%' }}>สถานะ</th>
                                <th className="text-center" style={{ width: '3%' }}>ตั้งค่า</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="text-center">AD001</td>
                                <td>สิทธิโชค จันทร์ทรง</td>
                                <td>Admin</td>
                                <td className="text-center">
                                    <a className="hover-icon" href="edituserforadmin.html">
                                        <img className="pic-icon" src="image/edit-icon.png" alt="Edit" />
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td className="text-center">AD002</td>
                                <td>สิทธิโชค จันทร์ทรง</td>
                                <td>Admin</td>
                                <td className="text-center">
                                    <a className="hover-icon" href="edituserforadmin.html">
                                        <img className="pic-icon" src="image/edit-icon.png" alt="Edit" />
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td className="text-center">US001</td>
                                <td>สิทธิโชค จันทร์ทรง</td>
                                <td>User</td>
                                <td className="text-center">
                                    <a className="hover-icon" href="edituserforadmin.html">
                                        <img className="pic-icon" src="image/edit-icon.png" alt="Edit" />
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </>
  )
}

export default ListUser