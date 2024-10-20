import React from 'react'

import { print, search } from '../../../assets/' 

function Result() {
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
                    <img src={ search } alt="Search" height="25" className="btn-search" />
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
                            <tr>
                                <td className="text-center">1</td>
                                <td>สิทธิโชค จันทร์ทรง</td>
                                <td>21/09/2024</td>
                                <td>26/09/2024</td>
                                <td>BRP02</td>
                                <td>ปั๊กสีน้ำตาลธรรมชาติ</td>
                                <td>4,500</td>
                                <td>0</td>
                                <td>4,500</td>
                                <td>
                                    <div className="text-center" style={{ cursor: 'pointer' }}>
                                        <img src={ print } style={{ width: '25px' }} alt="Print" />
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="text-center">2</td>
                                <td>สิทธิโชค จันทร์ทรง</td>
                                <td>01/09/2024</td>
                                <td>14/09/2024</td>
                                <td>BRP01</td>
                                <td>ปั๊กสีขาวนวล</td>
                                <td>5,500</td>
                                <td>0</td>
                                <td>5,500</td>
                                <td>
                                    <div className="text-center" style={{ cursor: 'pointer' }}>
                                        <img src={ print } style={{ width: '25px' }} alt="Print" />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </>
  )
}

export default Result