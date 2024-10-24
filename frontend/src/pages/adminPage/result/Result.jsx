import React, { useEffect, useState } from 'react';
import { print, search } from '../../../assets/';
import api from '../../../config/apiConfig';
import { formatPrice } from '../../../utils/formatPrice';
import { PDFDownloadLink } from '@react-pdf/renderer';
import Invoice from '../../../components/receipt/Receipt';
import Pagination from '../../../components/pagination/Pagination';

function Result() {
    const [reservations, setReservations] = useState([]); // state สำหรับเก็บข้อมูลการจอง
    const [loading, setLoading] = useState(true); // สถานะการโหลดข้อมูล
    const [error, setError] = useState(null); // สถานะข้อผิดพลาด
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // ดึงข้อมูลจาก API
    useEffect(() => {
        fetchReservations(currentPage, startDate, endDate);
    }, [currentPage, startDate, endDate]);

    const fetchReservations = (page, startDate, endDate) => {
        let url = `/api/result-admin?page=${page}&limit=10`;
        if (startDate && endDate) {
            url += `&startDate=${startDate}&endDate=${endDate}`;
        }

        api.get(url)
            .then(response => {
                setReservations(response.data.data);
                setCurrentPage(response.data.currentPage);
                setTotalPages(response.data.totalPages);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching reservation data:", error);
                setError('Error fetching data.');
                setLoading(false);
            });
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchReservations(1, startDate, endDate);
    };

    const handleDateChange = (e, type) => {
        const value = e.target.value;
        if (type === 'start') {
            setStartDate(value);
        } else {
            setEndDate(value);
        }
        setCurrentPage(1); // รีเซ็ตหน้าเป็นหน้าแรกเมื่อมีการเปลี่ยนแปลงวันที่
    };

    if (loading) {
        return <div className="container"><p>Loading...</p></div>;
    }

    if (error) {
        return <div className="container"><p>{error}</p></div>;
    }

    return (
        <>
            <div className="container-fulid">
                <div className="row">
                    <div className="col-12 pt-3 d-flex justify-content-center">
                        <h1>สรุปยอด</h1>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xl-2 col-lg-2 col-md-2 col-2">
                        <label className="form-label">ตั้งแต่วันที่</label>
                        <input 
                            className="form-control" 
                            type="date" 
                            value={startDate} 
                            onChange={(e) => handleDateChange(e, 'start')}
                        />

                    </div>
                    <div className="col-xl-2 col-lg-2 col-md-2 col-2">
                        <label className="form-label">ถึง</label>
                        <input 
                            className="form-control" 
                            type="date" 
                            value={endDate} 
                            onChange={(e) => handleDateChange(e, 'end')}
                        />
                    </div>
                    {/* <div className="col-xl-1 d-flex align-items-end" style={{ cursor: 'pointer' }}>
                        <a class="btn btn-primary px-4" onClick={handleSearch} role="button">ค้นหา</a>
                    </div> */}
                </div>

                <div className="row">
                    <div className="col-xl-11 col-lg-2 col-md-2 pt-3">
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
                                    <th style={{ width: '3%' }}>ใบเสร็จการจอง</th>
                                    <th style={{ width: '3%' }}>ใบเสร็จการรับ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservations.length > 0 ? (
                                    reservations.map((reservation, index) => (
                                        <tr key={index}>
                                            <td className="text-center">{reservation.booking_id}</td>
                                            <td>{reservation.firstname} {reservation.lastname}</td>
                                            <td>{new Date(reservation.created_at).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            })}</td>
                                            <td>{new Date(reservation.booking_date).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            })}</td>
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
                                            <td>{formatPrice(reservation.price)}</td> {/* แก้ไขตามการคำนวณรวม */}
                                            <td>{formatPrice(reservation.price)}</td> {/* แก้ไขตามการคำนวณรวม */}
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
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </>
    );
}

export default Result;
