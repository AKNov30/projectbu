import React, { useState, useEffect } from 'react';
import { search } from '../../assets/';
import api from '../../config/apiConfig';
import { formatPrice } from '../../utils/formatPrice';
import Pagination from '../../components/pagination/Pagination';

function History() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ทั้งหมด');
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    useEffect(() => {
        fetchBookingData(currentPage, searchTerm, statusFilter);
    }, [currentPage, searchTerm, statusFilter]);

    // เพิ่ม useEffect สำหรับรีเซ็ต currentPage เมื่อ searchTerm หรือ statusFilter เปลี่ยนแปลง
    useEffect(() => {
        setCurrentPage(1); // รีเซ็ตหน้าไปที่ page 1 เมื่อ searchTerm หรือ statusFilter เปลี่ยนแปลง
    }, [searchTerm, statusFilter]);

    const fetchBookingData = async (page, searchTerm, statusFilter) => {
        const user_id = localStorage.getItem('user_id');
        
        try {
            const response = await api.get(`/api/history`, {
                params: { user_id, page, limit, searchTerm, statusFilter },
            });
            setBookings(response.data.data);
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching booking data:', error);
            setError('เกิดข้อผิดพลาดในการดึงข้อมูลการจอง');
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-xl-12 col-lg-2 col-md-2 py-4 text-center">
                    <h2>ประวัติการขาย</h2>
                </div>
            </div>

            {/* Start Search Section */}
            <div className="row mt-4">
                <div className="col-xl-3 col-lg-3 col-md-4 col-6 mb-3">
                    <label className="form-label">ค้นหา</label>
                    <input
                        type="search"
                        className="form-control rounded"
                        placeholder="รหัสสุนัข,ชื่อสุนัข"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="col-xl-2 col-lg-2 col-md-2 col-3 mb-3">
                    <label className="form-label">สถานะการขาย</label>
                    <select
                        className="form-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="ทั้งหมด">ทั้งหมด</option>
                        <option value="successful">สำเร็จ</option>
                        <option value="canceled">ยกเลิกการจอง</option>
                        <option value="canceladmin">ยกเลิกการจอง(admin)</option>
                    </select>
                </div>
            </div>
            {/* End Search Section */}

            {/* Start Table Section */}
            <div className="row">
                <div className="col-xl-12 col-lg-2 col-md-2 pt-3">
                    <table className="table table-striped table-hover border">
                        <thead>
                            <tr>
                                <th scope="col">วันที่จองสุนัข</th>
                                <th scope="col">รหัส</th>
                                <th scope="col">ชื่อสุนัข</th>
                                <th scope="col">ราคา (บาท)</th>
                                <th scope="col">วันที่รับสุนัข</th>
                                <th scope="col">สถานะการขาย</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.length > 0 ? (
                                bookings.map((booking, index) => (
                                    <tr key={index}>
                                        <td>{formatDate(booking.created_at)}</td>
                                        <td>{booking.dog_id}</td>
                                        <td>{booking.dogs_name}</td>
                                        <td>{formatPrice(booking.price)}</td>
                                        <td>{formatDate(booking.booking_date)}</td>
                                        <td>
                                            {booking.status === 'successful' 
                                                ? 'สำเร็จ'
                                                : booking.status === 'canceladmin' 
                                                    ? 'ยกเลิกการจอง(admin)'
                                                    : 'ยกเลิกการจอง'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">ไม่พบข้อมูลการจอง</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* End Table Section */}

            {/* Pagination Section */}
            <div className="row">
                <div className="col-xl-12 col-lg-2 col-md-2 d-flex justify-content-center">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
            {/* End Pagination Section */}
        </div>
    );
}

export default History;
