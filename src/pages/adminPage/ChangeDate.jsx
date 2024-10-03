import React from 'react'

import { dogBrown, dogBlack } from '../../assets/'

function ChangeDate() {
  return (
    <>
     <div className="container-fluid">
            <div className="row">
                <div className="col-1"></div>
                <div className="col-11 pt-3 d-flex justify-content-center">
                    <h1>เลื่อนวันรับ</h1>
                </div>
            </div>

            <div className="row">
                <div className="col-xl-1 col-lg-1 col-md-0"></div>
                <div className="col-xl-10 col-lg-2 col-md-2 pt-3">
                    <table className="table bg-grey border">
                        <thead>
                            <tr>
                                <th style={{ width: '3%' }}>&nbsp;</th>
                                <th style={{ width: '8%' }}>ผู้จอง</th>
                                <th style={{ width: '3%' }}>รหัส</th>
                                <th style={{ width: '3%' }}>วันจอง</th>
                                <th style={{ width: '3%' }}>วันที่รับ</th>
                                <th style={{ width: '4%' }}>เลื่อนเป็น</th>
                                <th style={{ width: '4%' }}>&nbsp;</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="text-center">
                                    <img src={ dogBrown } alt="Dog Brown" height="80" className="d-inline-block align-text-top" />
                                </td>
                                <td>
                                    สิทธิโชค จันทร์ทรง<br />
                                    Sittichok@juns@bumail.net<br />
                                    087-994-8760
                                </td>
                                <td>BRP02</td>
                                <td>10/09/2024</td>
                                <td>14/09/2024</td>
                                <td>
                                    <input className="form-control" type="text" id="datepicker2" />
                                </td>
                                <td>
                                    <div>
                                        <a type="button" href="reserve-info.html" className="btn btn-success" style={{ width: '100%' }}>บันทึก</a>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="text-center">
                                    <img src={ dogBlack } alt="Dog Black" height="80" className="d-inline-block align-text-top" />
                                </td>
                                <td>
                                    สิทธิโชค จันทร์ทรง<br />
                                    Sittichok@juns@bumail.net<br />
                                    087-994-8760
                                </td>
                                <td>BRP01</td>
                                <td>10/09/2024</td>
                                <td>14/09/2024</td>
                                <td>
                                    <input className="form-control" type="text" id="datepicker" />
                                </td>
                                <td>
                                    <div>
                                        <a type="button" href="reserve-info.html" className="btn btn-success" style={{ width: '100%' }}>บันทึก</a>
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

export default ChangeDate