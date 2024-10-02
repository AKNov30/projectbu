import React, { useEffect, useState } from 'react';

function ListUser() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // ดึงข้อมูลจาก API
        fetch('http://localhost:5000/api/users')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching users:', error));
    }, []);

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
                                {users.length > 0 ? (
                                    users.map(user => (
                                        <tr key={user.user_id}>
                                            <td className="text-center">{user.user_id}</td>
                                            <td>{user.firstname} {user.lastname}</td>
                                            <td>{user.user_role}</td>
                                            <td className="text-center">
                                                <a className="hover-icon" href={`/edit/${user.user_id}`}>
                                                    <img className="pic-icon" src="edit-icon.png" alt="Edit" />
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center">กำลังโหลดข้อมูล...</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ListUser