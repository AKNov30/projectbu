import React, { useEffect, useState } from 'react';
import { editIcon, binIcon } from '../../../assets/';
import { AlertDelete } from '../../../components/alert/Alert';

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
        fetch(`http://localhost:5000/api/users?page=${page}&limit=14`)
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
                toast.error('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้');
                setLoading(false);
            });
    };

    const handleDelete = (user_id) => {
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
                setUsers(users.filter(user => user.user_id !== user_id));
                toast.success(data.message || 'ลบผู้ใช้สำเร็จ');
            })
            .catch(error => {
                console.error('Error deleting user:', error);
                toast.error(error.message || 'เกิดข้อผิดพลาดในการลบผู้ใช้');
            });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page); // เปลี่ยนหน้าปัจจุบันเมื่อกดเปลี่ยนหน้า
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
                        <table className="table table-striped table-hover">
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
                        <nav aria-label="Page navigation">
                            <ul className="pagination justify-content-center">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>ก่อนหน้า</button>
                                </li>
                                {[...Array(totalPages).keys()].map(page => (
                                    <li key={page + 1} className={`page-item ${currentPage === page + 1 ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => handlePageChange(page + 1)}>{page + 1}</button>
                                    </li>
                                ))}
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>ถัดไป</button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ListUser;
