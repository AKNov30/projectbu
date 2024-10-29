import React, { useState, useEffect, useRef } from 'react';
import { AlertSave } from '../../../components/alert/Alert';
import api from '../../../config/apiConfig';
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

function AddDogForm() {
  const [dogname, setDogName] = useState("");
  const [birthDay, setBirthDay] = useState(null);
  const [price, setPrice] = useState("");
  const [color, setColor] = useState("");
  const [description, setDescription] = useState("");
  const [personality, setPersonality] = useState("");
  const [files, setFiles] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(""); // For displaying errors
  const [fileKey, setFileKey] = useState(0); // For resetting file input
  const fileInputRef = useRef(null);

  const upload = () => {

    const formData = new FormData();
    formData.append("dogs_name", dogname);
    if (birthDay) {
      const localDate = new Date(birthDay.getTime() - birthDay.getTimezoneOffset() * 60000).toISOString().split('T')[0];
      formData.append("birthday", localDate);
    } else {
      formData.append("birthday", "");
    }
    formData.append("price", price);
    formData.append("color", color);
    formData.append("description", description);
    formData.append("personality", personality);
    files.forEach(file => {
      formData.append('files', file);
    });

    api.post('/api/adddog', formData)
      .then((response) => {
        console.log(response);
        setSuccess(true);
        setError(""); // Reset error on success
      })
      .catch(err => {
        console.error(err);
        setError("เกิดข้อผิดพลาดในการเพิ่มสุนัข");
      });
  };

  useEffect(() => {
    if (success) {
      // Reset form
      setDogName("");
      setBirthDay("");
      setPrice("");
      setColor("");
      setDescription("");
      setPersonality("");
      setFiles([]);
      setFileKey(prevKey => prevKey + 1); // Reset file input

      const timer = setTimeout(() => {
        setSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const totalFiles = newFiles.length + files.length;
    if (totalFiles > 4) {
      setError("เพิ่มรูปภาพได้สูงสุด 4 รูป");
      return;
    }

    // Concatenate new files without duplicates
    setFiles(prevFiles => {
      const uniqueFiles = newFiles.filter(newFile =>
        !prevFiles.some(file => file.name === newFile.name)
      );
      return [...prevFiles, ...uniqueFiles];
    });
  };

  const handleRemoveFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
    setFileKey(prevKey => prevKey + 1); // Reset file input key after removing a file
  };

  const handleClick = () => {
    fileInputRef.current.click(); // Open file input on click of the "+" button
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12 pt-3 d-flex justify-content-center">
            <h1>เพิ่มสุนัข</h1>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-8 offset-xl-2 pt-3">
            <form>
              {/* Dog Name */}
              <div className="row mb-3">
                <div className="col-md-12">
                  <label className="form-label">ชื่อสุนัข</label>
                  <input
                    type="text"
                    className="form-control"
                    value={dogname}
                    onChange={(e) => setDogName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Date of Birth and Price */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">วันเกิด</label>
                  <DatePicker
                    type="date"
                    className="form-control"
                    selected={birthDay}
                    onChange={(date) => setBirthDay(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">ราคา</label>
                  <input
                    type="number"
                    className="form-control"
                    value={price}
                    onChange={(e) => setPrice(Math.max(0, e.target.value))}
                    required
                    step="1"
                    min="0"
                  />
                </div>
              </div>

              {/* Color and Personality */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">สี</label>
                  <select
                    className="form-select"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    required
                  >
                    <option value="">เลือกสี</option> {/* Option for placeholder */}
                    <option value="น้ำตาล">น้ำตาล</option>
                    <option value="ดำ">ดำ</option>
                    <option value="ขาว">ขาว</option>
                    <option value="ขาว-ดำ">ขาว-ดำ</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">ลักษณะนิสัย</label>
                  <input
                    type="text"
                    className="form-control"
                    value={personality}
                    onChange={(e) => setPersonality(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mb-3">
                <label className="form-label">หมายเหตุ</label>
                <textarea
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* File Upload */}
              <div className="mb-3">
                <label className="form-label">เพิ่มรูป</label>
                <input
                  key={fileKey}
                  type="file"
                  className="form-control"
                  multiple
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  style={{ display: 'none' }} // Hidden input
                />

                {/* Display selected images */}
                <div className="mt-1 d-flex flex-wrap align-items-center">
                  {files.length > 0 && (
                    <div className="d-flex flex-wrap">
                      {files.map((file, index) => (
                        <div key={index} className="position-relative m-2">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="img-thumbnail"
                            style={{ width: '100px', height: '100px' }}
                          />
                          <button
                            type="button"
                            className="btn-close position-absolute top-0 end-0"
                            onClick={() => handleRemoveFile(index)}
                          ></button>
                        </div>
                      ))}

                    </div>
                  )}
                  <div
                    className="d-flex justify-content-center align-items-center "
                    style={{
                      width: '96px',
                      height: '96px',
                      border: '2px dashed #555',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      backgroundColor: '#2b2b2b',
                      color: '#fff',
                    }}
                    onClick={handleClick}
                  >
                    <span style={{ fontSize: '40px' }}>+</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center mb-3">
                <AlertSave
                  onConfirm={() => {
                    if (!dogname || !birthDay || !price || !color || !description || !personality || files.length === 0) {
                      setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
                      return false
                    } else {
                      upload();
                    }
                  }}
                  title={"คุณแน่ใจหรือไม่ที่จะเพิ่มสุนัข?"}
                  confirmText={"ยืนยัน"}
                  failMessage={"เพิ่มไม่สำเร็จ"}
                  successMessage={"เพิ่มสำเร็จ"}
                >
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ width: '100%', height: '50px' }}
                  >
                    เพิ่มสุนัข
                  </button>
                </AlertSave>
              </div>
            </form>

            {/* Success and Error Messages */}
            {success && (
              <div className="alert alert-success mt-3" role="alert">
                เพิ่มสุนัขสำเร็จ
              </div>
            )}
            {error && (
              <div className="alert alert-danger mt-3" role="alert">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AddDogForm;
