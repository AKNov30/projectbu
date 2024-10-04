import React, { useState, useEffect } from 'react';
import axios from 'axios'

function AddDogForm() {
  const [dogname, setDogName] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [price, setPrice] = useState("");
  const [color, setColor] = useState("");
  const [description, setDescription] = useState("");
  const [personality, setPersonality] = useState("");
  const [file, setFile] = useState();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(""); // สำหรับแสดงข้อผิดพลาด
  const [fileKey, setFileKey] = useState(0); // สำหรับรีเซ็ต file input

  const upload = () => {
    // ตรวจสอบว่ากรอกข้อมูลครบทุกช่องหรือไม่
    if (!dogname || !birthDay || !price || !color || !description || !personality || !file) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    const formData = new FormData()
    formData.append("dogs_name", dogname);
    formData.append("birthday", birthDay);
    formData.append("price", price);
    formData.append("color", color);
    formData.append("description", description);
    formData.append("personality", personality);
    formData.append('file', file)

    axios.post('http://localhost:5000/api/adddog',formData )
    .then((response) => {
        console.log(response);
        setSuccess(true); // ตั้งค่าสถานะให้แสดง alert เมื่อเพิ่มสำเร็จ
        setError(""); // รีเซ็ตข้อผิดพลาด
      })
      .catch(err => {
        console.log(err);
        setError("เกิดข้อผิดพลาดในการเพิ่มสุนัข"); // ตั้งค่าข้อผิดพลาด
      });
};

useEffect(() => {
  if (success) {
    // ล้างค่าฟอร์ม
    setDogName("");
    setBirthDay("");
    setPrice("");
    setColor("");
    setDescription("");
    setPersonality("");
    setFile(null);
    
    // รีเซ็ต key เพื่อรีเซ็ต file input
    setFileKey(prevKey => prevKey + 1);

    // ตั้งค่าการรีเซ็ต `success` หลังจาก 3 วินาที
    const timer = setTimeout(() => {
      setSuccess(false);
    }, 3000);

    // ทำความสะอาด timer เมื่อ component ถูก unmount หรือเมื่อ `success` เปลี่ยนแปลง
    return () => clearTimeout(timer);
  }
}, [success]);

const handleFileChange = (e) => {
  setFile(e.target.files[0]);
};

  return (
    <>
       <div className="container-fluid">
        <div className="row">
          <div className="col-12 pt-3 d-flex justify-content-center">
            <h1>เพิ่มสุนัข</h1>
          </div>
        </div>

        <div className="row">
          
          <div className="col-xl-8 pt-3">
            <div className="row">
              <div className="col-xl-6 pt-6">
                <label className="form-label">ชื่อสุนัข</label>
                <input
                  type="text"
                  className="form-control"
                  value={dogname}
                  onChange={(e) => setDogName(e.target.value)}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-xl-3 pt-3">
                <label className="form-label">วันเกิด</label>
                <input
                  type="date"
                  className="form-control"
                  value={birthDay}
                  onChange={(e) => setBirthDay(e.target.value)}
                />
              </div>

              <div className="col-xl-3 pt-3">
                <label className="form-label">ราคา</label>
                <input
                  type="text"
                  className="form-control"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-xl-3 pt-3">
                <label className="form-label">สี</label>
                <input
                  type="text"
                  className="form-control"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>

              <div className="col-xl-3 pt-3">
                <label className="form-label">ลักษณะนิสัย</label>
                <input
                  type="text"
                  className="form-control"
                  value={personality}
                  onChange={(e) => setPersonality(e.target.value)}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-xl-6 pt-3">
                <label className="form-label">หมายเหตุ</label>
                <textarea
                  type="text"
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-xl-6 pt-3">
                <label className="form-label">เพิ่มรูป</label>
                <input
                  key={fileKey}
                  type="file"
                  className="form-control"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-4 pt-3"></div>
          <div className="col-xl-4 pt-5">
            <button
              type="button"
              className="btn btn-primary"
              onClick={upload}
              style={{ width: '100%', height: '50px' }}
            >
              เพิ่มสุนัข
            </button>
          </div>
        </div>
        {success && ( // แสดง alert หากสถานะ success เป็น true
          <div className="alert alert-success" role="alert">
            เพิ่มสุนัขสำเร็จ
          </div>
        )}
      </div>
    </>
  )
}

export default AddDogForm