import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { apiUrl } from '../../../config/apiConfig';
import { logo } from '../../../assets';

function Reserveadmin() {
    const [reservations, setReservations] = useState([]); // state สำหรับเก็บข้อมูลการจอง

    // ดึงข้อมูลจาก API 
    useEffect(() => {
        api.get('/api/reserve-admin')
            .then(response => {
                setReservations(response.data); // อัพเดทข้อมูลการจองจาก API
            })
            .catch(error => {
                console.error("Error fetching reservation data:", error);
            });
    }, []);

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
            </div>
        </>
    );
}

export default Reserveadmin;
