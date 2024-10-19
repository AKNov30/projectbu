import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { search } from '../../assets/';

function History() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ทั้งหมด');
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const user_id = localStorage.getItem('user_id'); // Get user ID from localStorage
        
        const fetchBookingData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/history`, {
                    params: { user_id },
                });
                setBookings(response.data);
            } catch (error) {
                console.error('Error fetching booking data:', error);
                setError('เกิดข้อผิดพลาดในการดึงข้อมูลการจอง');
            }
        };

        fetchBookingData();
    }, []);

    if (error) {
        return <div>{error}</div>; // Display error message if there's an error
    }

    // Filter bookings by search term and status
    const filteredBookings = bookings.filter((booking) => {
        const matchesSearch = booking.dogs_name.includes(searchTerm) || booking.dog_id.toString().includes(searchTerm);
        const matchesStatus = statusFilter === 'ทั้งหมด' || booking.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-xl-12 col-lg-2 col-md-2 py-4 text-center">
                    <h2>ประวัติการจอง</h2>
                </div>
            </div>

            {/* Start Search Section */}
            <div className="row mt-4">

                <div className="col-xl-3 col-lg-3 col-md-4 col-6 mb-3">
                    <label className="form-label">ค้นหา</label>
                    <input
                        type="search"
                        className="form-control rounded"
                        placeholder="ค้นหา"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="col-xl-2 col-lg-2 col-md-2 col-3 mb-3">
                    <label className="form-label">สถานะการจอง</label>
                    <select
                        className="form-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="ทั้งหมด">ทั้งหมด</option>
                        <option value="successful">สำเร็จ</option>
                        <option value="canceled">ยกเลิกการจอง</option>
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
                                <th scope="col">วันที่จอง</th>
                                <th scope="col">รหัส</th>
                                <th scope="col">ชื่อรายการ</th>
                                <th scope="col">ราคา</th>
                                <th scope="col">วันที่รับ</th>
                                <th scope="col">สถานะการจอง</th>
                            </tr>
                        </thead>
                        <tbody>
                        {filteredBookings.length > 0 ? (
                                filteredBookings.map((booking, index) => (
                                    <tr key={index}>
                                        <td>{formatDate(booking.created_at)}</td>
                                        <td>{booking.dog_id}</td>
                                        <td>{booking.dogs_name}</td>
                                        <td>{booking.price}</td>
                                        <td>{formatDate(booking.booking_date)}</td>
                                        <td>{booking.status === 'successful' ? 'สำเร็จ' : 'ยกเลิกการจอง'}</td>
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
        </div>
    );
}

export default History;
