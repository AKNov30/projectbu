import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Cancle() {
    const [bookingData, setBookingData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const user_id = localStorage.getItem('user_id'); // ดึง user_id จาก localStorage

        // ดึงข้อมูลการจองของผู้ใช้จาก API
        const fetchBookingData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/user-dogs`, {
                    params: { user_id }
                });
                setBookingData(response.data); // เก็บข้อมูลการจองไว้ใน state
            } catch (error) {
                console.error('Error fetching booking data:', error);
                setError('เกิดข้อผิดพลาดในการดึงข้อมูลการจอง');
            }
        };

        fetchBookingData();
    }, []);

    if (error) {
        return <div>{error}</div>; // แสดงข้อความ error ถ้ามีข้อผิดพลาดในการดึงข้อมูล
    }

    if (!bookingData) {
        return <div>กำลังโหลดข้อมูลการจอง...</div>; // แสดงข้อความ "กำลังโหลด" ขณะดึงข้อมูล
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const formatTime = (timeString) => {
        const date = new Date(`1970-01-01T${timeString}`); // ใช้วันที่เริ่มต้นเพื่อสร้างเวลา
        return date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };
    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-1"></div>
                    <div className="col-xl-2 col-lg-2 pt-3">
                        <h1>การจอง</h1>
                    </div>
                </div>

                {/* Start Card CSS */}
                {bookingData.map((booking, index) => {
                    let imageUrls = [];
                    try {
                        imageUrls = JSON.parse(booking.image_url); // ตรวจสอบและ parse image_url ให้เป็น array
                    } catch (error) {
                        console.error('Error parsing image_url:', error);
                    }

                    return (
                        <div className="row bg-grey mb-3" key={index}>
                            <div className="col-xl-1 col-lg-0 col-md-0"></div>
                            <div className="col-xl-2 col-lg-2 col-md-3 pt-2">
                                <img
                                    className="setting-pic-cancle just-flex-center img-fluid"
                                    src={imageUrls.length > 0 ? `http://localhost:5000${imageUrls[0]}` : dogBrown} // ใช้รูปแรกจาก array หรือรูปสำรอง
                                    alt="dog"
                                />
                            </div>
                            <div className="col-xl-2 col-lg-2 col-md-2" style={{ paddingTop: '35px' }}>
                                <div style={{ fontSize: '18px' }}>
                                    {booking.dogs_name}<br />
                                    ฿ {booking.price} THB<br />
                                    รหัส : {booking.dog_id}
                                </div>
                            </div>

                            <div className="col-xl-2 col-lg-3 col-md-4 pt-4">
                                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                                    ข้อมูลผู้จอง
                                </div>
                                <div style={{ fontSize: '18px' }}>
                                    ผู้จอง: {booking.firstname} {booking.lastname}<br />
                                    อีเมล: {booking.user_email}<br />
                                    เบอร์: {booking.phone}
                                </div>
                            </div>

                            <div className="col-xl-2 col-lg-3 col-md-3 pt-4">
                                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                                    ข้อมูลการจอง
                                </div>
                                <div style={{ fontSize: '18px' }}>
                                    วันที่จอง : {formatDate(booking.created_at)}<br />
                                    วันที่รับ : {formatDate(booking.booking_date)}<br />
                                    เวลาที่รับ : {formatTime(booking.pickup_date)}<br />
                                    สถานะ : {booking.status}
                                </div>
                            </div>

                            <div className="col-xl-3 col-lg-2 col-md-3 py-4">
                                <div style={{ fontSize: '18px', paddingLeft: '30px' }}>
                                    ค่าจอง : {booking.price / 2}<br />
                                </div>
                                <div style={{ fontSize: '18px', paddingLeft: '30px' }}>
                                    ส่วนลด : 0<br />
                                </div>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'red', paddingLeft: '30px' }}>
                                    รวมเป็น : {booking.price / 2}
                                </div>
                                <div className="col-6 ">
                                {booking.slip_url === null ? (
                                    <>
                                        <label htmlFor="formFileSm" className="form-label m-0 text-danger">อัปโหลดสลิป</label>
                                        <input className="form-control form-control-sm" id="formFileSm" type="file" />
                                        <button type="button" className="btn btn-success m-1">
                                            ยืนยัน
                                        </button>
                                    </>
                                ) : (
                                    <div className="pt-1">
                                        <p className="m-0 p-0 text-success">สลิปได้ถูกอัปโหลดแล้ว</p>
                                    </div>
                                )}

                                    <button type="button" className="btn btn-danger">
                                        ยกเลิกการจอง
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {/* End Card CSS */}
            </div>
        </>
    )
}

export default Cancle