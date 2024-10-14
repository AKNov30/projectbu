import React from 'react';
import { useParams } from 'react-router-dom';

import { dogBrown } from '../../../assets/'

const Reserveinfo = () => {
    // Access the parameters from the URL
    const { id } = useParams(); // Assuming your URL has a parameter named `id`

    // You can fetch the reservation details based on the `id`
    // For demonstration purposes, let's create a mock object
    const reservationDetails = {
        dog: {
            name: "ปั๊กสีน้ำตาลธรรมชาติ",
            price: 4500,
            code: "BRP01",
            imageUrl: dogBrown
        },
        user: {
            name: "สิทธิโชค จันทร์ทรง",
            email: "Sittichok.Juns@bumail.net",
            phone: "087-994-8760"
        },
        booking: {
            bookingDate: "29/11/2023",
            pickupDate: "30/11/2023",
            pickupTime: "14:30"
        },
        priceDetails: {
            originalPrice: 4500,
            discount: 2250,
            total: 2250
        }
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
                        src={reservationDetails.dog.imageUrl}
                        alt="Dog"
                    />
                </div>
                <div className="col-xl-2 col-lg-3 col-md-3 pt-4">
                    <h3 className="font-weight-bold">รายละเอียดสุนัข</h3>
                    <p className="font-weight-normal">
                        ชื่อ: {reservationDetails.dog.name}<br />
                        ราคา: ฿ {reservationDetails.dog.price} THB<br />
                        รหัส: {reservationDetails.dog.code}
                    </p>
                </div>
                <div className="col-xl-2 col-lg-3 col-md-3 pt-4">
                    <h3 className="font-weight-bold">ข้อมูลผู้จอง</h3>
                    <p className="font-weight-normal">
                        {reservationDetails.user.name}<br />
                        {reservationDetails.user.email}<br />
                        {reservationDetails.user.phone}
                    </p>
                </div>
                <div className="col-xl-2 col-lg-2 col-md-3 pt-4">
                    <h3 className="font-weight-bold">ข้อมูลการจอง</h3>
                    <p className="font-weight-normal">
                        วันที่จอง: {reservationDetails.booking.bookingDate}<br />
                        วันที่รับ: {reservationDetails.booking.pickupDate}<br />
                        เวลาที่รับ: {reservationDetails.booking.pickupTime}<br />
                    </p>
                </div>
                <div className="col-xl-2 col-lg-2 col-md-3 pt-4">
                    <h3 className="font-weight-bold">ราคา</h3>
                    <p className="font-weight-normal">
                        ราคา: {reservationDetails.priceDetails.originalPrice} THB<br />
                        ส่วนลด: {reservationDetails.priceDetails.discount} THB<br />
                        รวมเป็น: {reservationDetails.priceDetails.total} THB<br />
                    </p>
                </div>
                <div className="col-xl-2 col-lg-3 col-md-3 d-flex justify-content-end align-items-center">
                    <button type="button" className="btn btn-danger setting-btn-reserve" id="cancelreserve">
                        ยกเลิกจอง
                    </button>
                </div>
                <div className="col-xl-2 col-lg-3 col-md-3 d-flex justify-content-center align-items-center">
                    <button type="button" className="btn btn-success setting-btn-reserve" id="confirmreserve">
                        ยืนยันการรับ
                    </button>
                </div>
                <div className="col-xl-3 col-lg-4 col-md-3">
                    <div className="pt-2">
                        <label htmlFor="formFile" className="form-label">แนบหลักฐานการโอน</label>
                        <input className="form-control" type="file" id="formFile" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Reserveinfo;
