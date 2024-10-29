import React, { useEffect, useState } from 'react';
import { AlertSave } from '../../components/alert/Alert';
import api, { apiUrl } from '../../config/apiConfig';
import Pagination from '../../components/pagination/Pagination';
import { logo } from '../../assets';
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";


function ChangeDate() {
    const [reservations, setReservations] = useState([]);
    const [timeSelections, setTimeSelections] = useState({});
    const [dateSelections, setDateSelections] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchReservations(currentPage);
    }, [currentPage]);

    const fetchReservations = (page) => {
        fetch(`${apiUrl}/api/change-date?page=${page}&limit=7`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
                }
                return response.json();
            })
            .then((data) => {
                setReservations(data.data);  // เก็บข้อมูลการจองใน state
                setCurrentPage(data.currentPage);  // เก็บหน้าปัจจุบัน
                setTotalPages(data.totalPages);  // เก็บจำนวนหน้าทั้งหมด
            })
            .catch((error) => {
                console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
            }
            );
    };
    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchDogs(page);
    };

    const handleDateChange = (date, bookingId) => {
        const newDateSelections = { ...dateSelections, [bookingId]: date };
        setDateSelections(newDateSelections);
    };

    // ฟังก์ชันจัดการเมื่อเวลาเปลี่ยนแปลง
    const handleTimeChange = (e, bookingId) => {
        const newTimeSelections = { ...timeSelections, [bookingId]: e.target.value };
        setTimeSelections(newTimeSelections);  // อัปเดตเวลาที่เลือกสำหรับแต่ละรายการ
    };

    const handleSave = (bookingId) => {
        // ดึงค่าของวันที่และเวลาใหม่จาก input fields
        const selectedDate = dateSelections[bookingId];
        const selectedTime = timeSelections[bookingId];

        // ตรวจสอบว่าผู้ใช้ได้เลือกทั้งวันที่และเวลาหรือไม่ (validate)
        if (!selectedDate || !selectedTime) {
            return false;
        }

        const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;

        // ส่งข้อมูลไปยังเซิร์ฟเวอร์ผ่าน PUT request
        fetch(`${apiUrl}/api/change-date/${bookingId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                booking_date: formattedDate,  // วันที่ที่เลือก
                pickup_date: selectedTime,   // เวลาที่เลือก
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.log('เกิดข้อผิดพลาด: ' + data.error);
                } else {
                    fetchReservations(currentPage)
                    console.log('อัปเดตข้อมูลสำเร็จ');
                    // คุณอาจต้องการรีเฟรชข้อมูลหรือทำการอัปเดตใน UI
                }
            })
            .catch((error) => {
                console.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล:', error);
            });
    };

    return (
        <>
            <div className="container-fulid">
                <div className="row">
                    <div className="col-12 pt-3 d-flex justify-content-center">
                        <h1>เลื่อนวันรับ</h1>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xl-1 col-lg-1 col-md-0"></div>
                    <div className="col-xl-10 col-lg-2 col-md-2 pt-3">
                        <table className="table table-striped table-hover border">
                            <thead>
                                <tr>
                                    <th className="text-center" style={{ width: '80px' }}>&nbsp;</th>
                                    <th>ผู้จอง</th>
                                    <th>รหัส</th>
                                    <th>วันจอง</th>
                                    <th>วันที่รับสุนัข</th>
                                    <th>เวลาที่รับสุนัข</th>
                                    <th>เลื่อนวันรับสุนัข</th>
                                    <th>เลื่อนเวลารับสุนัข</th>
                                    <th>&nbsp;</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservations.map((reservation) => {
                                    // console.log(reservation.image_url)
                                    const imageUrl = reservation.image_url.startsWith('http')
                                        ? reservation.image_url
                                        : `${apiUrl}${reservation.image_url}`;
                                    return (
                                        <tr key={reservation.booking_id} className='center-table'>
                                            <td className="text-center">
                                                <img
                                                    src={imageUrl}
                                                    // src={image_url.startsWith('http') ? image_url : reservation.image_url }
                                                    // onError={(e) => { e.target.src = logo; }}
                                                    alt={reservation.dogs_name}
                                                    height="80"
                                                    className="d-inline-block align-text-top"
                                                />
                                            </td>
                                            <td>
                                                {reservation.firstname} {reservation.lastname}<br />
                                                {reservation.user_email}<br />
                                                {reservation.phone}
                                            </td>
                                            <td>{reservation.dog_id}</td>
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
                                            <td>
                                                {reservation.pickup_date ? reservation.pickup_date.slice(0, 5) : 'N/A'}
                                            </td>
                                            <td>
                                                <DatePicker
                                                    selected={dateSelections[reservation.booking_id] || null}
                                                    onChange={(date) => handleDateChange(date, reservation.booking_id)}
                                                    dateFormat="dd/MM/yyyy"
                                                    className="form-control"
                                                    placeholderText="dd/mm/yyyy"
                                                />
                                            </td>
                                            <td>
                                                <select
                                                    className="form-select"
                                                    value={timeSelections[reservation.booking_id] || ""}
                                                    onChange={(e) => handleTimeChange(e, reservation.booking_id)}
                                                >
                                                    <option value="">เลือกเวลา</option>
                                                    <option value="10:00">10:00 น</option>
                                                    <option value="10:30">10:30 น</option>
                                                    <option value="11:00">11:00 น</option>
                                                    <option value="11:30">11:30 น</option>
                                                    <option value="12:00">12:00 น</option>
                                                    <option value="12:30">12:30 น</option>
                                                    <option value="13:00">13:00 น</option>
                                                    <option value="13:30">13:30 น</option>
                                                    <option value="14:00">14:00 น</option>
                                                    <option value="14:30">14:30 น</option>
                                                </select>
                                            </td>
                                            <td>
                                                <AlertSave
                                                    onConfirm={() => handleSave(reservation.booking_id)}
                                                    failMessage={"กรุณาเลือกวันที่และเวลา"}
                                                    title={"คุณแน่ใจหรือไม่ที่จะแก้ไขข้อมูล?"}
                                                    confirmText={"ยืนยัน"}
                                                    successMessage={"แก้ไขสำเร็จ"}
                                                >
                                                    <button type="button" className="btn btn-success" style={{ width: '100%' }}>บันทึก</button>
                                                </AlertSave>
                                            </td>
                                        </tr>
                                    );
                                })}
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

export default ChangeDate;
