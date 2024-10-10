import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Pay() {
    const location = useLocation();
    const navigate = useNavigate();
    const { price, dog_id, date, time, phone } = location.state || {};
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // For error messages

    const handleBooking = async () => {
        const user_id = localStorage.getItem('user_id'); // Retrieve user_id from localStorage
        // console.log('Booking Data:', {
        //     user_id: parseInt(user_id, 10),
        //     dog_id: parseInt(dog_id, 10),
        //     booking_date: date,
        //     pickup_date: time,
        // });
        setLoading(true);
        setError(null); // Reset error state before making the request

        try {
            // เตรียมข้อมูลที่จะส่งไปยัง Backend
            const bookingData = {
                user_id: parseInt(user_id),
                dog_id: parseInt(dog_id),
                booking_date:date, 
                pickup_date:time,  
                phone:phone,
            };

            // ส่ง POST request ไปยัง Backend
            const response = await axios.post('http://localhost:5000/api/book', bookingData);

            if (response.status === 200) {
                // การจองสำเร็จ
                alert('การจองสำเร็จ!');
                // นำทางไปยังหน้าถัดไป หรือรีเฟรชหน้า
                navigate('/cancle'); 
            } else {
                // จัดการกับสถานะที่ไม่ใช่ 200
                setError('การจองไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
            }
        } catch (error) {
            setError('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์'); // Handle error
            console.error('Error:', error);
        } finally {
            setLoading(false); // Always set loading to false at the end
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-xl-11 pt-3">
                    <h1>ชำระเงิน</h1>
                </div>
            </div>

            <div className="row bg-grey pt-5">
                <div className="col-12 d-flex justify-content-center">
                    <div className="bg-white">
                        <img className="setting-pic-pay" height="300" src="image/pay.png" alt="Payment" />
                        {/* QR code here */}
                    </div>
                </div>

                <div className="col-12 d-flex justify-content-center pt-3">
                    <h4>ราคาทั้งหมด {price} THB</h4>
                </div>
                <div className="col-12 d-flex justify-content-center pt-3">
                    <p>(ชำระเงิน ชำระอีก 50% ในวันที่เดินทางมารับสุนัข)</p>
                </div>

                {error && (
                    <div className="col-12 d-flex justify-content-center py-3">
                        <p className="text-danger">{error}</p>
                    </div>
                )}

                <div className="col-12 d-flex justify-content-center py-3">
                    <button 
                        type="button" 
                        className="btn btn-primary setting-btn-reserve" 
                        id="confirmPayment"
                        onClick={handleBooking} // Call the function on click
                        disabled={loading}
                    >
                        {loading ? 'กำลังดำเนินการ...' : 'ยืนยันการชำระเงิน'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Pay;
