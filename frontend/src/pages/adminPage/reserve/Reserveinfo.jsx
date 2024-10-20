import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { apiUrl } from '../../../config/apiConfig';
import ImageModal from '../../../components/ImageModal/ImageModal';
import { AlertSave, AlertDelete } from '../../../components/alert/Alert';

const Reserveinfo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reservationDetails, setReservationDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
                <div className="col-xl-2 col-lg-3 col-md-3 pt-4">
                    <h3 className="font-weight-bold">รายละเอียดสุนัข</h3>
                    <p className="font-weight-normal">
                        ชื่อ: {reservationDetails.dogs_name}<br />
                        ราคา: ฿ {reservationDetails.price} THB<br />
                        รหัส: {reservationDetails.dog_id}
                    </p>
                </div>
                <div className="col-xl-2 col-lg-3 col-md-3 pt-4">
                    <h3 className="font-weight-bold">ข้อมูลผู้จอง</h3>
                    <p className="font-weight-normal">
                        {reservationDetails.firstname} {reservationDetails.lastname}<br />
                        {reservationDetails.user_email}<br />
                        {reservationDetails.phone}
                    </p>
                </div>
                <div className="col-xl-2 col-lg-2 col-md-3 pt-4">
                    <h3 className="font-weight-bold">ข้อมูลการจอง</h3>
                    <p className="font-weight-normal">
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
                        เวลาที่รับ: {reservationDetails.pickup_date.slice(0, 5)}<br />
                    </p>
                </div>
                <div className="col-xl-2 col-lg-2 col-md-3 pt-4">
                    <h3 className="font-weight-bold">ราคา</h3>
                    <p className="font-weight-normal">
                        ราคา: {reservationDetails.price} THB<br />
                        รวมเป็น: {reservationDetails.price} THB<br />
                    </p>
                </div>
                <div className="col-xl-2 col-lg-3 col-md-3 d-flex justify-content-end align-items-center">
                    <AlertDelete
                        onDelete={() => cancelBooking(reservationDetails.booking_id, reservationDetails.dog_id)}
                        title="คุณแน่ใจที่จะยกเลิกการจอง?"
                        text="การยกเลิกการจองจะไม่สามารถคืนเงินจองได้"
                        confirmText="ยกเลิกการจอง"
                        successTitle="ยกเลิกการจองเสร็จสิ้น"
                    >
                        <button type="button" className="btn btn-danger setting-btn-reserve" id="cancelreserve">
                            ยกเลิกจอง
                        </button>
                    </AlertDelete>
                </div>
                <div className="col-xl-2 col-lg-3 col-md-3 d-flex justify-content-center align-items-center">
                    <button type="button" className="btn btn-success setting-btn-reserve" id="confirmreserve">
                        ยืนยันการรับ
                    </button>
                </div>
                <div className="col-xl-3 col-lg-4 col-md-3">
                    <div className="pt-2">
                        {reservationDetails.slip_url ? (
                            <>
                                <a
                                    className="text-primary"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => openModal(reservationDetails.slip_url)}
                                >
                                    สลิปการจอง
                                </a>
                            </>
                        ) : (
                            <a className="text-danger" style={{ cursor: 'no-drop' }}>ยังไม่ได้ชำระการจอง</a>
                        )}
                        <br />
                        <label htmlFor="formFile" className="form-label">แนบหลักฐานการโอน</label>
                        <input className="form-control" type="file" id="formFile" />
                    </div>

                </div>
            </div>

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
