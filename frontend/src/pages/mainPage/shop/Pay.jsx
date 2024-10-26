import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertSave } from '../../../components/alert/Alert';
import api from '../../../config/apiConfig';
import { formatPrice } from '../../../utils/formatPrice';

function Pay() {
    const location = useLocation();
    const navigate = useNavigate();
    const { price, dog_id, date, time, phone } = location.state || {};
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [qrCodeUrl, setQrCodeUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null); // เก็บข้อมูลไฟล์ที่ถูกอัปโหลด

    // ฟังก์ชันดึง QR Code จาก API ฝั่งเซิร์ฟเวอร์
    useEffect(() => {
        const generateQRCode = async () => {
            try {
                const response = await api.post('/api/generate-qr', {
                    price,
                    promptpayNumber: '0910586742' // เบอร์พร้อมเพย์ที่จะใช้ในการชำระเงิน
                });

                setQrCodeUrl(response.data.qrCodeUrl);
            } catch (error) {
                console.error('Error generating QR Code:', error);
                setError('เกิดข้อผิดพลาดในการสร้าง QR Code');
            }
        };

        generateQRCode();
    }, [price]);

    // ฟังก์ชันจัดการการอัปโหลดไฟล์
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]); // เก็บไฟล์ที่ถูกเลือกใน state
    };

    const handleBooking = async () => {
        const user_id = localStorage.getItem('user_id');
        setLoading(true);
        setError(null);

        try {
            // เตรียมข้อมูลสำหรับการอัปโหลด
            const formData = new FormData();
            formData.append('user_id', parseInt(user_id));
            formData.append('dog_id', parseInt(dog_id));

            const localDate = new Date(date);
            localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
            const formattedDate = localDate.toISOString().split('T')[0];
            formData.append('booking_date', formattedDate);
            formData.append('pickup_date', time);
            formData.append('phone', phone);

            // ถ้ามีการเลือกไฟล์ ให้เพิ่มไฟล์เข้าไปใน formData
            if (selectedFile) {
                formData.append('slip', selectedFile); // เพิ่มไฟล์ที่เลือกเข้าไปใน formData
            }

            // ส่ง POST request ไปยัง Backend
            const response = await api.post('/api/book', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                navigate('/cancle');
            } else {
                setError('การจองไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
            }
        } catch (error) {
            setError('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
            console.error('Error:', error);
        } finally {
            setLoading(false);
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
                        {qrCodeUrl ? (
                            <img src={qrCodeUrl} alt="PromptPay QR Code" height="300" />
                        ) : (
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-12 d-flex justify-content-center pt-3">
                    <h4>ราคาทั้งหมด {formatPrice(price)} บาท</h4>
                </div>
                <div className="col-12 d-flex justify-content-center pt-3">
                    <p>(ผู้จองต้องชำระเงินเพิ่มอีก 50% ในวันที่มารับสุนัข)</p>
                </div>

                {/* Input สำหรับการอัปโหลดรูปสลิป */}
                <div className="col-12 d-flex justify-content-center py-3">
                    <div className="col-4">
                        <input
                            className="form-control"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={loading}
                        />
                    </div>
                </div>

                {error && (
                    <div className="col-12 d-flex justify-content-center py-3">
                        <p className="text-danger">{error}</p>
                    </div>
                )}

                <div className="col-12 d-flex justify-content-center py-3">
                    <AlertSave
                        onConfirm={handleBooking}
                        title={"คุณยืนยันหรือไม่ที่จะจองสุนัข?"}
                        confirmText={"ยืนยัน"}
                        failMessage={"เพิ่มไม่สำเร็จ"}
                        successMessage={"จองสำเร็จสำเร็จ"}>
                        <button
                            type="button"
                            className="btn btn-primary setting-btn-reserve"
                            id="confirmPayment"
                            disabled={loading}
                        >
                            {loading ? 'กำลังดำเนินการ...' : 'ยืนยันการชำระเงิน'}
                        </button>
                    </AlertSave>
                </div>
            </div>
        </div>
    );
}

export default Pay;
