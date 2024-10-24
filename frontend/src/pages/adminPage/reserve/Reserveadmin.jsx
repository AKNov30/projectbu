import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { apiUrl } from '../../../config/apiConfig';
import { logo } from '../../../assets';
import Pagination from '../../../components/pagination/Pagination';

function Reserveadmin() {
    const [reservations, setReservations] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // ดึงข้อมูลจาก API 
    useEffect(() => {
        fetchReservations(currentPage);
    }, [currentPage]);

    const fetchReservations = (page) => {
        api.get(`/api/reserve-admin?page=${page}&limit=7`)
            .then(response => {
                setReservations(response.data.data); // อัพเดทข้อมูลการจองจาก API
                setCurrentPage(response.data.currentPage); // หน้าปัจจุบัน
                setTotalPages(response.data.totalPages); // จำนวนหน้าทั้งหมด
            })
            .catch(error => {
                console.error("Error fetching reservation data:", error);
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
                        <table className="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th style={{ width: "3%" }}>&nbsp;</th>
                                    <th style={{ width: "15%" }}>ผู้จอง</th>
                                    <th style={{ width: "3%" }}>รหัส</th>
                                    <th style={{ width: "3%" }}>วันจอง</th>
                                    <th style={{ width: "3%" }}>วันที่รับ</th>
                                    <th style={{ width: "3%" }}>เวลา</th>
                                    <th style={{ width: "3%" }}>&nbsp;</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservations.length > 0 ? (
                                    reservations.map((reservation, index) => {
                                        // แยก array ของ image_url อย่างระมัดระวัง
                                        const rawImageUrls = reservation.image_url || '[]';
                                        const imageUrls = rawImageUrls.replace(/^\[|\]$/g, '').split(',').map(url => url.trim().replace(/['"]+/g, ''));
                                        const firstImage = imageUrls[0] ? `${apiUrl}${imageUrls[0]}` : logo; // เลือกรูปแรก หรือใช้รูป default

                                        return (
                                            <tr key={index}>
                                                <td className="text-center">
                                                    <img src={firstImage} alt="Dog" height="80" className="d-inline-block align-text-top" />
                                                </td>
                                                <td>
                                                    {reservation.firstname} {reservation.lastname}<br />
                                                    {reservation.user_email}<br />
                                                    {reservation.phone}
                                                </td>
                                                <td>{reservation.booking_id}</td>
                                                <td>{new Date(reservation.created_at).toLocaleDateString('th-TH', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })}</td>
                                                <td>{new Date(reservation.booking_date).toLocaleDateString('th-TH', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })}</td>
                                                <td>{reservation.pickup_date ? reservation.pickup_date.slice(0, 5) : 'N/A'}</td>
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
