import React from 'react'

import { dogBrown } from '../../assets/'

function Cancle() {
  return (
    <>
    <div className="container-fluid">
            <div className="row">
                <div className="col-1"></div>
                <div className="col-xl-2 col-lg-2 pt-3">
                    <h1>การจอง</h1>
                </div>
            </div>

            {/* Start Card CSS */}
            <div className="row bg-grey">
                <div className="col-xl-1 col-lg-0 col-md-0"></div>
                <div className="col-xl-2 col-lg-2 col-md-3 pt-2">
                    <img
                        className="setting-pic-cancle just-flex-center img-fluid"
                        src={ dogBrown }
                        alt="dog"
                    />
                </div>
                <div className="col-xl-2 col-lg-2 col-md-2" style={{ paddingTop: '35px' }}>
                    <div style={{ fontSize: '18px' }}>
                        ปั๊กสีน้ำตาลธรรมชาติ<br />
                        ฿ 4,500 THB<br />
                        รหัส : BRP01
                    </div>
                </div>

                <div className="col-xl-2 col-lg-3 col-md-4 pt-4">
                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                        ข้อมูลผู้จอง
                    </div>
                    <div style={{ fontSize: '18px' }}>
                        ผู้จอง: สิทธิโชค จันทร์ทรง<br />
                        อีเมล: Sittichok.Juns@bumail.net<br />
                        เบอร์: 087-994-8760
                    </div>
                </div>

                <div className="col-xl-2 col-lg-3 col-md-3 pt-4">
                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                        ข้อมูลการจอง
                    </div>
                    <div style={{ fontSize: '18px' }}>
                        วันที่จอง : 01/10/2024<br />
                        วันที่รับ : 03/10/2024<br />
                        เวลาที่รับ : 12.30
                    </div>
                </div>

                <div className="col-xl-3 col-lg-2 col-md-3 py-4">
                    <div style={{ fontSize: '18px', paddingLeft: '30px' }}>
                        ค่าจอง : 2,250<br />
                    </div>
                    <div style={{ fontSize: '18px', paddingLeft: '30px' }}>
                        ส่วนลด : 0<br />
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'red', paddingLeft: '30px' }}>
                        รวมเป็น : 2,250
                    </div>
                    <div className="just-flex-end d-flex pt-3">
                        <button type="button" className="btn btn-danger setting-btn-reserve" id="cancelreserve">
                            ยกเลิกการจอง
                        </button>
                    </div>
                </div>
            </div>
            {/* End Card CSS */}
        </div>
    </>
  )
}

export default Cancle