import React from 'react'

import { binIcon, editIcon } from '../../../assets' 

function HomeAdmin() {
  return (
    <>
    <div className="container-fluid">
      <div className="row pt-5">
        <main className="col-xl-9 col-lg-9 col-md-8 pt-3">
          <h3 className="px-3 py-3 text-center">รายชื่อสุนัข</h3>
          <table className="table bg-grey border">
            <thead>
              <tr>
                <th style={{ width: '5%' }}>รหัส</th>
                <th style={{ width: '10%' }}>ชื่อสุนัข</th>
                <th style={{ width: '5%' }}>วันเกิด</th>
                <th style={{ width: '5%' }}>ราคา</th>
                <th style={{ width: '7%' }}>สี</th>
                <th style={{ width: '3%' }}>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Bp001</td>
                <td>ปั๊กสีน้ำตาลธรรมชาติ</td>
                <td>10/09/2024</td>
                <td>4,500</td>
                <td>น้ำตาล</td>
                <td>
                  <a className="hover-icon" href="adddog.html" aria-label="Edit">
                    <img className="pic-icon" src={ editIcon } alt="Edit" />
                  </a>
                  <a className="hover-icon" aria-label="Delete">
                    <img className="pic-icon" src={ binIcon } alt="Delete" />
                  </a>
                </td>
              </tr>
              <tr>
                <td>Bp002</td>
                <td>ปั๊กสีน้ำตาลธรรมชาติ</td>
                <td>5/09/2024</td>
                <td>4,500</td>
                <td>น้ำตาล</td>
                <td>
                  <a className="hover-icon" href="adddog.html" aria-label="Edit">
                    <img className="pic-icon" src={ editIcon } alt="Edit" />
                  </a>
                  <a className="hover-icon" aria-label="Delete">
                    <img className="pic-icon" src={ binIcon } alt="Delete" />
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </main>
      </div>
    </div>
    </>
  )
}

export default HomeAdmin