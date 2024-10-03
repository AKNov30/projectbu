import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { search } from '../../assets/' 

function History() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ทั้งหมด');

    // ข้อมูลตัวอย่าง สามารถเปลี่ยนเป็นข้อมูลจาก API ได้
    const bookings = [
        {
            bookingDate: '27/11/2024',
            code: 'BRP03',
            itemName: 'ปั๊กสีน้ำตาลธรรมชาติ',
            price: '2,250',
            pickupDate: '28/11/2024',
            status: 'สำเร็จ'
        },
        {
            bookingDate: '21/11/2024',
            code: 'BRP02',
            itemName: 'ปั๊กสีน้ำตาลธรรมชาติ',
            price: '2,250',
            pickupDate: '24/11/2024',
            status: 'สำเร็จ'
        },
        {
            bookingDate: '19/11/2024',
            code: 'BRP01',
            itemName: 'ปั๊กสีน้ำตาลธรรมชาติ',
            price: '2,250',
            pickupDate: '-',
            status: 'ยกเลิกการจอง'
        }
    ];

    // ฟังก์ชันสำหรับการค้นหาและกรองข้อมูล
    const filteredBookings = bookings.filter(booking => {
        const matchesSearch = booking.code.includes(searchTerm) || booking.itemName.includes(searchTerm);
        const matchesStatus = statusFilter === 'ทั้งหมด' || booking.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="container">
            <div className="row pt-5">
                <div className="col-xl-1 col-lg-1 col-md-0"></div>
                <div className="col-xl-11 col-lg-2 col-md-2 pt-3 text-center">
                    <h3>ประวัติการจอง</h3>
                </div>
            </div>

            {/* Start Search Section */}
            <div className="row mt-4">
                <div className="col-xl-1 col-lg-1 col-md-0"></div>

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
                        <option value="สำเร็จ">สำเร็จ</option>
                        <option value="ยกเลิกการจอง">ยกเลิกการจอง</option>
                    </select>
                </div>

                <div className="col-xl-1 col-lg-1 col-md-1 col-1 d-flex mt-2">
                    <div className="" onClick={() => { /* เพิ่มฟังก์ชันการค้นหาเพิ่มเติมถ้าจำเป็น */ }}>
                        <img src={ search } alt="Search" height="25" className="btn-search" />
                    </div>
                </div>
            </div>
            {/* End Search Section */}

            {/* Start Table Section */}
            <div className="row mt-4">
                <div className="col-xl-1 col-lg-1 col-md-0"></div>
                <div className="col-xl-11 col-lg-2 col-md-2 pt-3">
                    <table className="table bg-grey border">
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
                                        <td>{booking.bookingDate}</td>
                                        <td>{booking.code}</td>
                                        <td>{booking.itemName}</td>
                                        <td>{booking.price}</td>
                                        <td>{booking.pickupDate}</td>
                                        <td>{booking.status}</td>
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
  )
}

export default History