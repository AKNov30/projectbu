import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { apiUrl } from '../../../config/apiConfig';
import ImageModal from '../../../components/ImageModal/ImageModal';
import { AlertSave, AlertDelete } from '../../../components/alert/Alert';
import { formatPrice } from '../../../utils/formatPrice';

const Reserveinfo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reservationDetails, setReservationDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [validate, setValidate] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImageUrl, setModalImageUrl] = useState('');

    useEffect(() => {
        api.get(`/api/reserve-admin/${id}`)
            .then(response => {
                setReservationDetails(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching reservation details:", err);
                setError("Error fetching reservation details");
                setLoading(false);
            });
    }, [id]);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setValidate(null);
    };

    const handleConfirmReceive = async () => {
        if (!selectedFile) {
            alert("กรุณาอัปโหลดสลิป");
            return;
        }

        const formData = new FormData();
        formData.append('slip', selectedFile);
        formData.append('dogId', reservationDetails.dog_id);

        try {
            const response = await api.post(`/api/confirm-receive/${reservationDetails.booking_id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // alert(response.data.message);
            navigate('/admin/reserve-admin');
        } catch (err) {
            console.error("Error confirming receipt:", err);
            AlertSave("เกิดข้อผิดพลาดในการยืนยันการรับ");
        }
    };

    const cancelBooking = async (bookingId, dogId) => {
        try {
            const response = await api.put('/api/cancel-booking', {
                booking_id: bookingId,
                dog_id: dogId,
            });

            AlertSave("การจองถูกยกเลิกเรียบร้อยแล้ว");
            navigate('/admin/reserve-admin');
        } catch (err) {
            console.error("Error canceling booking:", err);
            alert("ไม่สามารถยกเลิกการจองได้ โปรดลองใหม่อีกครั้ง");
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!reservationDetails) {
        return <p>No reservation found.</p>;
    }

    // แปลง array ของ image_url ให้เป็นรูปแบบที่ถูกต้อง
    const imageUrls = reservationDetails.image_url.replace(/^\[|\]$/g, '').split(',').map(url => url.trim().replace(/['"]+/g, ''));
    const firstImageUrl = imageUrls.length > 0 ? `${apiUrl}${imageUrls[0]}` : 'default-image-path.png';

    const openModal = (imageUrl) => {
        setModalImageUrl(`${apiUrl}${imageUrl}`);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalImageUrl('');
    };

    return (
        <>
            <div className="row">
                <div className="col-12 pt-3 d-flex justify-content-center">
                    <h1>การจอง</h1>
                </div>
            </div>
            <div className="row bg-grey-reserve">
                <div className="col-xl-2 col-lg-2 col-md-3 pt-2 text-center">
                    <img
                        className="setting-pic-cancle just-flex-center img-fluid"
                        src={firstImageUrl}
                        alt="Dog"
                    />
                </div>

                <div className="col-xl-9 col-lg-12 col-md-12 d-flex align-items-center justify-content-between">
                    <div>
                        <div className="d-flex justify-content-center py-2" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                            ข้อมูลสุนัข
                        </div>
                        <div className="underline-pink d-flex justify-content-center"></div>
                        <div className="pt-2" style={{ fontSize: '16px' }}>
                            ชื่อ: {reservationDetails.dogs_name}<br />
                            ราคา: ฿ {formatPrice(reservationDetails.price)} บาท<br />
                            รหัส: {reservationDetails.dog_id}
                        </div>
                    </div>

                    <div>
                        <div className="d-flex justify-content-center py-2" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                        ข้อมูลผู้จอง
                        </div>
                        <div className="underline-pink d-flex justify-content-center"></div>
                        <div className="pt-2" style={{ fontSize: '16px' }}>
                            {reservationDetails.firstname} {reservationDetails.lastname}<br />
                            {reservationDetails.user_email}<br />
                            {reservationDetails.phone}
                        </div>
                    </div>

                    <div>
                        <div className="d-flex justify-content-center py-2" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                        รายละเอียดการจอง
                        </div>
                        <div className="underline-pink d-flex justify-content-center"></div>
                        <div className="pt-2" style={{ fontSize: '16px' }}>
                            วันที่จอง: {new Date(reservationDetails.created_at).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                            })}<br />
                            วันที่รับ: {new Date(reservationDetails.booking_date).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                            })}<br />
                            เวลาที่รับ: {reservationDetails.pickup_date.slice(0, 5)} น.<br />
                        </div>
                    </div>

                    <div>
                        <div className="d-flex justify-content-center py-2" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                        ราคา
                        </div>
                        <div className="underline-pink d-flex justify-content-center"></div>
                        <div className="pt-2" style={{ fontSize: '16px' }}>
                            ราคาการจอง: {formatPrice(reservationDetails.price/2)} บาท<br />
                            {reservationDetails.slip_url ? (
                            <>
                                <a
                                    className="text-primary"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => openModal(reservationDetails.slip_url)}
                                >
                                    หลักฐานการจอง
                                </a>
                            </>
                        ) : (
                            <a className="text-danger" style={{ cursor: 'no-drop' }}>ยังไม่ได้ชำระการจอง</a>
                        )}
                        </div>
                    </div>

                    <div>
                    
                    <AlertDelete
                        onDelete={() => cancelBooking(reservationDetails.booking_id, reservationDetails.dog_id)}
                        title="คุณแน่ใจที่จะยกเลิกการจอง?"
                        text="การยกเลิกการจองจะไม่สามารถคืนเงินจองได้"
                        confirmText="ยกเลิกการจอง"
                        successTitle="ยกเลิกการจองเสร็จสิ้น"
                        successText=" "
                    >
                        <div class="px-2">
                            <button type="button" className="btn btn-danger setting-btn-reserve" id="cancelreserve">
                                ยกเลิกจอง
                            </button>
                        </div>
                        
                    </AlertDelete>
                    </div>

                </div>
                <div className="col-xl-3 col-lg-5 col-md-5 d-flex justify-content-center align-items-center">
                    <div className="py-2">
                        <label htmlFor="formFile">แนบหลักฐานการโอน</label>
                        <div class="text-red">ราคาที่ต้องชำระ : {formatPrice(reservationDetails.price/2)} บาท</div>
                        <input className="form-control" type="file" id="formFile" onChange={handleFileChange} />
                    </div>
                </div>
                <div className="col-xl-5 col-lg-5 col-md-5 d-flex justify-content-start align-items-end py-2">
                    <AlertSave
                        onConfirm={() => {
                            if (!selectedFile) {
                                setValidate("กรุณาอัปโหลดสลิป");
                                return false
                            } else {
                                handleConfirmReceive();
                            }
                        }}
                        title={"ยืนยันการรับสุนัข?"}
                        confirmText={"ยืนยัน"}
                        failMessage={"ไม่สำเร็จ"}
                        successMessage={"สำเร็จ"}
                    >
                        <button type="button" className="btn btn-success setting-btn-reserve" id="confirmreserve">
                            ยืนยันการรับ
                        </button>
                    </AlertSave>
                </div>
            </div>
            {validate && (
                <div className="alert alert-danger mt-3" role="alert">
                    {validate}
                </div>
            )}


            {/* Modal slip */}
            <ImageModal
                isOpen={isModalOpen}
                imageUrl={modalImageUrl}
                onClose={closeModal}
            />
        </>
    );
};

export default Reserveinfo;
