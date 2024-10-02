import React, { useState } from 'react';

function Reserve() {
    const [isAccepted, setIsAccepted] = useState(false);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [phone, setPhone] = useState('');

    const handleCheckboxChange = (event) => {
        setIsAccepted(event.target.checked);
    };

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
                <div className="col-xl-1 "></div>
                <div className="col-xl-4 col-lg-5 col-md-5">
                    <img className="setting-pic-info just-flex-center img-fluid" src="dogbrown.png" alt="Dog" />
                </div>
                <div className="col-xl-6 col-lg-5 col-md-6 bg-grey p-3">
                    <h2>ปั๊กสีน้ำตาลธรรมชาติ</h2>
                    <h3>฿ 4,500 THB</h3>
                    <h4>รายละเอียด</h4>
                    <p className="px-3">รหัส : BRP01</p>
                    <p className="px-3">วันเกิด : 25/09/24 (อายุ 6 วัน)</p>
                    <p className="px-3">สี : น้ำตาล</p>
                    <p className="px-3">นิสัย : ร่าเริง กินเก่ง ขี้อ้อน</p>
                    <p className="px-3">โรคประจำตัว : ไม่มี</p>
                    <p className="px-3">วัคซีน : พาราอินฟลูเอนซ่าไวรัส,อะดิโนไวรัส2</p>
                </div>
                <div className="col-1 col-md-0"></div>
            </div>

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
                    <p>2. หากยกเลิกการจองจะไม่มีการคืนเงินจองสุนัข</p>
                    <p>3. หลังจากวันที่กดจองต้องเข้ามารับสุนัขที่ฟาร์มภายใน 15 วัน ตั้งแต่เวลา(10.00-14.30น)</p>
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
                        <input 
                            className="form-control" 
                            type="text" 
                            value={date} 
                            onChange={(e) => setDate(e.target.value)} 
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
                    <div className="form-check text-reserve">
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
                            href="pay.html" 
                            id="payBtn" 
                            tabIndex="-1" 
                            aria-disabled={!isAccepted}
                        >
                            ชำระเงิน
                        </a>
                    </div>
                </div>
            </div>

            {/* End Card CSS */}
        </div>
    );
}

export default Reserve;
