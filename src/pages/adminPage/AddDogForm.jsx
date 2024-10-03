import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

function AddDogForm() {
  const [files, setFiles] = useState([]); // สถานะสำหรับเก็บไฟล์ที่อัปโหลด

  const onDrop = (acceptedFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]); // เพิ่มไฟล์ใหม่ไปยังสถานะ
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop }); // ตั้งค่าฟังก์ชันการจัดการเมื่อมีการดรอปไฟล์

  const handleSubmit = (event) => {
    event.preventDefault();
    // จัดการการส่งข้อมูลฟอร์มที่นี่ รวมถึงส่งไฟล์ไปยัง backend
  };
  return (
    <>
      <div className="container-fluid">
        {/* ชื่อ */}
        <div className="row">
          <div className="col-12 pt-3 d-flex justify-content-center">
            <h1>เพิ่มสุนัข</h1>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-4 pt-3 d-flex flex-wrap flex-row justify-content-center">
            <div {...getRootProps({ className: 'dropzone d-flex justify-content-center align-items-center', style: { border: '2px dashed #007bff', padding: '20px', textAlign: 'center' } })}>
              <input {...getInputProps()} />
              <p className="text-center">เพิ่มรูป</p>
            </div>

            <div className='d-flex flex-wrap justify-content-center mt-3'>
              {files.length > 0 && (
                <ul style={{ display: 'flex', flexWrap: 'wrap', listStyleType: 'none', padding: 0 }}>
                  {files.map((file) => (
                    <li key={file.name} style={{ margin: '5px' }}>
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>


          <div className="col-xl-8 pt-3">
            <div className="row">
              <div className="col-xl-6 pt-6">
                <label className="form-label">ชื่อสุนัข</label>
                <input className="form-control" />
              </div>
            </div>

            <div className="row">
              <div className="col-xl-3 pt-3">
                <label className="form-label">วันเกิด</label>
                <input type="date" className="form-control" max={new Date().toISOString().split("T")[0]} />
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
                <textarea className="form-control" />
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-4 pt-3"></div>
          <div className="col-xl-4 pt-5">
            <button
              type="submit" // ปรับเปลี่ยนหากไม่ใช้เป็นปุ่มส่ง
              className="btn btn-primary"
              style={{ width: '100%', height: '50px' }}
              onClick={handleSubmit} // แนบฟังก์ชันส่งข้อมูล
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