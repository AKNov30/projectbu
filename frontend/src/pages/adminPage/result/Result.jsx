import React, { useEffect, useState } from 'react';
import { print, search } from '../../../assets/';
import api from '../../../config/apiConfig';
import { formatPrice } from '../../../utils/formatPrice';
import { PDFDownloadLink } from '@react-pdf/renderer';
import Invoice from '../../../components/receipt/Receipt';

function Result() {
    const [reservations, setReservations] = useState([]); // state สำหรับเก็บข้อมูลการจอง
    const [loading, setLoading] = useState(true); // สถานะการโหลดข้อมูล
    const [error, setError] = useState(null); // สถานะข้อผิดพลาด

    // ดึงข้อมูลจาก API
    useEffect(() => {
        api.get(`/api/result-admin`)
            .then(response => {
                setReservations(response.data); // อัพเดทข้อมูลการจองจาก API
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching reservation data:", error);
                setError('Error fetching data.');
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="container"><p>Loading...</p></div>;
    }

    if (error) {
        return <div className="container"><p>{error}</p></div>;
    }

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-12 pt-3 d-flex justify-content-center">
                        <h1>สรุปยอด</h1>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xl-2 col-lg-2 col-md-2 col-2">
                        <label className="form-label">ตั้งแต่วันที่</label>
                        <input className="form-control" type="text" id="datepicker" />
                    </div>
                    <div className="col-xl-2 col-lg-2 col-md-2 col-2">
                        <label className="form-label">ถึง</label>
                        <input className="form-control" type="text" id="datepicker2" />
                    </div>
                    <div className="col-xl-1 col-lg-1 col-md-1 col-1 mt-2" style={{ cursor: 'pointer' }}>
                        <img src={search} alt="Search" height="25" className="btn-search" />
                    </div>
                </div>

                <div className="row">
                    <div className="col-xl-12 col-lg-2 col-md-2 pt-3">
                        <table className="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th className="text-center" style={{ width: '1%' }}>รายการ</th>
                                    <th style={{ width: '8%' }}>ชื่อลูกค้า</th>
                                    <th style={{ width: '8%' }}>วันที่จอง</th>
                                    <th style={{ width: '8%' }}>วันที่ขาย</th>
                                    <th style={{ width: '3%' }}>รหัส</th>
                                    <th style={{ width: '12%' }}>ชื่อรายการ</th>
                                    <th style={{ width: '3%' }}>ราคา(บาท)</th>
                                    <th style={{ width: '3%' }}>ส่วนลด</th>
                                    <th style={{ width: '4%' }}>รวมเป็น</th>
                                    <th style={{ width: '3%' }}>ใบเสร็จ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservations.length > 0 ? (
                                    reservations.map((reservation, index) => (
                                        <tr key={index}>
                                            <td className="text-center">{index + 1}</td>
                                            <td>{reservation.firstname} {reservation.lastname}</td>
                                            <td>{new Date(reservation.created_at).toLocaleDateString()}</td>
                                            <td>{new Date(reservation.booking_date).toLocaleDateString()}</td>
                                            <td>{reservation.booking_id}</td>
                                            <td>{reservation.dogs_name}</td>
                                            <td>{formatPrice(reservation.price)}</td>
                                            <td>0</td>
                                            <td>{formatPrice(reservation.price)}</td> {/* แก้ไขตามการคำนวณรวม */}
                                            <td>
                                            <PDFDownloadLink 
                                                document={<Invoice reservation={reservation} />}
                                                fileName={`invoice-${reservation.booking_id}.pdf`}
                                                style={{ textDecoration: 'none', color: 'blue' }} // Optional styling
                                            >
                                                {({ loading }) => (loading ? 'Loading...' : <img src={print} alt="Print" style={{ width: '25px' }} />)}
                                            </PDFDownloadLink>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="10" className="text-center">ไม่มีข้อมูลการจอง</td>
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

export default Result;
