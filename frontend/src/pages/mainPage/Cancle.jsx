import React, { useState, useEffect } from 'react';
import api, { apiUrl } from '../../config/apiConfig';
import { AlertSave, AlertDelete } from '../../components/alert/Alert';
import { formatPrice } from '../../utils/formatPrice';

function Cancle() {
    const [bookingData, setBookingData] = useState(null);
    const [selectedSlip, setSelectedSlip] = useState(null); // เก็บไฟล์ที่เลือก
    const [error, setError] = useState(null);

    useEffect(() => {
        const user_id = localStorage.getItem('user_id'); // ดึง user_id จาก localStorage

        // ดึงข้อมูลการจองของผู้ใช้จาก API
        const fetchBookingData = async () => {
            try {
                const response = await api.get(`/api/user-dogs`, {
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

    const handleFileChange = (e) => {
        setSelectedSlip(e.target.files[0]); // เก็บไฟล์ที่ผู้ใช้เลือกไว้ใน state
    };

    const handleUploadSlip = async (bookingId) => {
        if (!selectedSlip) {
            alert('กรุณาอัปโหลดสลิป');
            return;
        }

        const formData = new FormData();
        formData.append('slip', selectedSlip); // เพิ่มไฟล์สลิปลงใน FormData

        try {
            const response = await api.post(`/api/upload-slip/${bookingId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSelectedSlip(null); // เคลียร์ไฟล์ที่อัปโหลด
        } catch (error) {
            console.error('Error uploading slip:', error);
            alert('เกิดข้อผิดพลาดในการอัปโหลดสลิป');
        }
    };


    const handleCancelBooking = async (bookingId, dogId) => {
        try {
            await api.put(`/api/cancel-booking`, {
                booking_id: bookingId,
                dog_id: dogId,
            });
            // ดึงข้อมูลการจองใหม่หลังจากยกเลิกสำเร็จ
            const user_id = localStorage.getItem('user_id');
            const response = await api.get(`/api/user-dogs`, {
                params: { user_id }
            });
            setBookingData(response.data);
        } catch (error) {
            console.error('Error canceling booking:', error);
        }
    };

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
                    <div className="col-xl-12 col-lg-2 py-4 d-flex justify-content-center">
                        <h2>รายละเอียดการจอง</h2>
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
                            <div className="col-xl-2 col-lg-2 col-md-3 d-flex align-items-center justify-content-center">
                                <img
                                    className="setting-pic-cancle just-flex-center img-fluid"
                                    src={imageUrls.length > 0 ? `${apiUrl}${imageUrls[0]}` : dogBrown} // ใช้รูปแรกจาก array หรือรูปสำรอง
                                    alt="dog"
                                />
                            </div>
                            
                            <div className="col-xl-7 col-lg-2 col-md-2 d-flex align-items-center justify-content-between">
                                <div>
                                    <div className="d-flex justify-content-center pb-2" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                        ข้อมูลสุนัข
                                    </div>
                                    <div className="underline-pink d-flex justify-content-center"></div>
                                    <div className="pt-2" style={{ fontSize: '16px' }}>
                                        รหัส : {booking.dog_id}<br />
                                        ชื่อสุนัข : {booking.dogs_name}<br />
                                        ราคาสุนัข : {formatPrice(booking.price)} THB
                                    </div>
                                </div>

                                <div>
                                    <div className="d-flex justify-content-center pb-2" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                        ข้อมูลผู้จอง
                                    </div>
                                    <div className="underline-pink d-flex justify-content-center"></div>
                                    <div className="pt-2" style={{ fontSize: '16px' }}>
                                        ผู้จอง: {booking.firstname} {booking.lastname}<br />
                                        อีเมล: {booking.user_email}<br />
                                        เบอร์: {booking.phone}
                                    </div>
                                </div>

                                <div>
                                    <div className="d-flex justify-content-center pb-2" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                        ข้อมูลการจอง
                                    </div>
                                    <div className="underline-pink d-flex justify-content-center"></div>
                                    <div className="pt-2" style={{ fontSize: '16px' }}>
                                        วันที่จอง : {formatDate(booking.created_at)}<br />
                                        วันที่รับ : {formatDate(booking.booking_date)} ({formatTime(booking.pickup_date)} น.)<br/>
                                        สถานะ : {booking.status === 'pending' ? 'รอดำเนินการ' : 'yess'}
                                    </div>
                                </div>

                                <div>
                                    <div className="d-flex justify-content-center pb-2" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                        สรุป
                                    </div>
                                    <div className="underline-pink d-flex justify-content-center"></div>
                                    
                                    <div className="pt-2" style={{ fontSize: '16px'}}>
                                        ค่าจอง : {formatPrice(booking.price / 2)}<br/>
                                    </div>
                                    <div style={{ fontSize: '16px'}}>
                                        ส่วนลด : 0<br />
                                    </div>
                                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'red'}}>
                                        รวมเป็น : {formatPrice(booking.price / 2)}
                                    </div>
                                </div>
                            </div>


                            <div className="col-xl-3 col-lg-2 col-md-3 d-flex align-items-center justify-content-center">
                                <div>
                                    {booking.slip_url === null ? (
                                        <>
                                            <label htmlFor="formFileSm" className="form-label m-0 text-danger">อัปโหลดสลิป</label>
                                            <input className="form-control form-control-sm mb-2" id="formFileSm" type="file" onChange={handleFileChange} />
                                            <AlertSave
                                                onConfirm={() => handleUploadSlip(booking.booking_id)}
                                                title={"ยืนยันที่จะส่งสลิป?"}
                                                confirmText={"ยืนยัน"}
                                                successMessage={"อัพโหลดสำเร็จ"}
                                            >
                                                <button type="button" className="btn btn-success">
                                                    ยืนยัน
                                                </button>
                                            </AlertSave>
                                        </>
                                    ) : (
                                        <div className="pb-2">
                                            <p className="m-0 p-0 text-success">สลิปได้ถูกอัปโหลดแล้ว</p>
                                        </div>
                                    )}
                                    <AlertDelete
                                        onDelete={() => handleCancelBooking(booking.booking_id, booking.dog_id)} // ฟังก์ชันที่จะถูกเรียกเมื่อผู้ใช้ยืนยันการลบ
                                        title="คุณแน่ใจที่จะยกเลิกการจอง?" // ข้อความถามการยืนยัน
                                        text="การยกเลิกการจองจะไม่สามารถคืนเงินจองได้"
                                        confirmText="ยกเลิกการจอง"
                                        successTitle="ยกเลิกการจองเสร็จสิ้น"
                                    >
                                        <button type="button" className="btn btn-danger mx-2">
                                            ยกเลิกการจอง
                                        </button>
                                    </AlertDelete>

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