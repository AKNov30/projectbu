import React from 'react';
import { Link } from 'react-router-dom';

function Reserveadmin() {
    const reservations = [
        {
            image: "dogbrown.png",
            name: "สิทธิโชค จันทร์ทรง",
            email: "Sittichok@juns@bumail.net",
            phone: "087-994-8760",
            code: "BRP02",
            bookingDate: "10/09/2024",
            pickupDate: "14/09/2024",
            time: "14.00"
        },
        {
            image: "dogblack.png",
            name: "สิทธิโชค จันทร์ทรง",
            email: "Sittichok@juns@bumail.net",
            phone: "087-994-8760",
            code: "BRP01",
            bookingDate: "10/09/2024",
            pickupDate: "14/09/2024",
            time: "14.00"
        }
    ];

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 pt-3 d-flex justify-content-center">
                    <h1>เช็ครายการจอง</h1>
                </div>
            </div>

            <div className="row">
                <div className="col-xl-1 col-lg-1 col-md-0"></div>
                <div className="col-xl-10 col-lg-2 col-md-2 pt-3">
                    <table className="table bg-grey border">
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
                            {reservations.map((reservation, index) => (
                                <tr key={index}>
                                    <td className="text-center">
                                        <img src={reservation.image} alt="Logo" height="80" className="d-inline-block align-text-top" />
                                    </td>
                                    <td>
                                        {reservation.name}<br />
                                        {reservation.email}<br />
                                        {reservation.phone}
                                    </td>
                                    <td>{reservation.code}</td>
                                    <td>{reservation.bookingDate}</td>
                                    <td>{reservation.pickupDate}</td>
                                    <td>{reservation.time}</td>
                                    <td>
                                        <div>
                                            <Link to={`/reserve/${reservation.code}`} className="btn btn-warning" style={{ width: "100%" }}>
                                                รายละเอียด
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Reserveadmin;
