import React from 'react'

function AddDogForm() {
  return (
    <>
    <div className="container-fluid">
      {/* Back Button */}
      <div className="row fix-row">
        <div className="col-12 pt-1">
          <a
            className="px-2 d-flex"
            href="home-admin.html"
            style={{ color: 'black', cursor: 'pointer' }}
          >
            <img src="back.png" style={{ width: '25px' }} alt="Back" />
            ย้อนกลับ
          </a>
        </div>
      </div>

      {/* Title */}
      <div className="row">
        <div className="col-12 pt-3 d-flex justify-content-center">
          <h1>เพิ่มสุนัข</h1>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-4 pt-3 d-flex justify-content-center">
          <form className="dropzone" id="my-dropzone"></form>
        </div>
        <div className="col-xl-8 pt-3">
          <div className="row">
            <div className="col-xl-3 pt-3">
              <label className="form-label">รหัส</label>
              <input className="form-control" />
            </div>

            <div className="col-xl-3 pt-3">
              <label className="form-label">ชื่อสุนัข</label>
              <input className="form-control" />
            </div>
          </div>

          <div className="row">
            <div className="col-xl-3 pt-3">
              <label className="form-label">วันเกิด</label>
              <input className="form-control" />
            </div>

            <div className="col-xl-3 pt-3">
              <label className="form-label">ราคา</label>
              <input className="form-control" />
            </div>
          </div>

          <div className="row">
            <div className="col-xl-3 pt-3">
              <label className="form-label">สี</label>
              <input className="form-control" />
            </div>

            <div className="col-xl-3 pt-3">
              <label className="form-label">ลักษณะนิสัย</label>
              <input className="form-control" />
            </div>
          </div>

          <div className="row">
            <div className="col-xl-6 pt-3">
              <label className="form-label">หมายเหตุ</label>
              <input className="form-control" />
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-4 pt-3"></div>
        <div className="col-xl-4 pt-5">
          <button
            type="submit" // Change this if not using as a submit button
            className="btn btn-primary"
            style={{ width: '100%', height: '50px' }}
          >
            เพิ่มสุนัข
          </button>
        </div>
      </div>
    </div>
    </>
  )
}

export default AddDogForm