import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { apiUrl } from '../../../config/apiConfig';
import { logo } from '../../../assets';
import Pagination from '../../../components/pagination/Pagination';

function Reserveadmin() {
    const [reservations, setReservations] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    // ดึงข้อมูลจาก API 
    useEffect(() => {
        fetchReservations(currentPage);
    }, [currentPage]);

    const fetchReservations = (page) => {
        setLoading(true);
        api.get(`/api/reserve-admin?page=${page}&limit=7`)
            .then(response => {
                setReservations(response.data.data); // อัพเดทข้อมูลการจองจาก API
                setCurrentPage(response.data.currentPage); // หน้าปัจจุบัน
                setTotalPages(response.data.totalPages); // จำนวนหน้าทั้งหมด
                setLoading(false); // สิ้นสุดการโหลดข้อมูล
            })
            .catch(error => {
                console.error("Error fetching reservation data:", error);
                setLoading(false); // สิ้นสุดการโหลดข้อมูลเมื่อเกิดข้อผิดพลาด
            });
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-12 pt-3 d-flex justify-content-center">
                        <h1>เช็ครายการจอง</h1>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xl-1 col-lg-1 col-md-0"></div>
                    <div className="col-xl-10 col-lg-2 col-md-2 pt-3">
                        <table className="table table-striped table-hover border">
                            <thead>
                                <tr>
                                    <th>&nbsp;</th>
                                    <th>ผู้จอง</th>
                                    <th>รหัส</th>
                                    <th>วันที่จอง</th>
                                    <th>วันที่รับสุนัข</th>
                                    <th>เวลา</th>
                                    <th style={{ width: "15%" }}>&nbsp;</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservations.length > 0 ? (
                                    reservations.map((reservation, index) => {
                                        // แยก array ของ image_url อย่างระมัดระวัง
                                        const rawImageUrls = reservation.image_url || '[]';
                                        const imageUrls = rawImageUrls.replace(/^\[|\]$/g, '').split(',').map(url => url.trim().replace(/['"]+/g, ''));
                                        const firstImage = imageUrls[0] ? (imageUrls[0].startsWith('http') ? `${imageUrls[0]}` : `${apiUrl}${imageUrls[0]}`) : logo; // เลือกรูปแรก หรือใช้รูป default

                                        return (
                                            <tr key={index} className="center-table">
                                                <td className="text-center">
                                                    <img src={firstImage} alt="Dog" height="80" className="d-inline-block align-text-top" />
                                                </td>
                                                <td>
                                                    {reservation.firstname} {reservation.lastname}<br />
                                                    {reservation.user_email}<br />
                                                    {reservation.phone}
                                                </td>
                                                <td>{reservation.dog_id}</td>
                                                <td>{new Date(reservation.created_at).toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })}</td>
                                                <td>{new Date(reservation.booking_date).toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })}</td>
                                                <td>{reservation.pickup_date ? reservation.pickup_date.slice(0, 5) : 'N/A'} น.</td>
                                                <td>
                                                    <div>
                                                        <Link to={`/admin/reserve/${reservation.booking_id}`} className="btn btn-warning" style={{ width: "100%" }}>
                                                            รายละเอียด
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center">ไม่มีข้อมูลการจอง</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </>
    );
}

export default Reserveadmin;
