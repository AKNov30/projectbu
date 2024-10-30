import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { apiUrl } from '../../../config/apiConfig';
import calculateAge from '../../../utils/calculateAge';
import { dogBrown } from '../../../assets';
import { formatPrice } from '../../../utils/formatPrice';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Reserve() {
    const { dog_id } = useParams(); 
    const navigate = useNavigate();
    const [dog, setDog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // form
    const [isAccepted, setIsAccepted] = useState(false);
    const [date, setDate] = useState(null);
    const [time, setTime] = useState('');
    const [phone, setPhone] = useState('');
    const user_id = localStorage.getItem('user_id');

    // Fetch dog details for reservation
    const fetchDogDetails = async () => {
        try {
            const response = await api.get(`/api/dogs/${dog_id}`);
            // Parse the image_url string to an array
            const dogData = { ...response.data, image_url: JSON.parse(response.data.image_url) };
            setDog(dogData);
        } catch (err) {
            console.error('Error fetching dog details:', err);
            setError(err.response?.data?.message || 'Failed to fetch dog details.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDogDetails();
    }, [dog_id]);

    const handleCheckboxChange = () => {
        setIsAccepted((prev) => !prev);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isAccepted || !date || !time || !phone) {
            alert('Please fill all fields and accept the terms.');
            return;
        }
         // Calculate half the price for payment
         const halfPrice = dog.price / 2;

         // Navigate to the Pay component with the price as state
         navigate('/pay', { state: { price: halfPrice, dog_id, date, time, phone } });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!dog) return <div>No dog found.</div>;

    return (
        <div className="container">
            <div className="row">
                <div className="col-1"></div>
                <div className="col-xl-11 pt-3">
                    <h1>รายละเอียดการจอง</h1>
                </div>
            </div>

            {/* Start Card CSS */}
            <div className="row">
                <div className="col-xl-1"></div>
                <div className="col-xl-4 col-lg-5 col-md-5">
                    <img
                        className="setting-pic-info just-flex-center img-fluid"
                        src={dog.image_url[0].startsWith('http') ? dog.image_url[0] : `${apiUrl}${dog.image_url[0]}`}
                        alt={dog.dogs_name}
                    />
                </div>
                <div className="col-xl-6 col-lg-5 col-md-6 bg-grey p-3">
                    <h2>{dog.dogs_name}</h2>
                    <h3>ราคา {formatPrice(dog.price)} บาท</h3>
                    <h4 className="px-4">รายละเอียด</h4>
                    <div className="dog-info-grid px-5">
                        <div>รหัส</div> <div>: {dog.dog_id}</div>
                        <div>วันเกิด</div> 
                        <div>: {new Date(dog.birthday).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        })} (อายุ {calculateAge(dog.birthday)})</div>
                        <div>สี</div> <div>: {dog.color}</div>
                        <div>ลักษณะนิสัย</div> <div>: {dog.personality}</div>
                    </div>
                    <div className="d-flex justify-content-center pt-4">**สุนัขทุกตัวได้ฉีดวัคซีนแรกเกิดทุกตัวแล้ว**</div>
                    <div className="d-flex justify-content-center">มีข้อมูลสอบถามเพิ่มเติมโปรดติดต่อ 087-994-8760</div>
                </div>
                <div className="col-1 col-md-0"></div>
            </div>

            {/* Additional booking fields */}
            <div className="row">
                <div className="col-1"></div>
                <div className="col-11 pt-3">
                    <h4>เงื่อนไขการจอง</h4>
                </div>
            </div>
            <div className="row">
                <div className="col-1"></div>
                <div className="col-11 pt-1 text-reserve px-5">
                    <p>1. ต้องชำระเงินค่าจองเป็นเงิน 50% ของราคาสุนัข</p>
                    <p>2. หากยกเลิกการจองจะไม่มีการคืนเงินจองของสุนัข</p>
                    <p>3. หลังจากวันที่กดจองต้องเข้ามารับสุนัขที่ฟาร์มภายใน 15 วัน ตั้งแต่เวลา (10.00-14.30น)</p>
                </div>
            </div>

            <div className="row">
                <div className="col-1"></div>
                <div className="col-11 pt-3">
                    <div className="form-check text-reserve">
                        <input 
                            className="form-check-input mt-2" 
                            type="checkbox" 
                            checked={isAccepted} 
                            onChange={handleCheckboxChange} 
                            id="flexCheckDefault" 
                        />
                        <label className="form-check-label" style={{ color: 'red' }} htmlFor="flexCheckDefault">
                            ฉันยอมรับและยืนยันเงื่อนไขการจอง
                        </label>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-xl-1 col-lg-0 col-md-0 col-0"></div>

                <div className="col-xl-3 col-lg-3 col-md-4 col-6 pt-3">
                    <div className="form-check">
                        <label className="form-label">วันที่จะเข้ามารับสุนัข</label>
                        <DatePicker
                            selected={date}
                            onChange={(date) => setDate(date)}
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            placeholderText="dd/mm/yyyy"
                            disabled={!isAccepted}
                        />
                    </div>
                </div>

                <div className="col-xl-3 col-lg-3 col-md-4 col-6 pt-3">
                    <div className="form-check text-reserve">
                        <label className="form-label">เวลา</label>
                        <select 
                            className="form-select" 
                            value={time} 
                            onChange={(e) => setTime(e.target.value)} 
                            disabled={!isAccepted}>
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
                    </div>
                </div>

                <div className="col-xl-3 col-lg-3 col-md-4 col-6 pt-3">
                    <div className="form-check">
                        <label className="form-label">เบอร์โทรศัพท์</label>
                        <input 
                            className="form-control" 
                            type="text" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                            disabled={!isAccepted} 
                        />
                    </div>
                </div>

                <div className="col-xl-2 col-lg-4 col-md-4 col-12 py-4">
                    <div className="just-flex-end d-flex pt-3">
                        <a 
                            type="button" 
                            className={`btn btn-success setting-btn-reserve mx-2 ${!isAccepted ? 'disabled' : ''}`} 
                            onClick={handleSubmit}
                            aria-disabled={!isAccepted}
                        >
                            ชำระเงิน
                        </a>
                    </div>
                </div>
            </div>
        </div>
        
    );
}

export default Reserve;
