import React, { useEffect, useState } from 'react';
import { logo } from '../../assets';

function ChangeDate() {
    const [reservations, setReservations] = useState([]);
    const [timeSelections, setTimeSelections] = useState({});

    useEffect(() => {
        fetch('http://localhost:5000/api/change-date')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
                }
                return response.json();  // แปลงข้อมูลที่ได้เป็น JSON
            })
            .then((data) => {
                setReservations(data);  // เก็บข้อมูลการจองใน state
            })
            .catch((error) => {
                console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);  // แสดงข้อผิดพลาด
            });
    }, []);

    // ฟังก์ชันจัดการเมื่อเวลาเปลี่ยนแปลง
    const handleTimeChange = (e, bookingId) => {
        const newTimeSelections = { ...timeSelections, [bookingId]: e.target.value };
        setTimeSelections(newTimeSelections);  // อัปเดตเวลาที่เลือกสำหรับแต่ละรายการ
    };

    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-1"></div>
                    <div className="col-11 pt-3 d-flex justify-content-center">
                        <h1>เลื่อนวันรับ</h1>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xl-1 col-lg-1 col-md-0"></div>
                    <div className="col-xl-10 col-lg-2 col-md-2 pt-3">
                        <table className="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th className="text-center" style={{ width: '80px' }}>&nbsp;</th>
                                    <th style={{ width: '200px' }}>ผู้จอง</th>
                                    <th style={{ width: '100px' }}>รหัส</th>
                                    <th style={{ width: '120px' }}>วันจอง</th>
                                    <th style={{ width: '120px' }}>วันที่รับ</th>
                                    <th style={{ width: '120px' }}>เวลาที่รับ</th>
                                    <th style={{ width: '120px' }}>เลื่อนวันที่เป็น</th>
                                    <th style={{ width: '120px' }}>เลื่อนเวลาเป็น</th>
                                    <th style={{ width: '80px' }}>&nbsp;</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservations.map((reservation) => {
                                    let imageUrlArray = [];

                                    // ตรวจสอบว่า image_url เป็นสตริงธรรมดาหรือมีรูปหลายรูป
                                    if (reservation.image_url.includes('[') && reservation.image_url.includes(']')) {
                                        // แยกรูปภาพออกจากสตริง JSON ที่ไม่สมบูรณ์
                                        const extractedUrls = reservation.image_url.match(/"(.*?)"/g);
                                        if (extractedUrls) {
                                            imageUrlArray = extractedUrls.map(url => url.replace(/"/g, ''));
                                        }
                                    } else {
                                        // ถ้า image_url เป็นสตริงธรรมดา
                                        imageUrlArray = [reservation.image_url];
                                    }

                                    // ใช้รูปแรกจากอาเรย์ ถ้าไม่มีให้ใช้รูปสำรอง
                                    const firstImageUrl = imageUrlArray.length > 0 ? imageUrlArray[0] : logo;

                                    return (
                                        <tr key={reservation.booking_id}>
                                            <td className="text-center">
                                                <img
                                                    src={firstImageUrl}  // ใช้รูปแรกจากอาเรย์
                                                    onError={(e) => { e.target.src = logo; }}  // ถ้าภาพหลักโหลดไม่ได้ ใช้โลโก้แทน
                                                    alt={reservation.dogs_name}
                                                    height="80"
                                                    className="d-inline-block align-text-top"
                                                />
                                            </td>
                                            <td>
                                                {reservation.firstname} {reservation.lastname}<br />
                                                {reservation.user_email}<br />
                                                {reservation.phone}
                                            </td>
                                            <td>{reservation.dog_id}</td>
                                            <td>{new Date(reservation.created_at).toLocaleDateString()}</td>
                                            <td>{new Date(reservation.booking_date).toLocaleDateString()}</td>
                                            <td>
                                                {reservation.pickup_date ? reservation.pickup_date.slice(0, 5) : 'N/A'}
                                            </td>


                                            <td>
                                                <input className="form-control" type="date" placeholder="เปลี่ยนวันที่" />
                                            </td>
                                            <td>
                                                <select
                                                    className="form-select"
                                                    value={timeSelections[reservation.booking_id] || ""}  // แสดงเวลาที่เลือกสำหรับแต่ละรายการ
                                                    onChange={(e) => handleTimeChange(e, reservation.booking_id)}  // อัปเดตเวลา
                                                >
                                                    <option value="">เลือกเวลา</option>
                                                    <option value="10:00">10:00 น</option>
                                                    <option value="10:30">10:30 น</option>
                                                    <option value="11:00">11:00 น</option>
                                                    <option value="11:30">11:30 น</option>
                                                    <option value="12:00">12:00 น</option>
                                                    <option value="12:30">12:30 น</option>
                                                    <option value="13:00">13:00 น</option>
                                                    <option value="13:30">13:30 น</option>
                                                    <option value="14:00">14:00 น</option>
                                                    <option value="14:30">14:30 น</option>
                                                </select>
                                            </td>
                                            <td>
                                                <button type="button" className="btn btn-success" style={{ width: '100%' }}>บันทึก</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ChangeDate;
