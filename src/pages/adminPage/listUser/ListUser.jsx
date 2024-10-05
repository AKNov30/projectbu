import React, { useEffect, useState } from 'react';
import { editIcon, binIcon } from '../../../assets/'

function ListUser() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // ดึงข้อมูลจาก API
        fetch('http://localhost:5000/api/users')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setUsers(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                toast.error('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้');
                setLoading(false);
            });
    }, []);

    const handleDelete = (user_id) => {
        // ยืนยันการลบ
        if (!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้?')) {
            return;
        }

        // เรียกใช้งาน API ลบผู้ใช้
        fetch(`http://localhost:5000/api/users/${user_id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => { throw new Error(errorData.error || 'Network response was not ok') });
                }
                return response.json();
            })
            .then(data => {
                // ลบผู้ใช้จาก state
                setUsers(users.filter(user => user.user_id !== user_id));
                toast.success(data.message || 'ลบผู้ใช้สำเร็จ');
            })
            .catch(error => {
                console.error('Error deleting user:', error);
                toast.error(error.message || 'เกิดข้อผิดพลาดในการลบผู้ใช้');
            });
    };

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
                    <div className="col-xl-12 col-lg-12 col-md-12 pt-3">
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
                                                <a className="hover-icon" href={`/admin/edit/${user.user_id}`}>
                                                    <img className="pic-icon" src={ editIcon } alt="Edit" />
                                                </a>
                                                <a className="hover-icon" aria-label="Delete" onClick={() => handleDelete(user.user_id)}>
                                                    <img className="pic-icon" src={binIcon} alt="Delete" />
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