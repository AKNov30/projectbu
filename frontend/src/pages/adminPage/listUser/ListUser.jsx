import React, { useEffect, useState } from 'react';
import { editIcon, binIcon } from '../../../assets/';
import { AlertDelete } from '../../../components/alert/Alert';
import api, { apiUrl } from '../../../config/apiConfig';
import Pagination from '../../../components/pagination/Pagination';

function ListUser() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1); // state เก็บหน้าปัจจุบัน
    const [totalPages, setTotalPages] = useState(1); // state เก็บจำนวนหน้าทั้งหมด

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const fetchUsers = (page) => {
        setLoading(true);
        fetch(`${apiUrl}/api/users?page=${page}&limit=14`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setUsers(data.users);
                setTotalPages(data.totalPages); // เก็บจำนวนหน้าทั้งหมด
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                setLoading(false);
            });
    };

    const handleDelete = (user_id) => {
        fetch(`${apiUrl}/api/users/${user_id}`, {
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
                setUsers(users.filter(user => user.user_id !== user_id));
            })
            .catch(error => {
                console.error('Error deleting user:', error);
            });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page); // เปลี่ยนหน้าปัจจุบันเมื่อกดเปลี่ยนหน้า
    };

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-12 pt-3 d-flex justify-content-center">
                        <h1>จัดการสมาชิก</h1>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12 pt-3">
                        <table className="table table-striped table-hover border">
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
                                                    <img className="pic-icon" src={editIcon} alt="Edit" />
                                                </a>
                                                <AlertDelete
                                                    onDelete={() => handleDelete(user.user_id)}
                                                    title="คุณแน่ใจหรือไม่ที่จะลบ?"
                                                    text="คุณจะไม่สามารถกู้คืนได้อีก!"
                                                    confirmText="ยืนยัน!"
                                                    successTitle="ลบเรียบร้อย!"
                                                    successText="สมาชิกได้ถูกลบแล้ว."
                                                >
                                                    <a className="hover-icon" aria-label="Delete">
                                                        <img className="pic-icon" src={binIcon} alt="Delete" />
                                                    </a>
                                                </AlertDelete>
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

                        {/* ปุ่ม Pagination */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default ListUser;
