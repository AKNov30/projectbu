import React from 'react'
import { Link } from 'react-router-dom';

import { dogBrown, dogWhite } from '../../../assets' 

function DetailDog() {
  return (
    <>
        <div className="container-fluid">
      <div className="row">
        <div className="col-1"></div>
        <div className="col-xl-2 pt-3">
          <h1>รายละเอียด</h1>
        </div>
      </div>

      {/* Start Card Section */}
      <div className="row">  
        <div className="col-xl-1 col-lg-1 col-md-0"></div>   
        <div className="col-xl-3 col-lg-5 col-md-5">
          <img className="setting-pic-info just-flex-center img-fluid" src={ dogBrown } alt="Dog" />
        </div>
        <div className="col-xl-7 col-lg-5 col-md-6 bg-grey p-3">
          <h2>ปั๊กสีน้ำตาลธรรมชาติ</h2>
          <h3>฿ 4,500 THB</h3>
          <h4>รายละเอียด</h4>
          <p className="px-3">รหัส : BRP01</p>
          <p className="px-3">วันเกิด : 25/09/24 (อายุ 6 วัน)</p>
          <p className="px-3">สี : น้ำตาล</p>
          <p className="px-3">นิสัย : ร่าเริง กินเก่ง ขี้อ้อน</p>
          <p className="px-3">โรคประจำตัว : ไม่มี</p>
          <p className="px-3">วัคซีน : พาราอินฟลูเอนซ่าไวรัส, อะดิโนไวรัส2</p>
        
          <div className="just-flex-end d-flex pt-3">
            <button type="button" className="btn btn-outline-secondary setting-btn-reserve">โทร</button>
            <Link to="/reserve" className="btn btn-warning setting-btn-reserve mx-2">จอง</Link>
          </div>
        </div>
        <div className="col-1 col-md-0"></div> 
      </div>

      <div className="row">
        <div className="col-1"></div> 
        <div className="col-xl-5 col-lg-11">
          <img className="setting-pic-info-small just-flex-center img-fluid" src={ dogBrown } alt="Dog" />
          <img className="setting-pic-info-small just-flex-center img-fluid" src={ dogBrown } alt="Dog" />
          <img className="setting-pic-info-small just-flex-center img-fluid" src={ dogBrown } alt="Dog" />
        </div>
      </div>

      <div className="row">
        <div className="col-1"></div>
        <div className="col-10">
          <hr />
          <p>คุณอาจสนใจ</p>
        </div>
        <div className="col-1"></div>
      </div>

      <div className="row">
        <div className="col-xl-1 col-lg-1 col-md-0 col-sm-0"></div>
        <div className="col-xl-3 col-lg-3 col-md-5 col-sm-6 d-md-flex align-items-stretch pt-3">
          <Link to="/info" className="card-setting bg-white">
            <div className="d-flex just-flex-center">
              <img className="setting-pic just-flex-center img-fluid" src={ dogWhite } alt="Dog" />
            </div>
            
            <div className="setting-text">
              <h5 className="fw-bold pt-3">ปั๊กสีน้ำตาลธรรมชาติ</h5>
              <p>สี : น้ำตาล</p>
              <p>พ่อพันธุ์ - แม่พันธ์ุ : ไลก้า-นานา</p>
              <p>ราคา :  4,500 THB</p>
            </div>
            <div className="d-flex just-flex-center pt-3">
              <button type="button" className="btn btn-outline-warning setting-btn-reserve">รายละเอียด</button>
            </div>
          </Link>
        </div>
        <div className="col-1"></div>
      </div>
      {/* End Card Section */}
    </div>
    </>
  )
}

export default DetailDog