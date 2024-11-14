import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // ใช้สำหรับรับ params และนำทาง
import { AlertSave } from '../../../components/alert/Alert';
import api, { apiUrl } from '../../../config/apiConfig';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function EditDogForm() {
    const { dogId } = useParams(); // รับ dog_id จาก URL
    const navigate = useNavigate(); // ใช้สำหรับนำทางหลังจากอัปเดตสำเร็จ

    const [dogname, setDogName] = useState("");
    const [birthDay, setBirthDay] = useState(null);
    const [price, setPrice] = useState("");
    const [color, setColor] = useState("");
    const [description, setDescription] = useState("");
    const [personality, setPersonality] = useState("");
    const [existingImages, setExistingImages] = useState([]); // รูปภาพที่มีอยู่
    const [removeImages, setRemoveImages] = useState([]); // รูปภาพที่ต้องการลบ
    const [newFiles, setNewFiles] = useState([]); // รูปภาพใหม่ที่อัปโหลด
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(""); // สำหรับแสดงข้อผิดพลาด
    const [fileKey, setFileKey] = useState(0); // สำหรับรีเซ็ต input file
    const fileInputRef = useRef(null);

    // ฟังก์ชันดึงข้อมูลสุนัขที่ต้องการแก้ไข
    useEffect(() => {
        api.get(`/api/dogs/${dogId}`)
            .then(response => {
                const { dogs_name, birthday, price, color, description, personality, image_url } = response.data;
                setDogName(dogs_name);
                const date = birthday ? new Date(birthday) : null;
                setBirthDay(date);
                setPrice(price);
                setColor(color);
                setDescription(description);
                setPersonality(personality);
                setExistingImages(JSON.parse(image_url)); // แปลง JSON string กลับเป็น array
            })
            .catch(err => {
                console.error(err);
                setError("ไม่สามารถดึงข้อมูลสุนัขได้");
            });
    }, [dogId]);


    // ฟังก์ชันอัปเดตข้อมูลสุนัข
    const updateDog = async () => {
        if (!dogname || !birthDay || !price || !color || !description || !personality) {
            setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
            return;
        }

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

        // เพิ่มรูปภาพใหม่
        newFiles.forEach(file => {
            formData.append('files', file);
        });

        // เพิ่มรูปภาพที่ต้องการลบ
        removeImages.forEach(imageUrl => {
            formData.append('removeImages[]', imageUrl);
        });

        try {
            const response = await api.put(`/api/dogs/${dogId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response);
            setSuccess(true);
            setError("");

            // รีเซ็ตฟอร์มและนำทางกลับไปหน้ารายการสุนัข
            setTimeout(() => {
                navigate('/admin/home-admin'); // เปลี่ยนเป็นเส้นทางที่เหมาะสมสำหรับคุณ
            }, 3000);
        } catch (err) {
            console.error(err);
            setError("เกิดข้อผิดพลาดในการแก้ไขข้อมูลสุนัข");
        }
    };

    // รีเซ็ตฟอร์มเมื่อการอัปเดตสำเร็จ
    useEffect(() => {
        if (success) {
            setDogName("");
            setBirthDay("");
            setPrice("");
            setColor("");
            setDescription("");
            setPersonality("");
            setExistingImages([]);
            setRemoveImages([]);
            setNewFiles([]);
            setFileKey(prevKey => prevKey + 1); // รีเซ็ต input file

            const timer = setTimeout(() => {
                setSuccess(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    // จัดการการเลือกไฟล์ใหม่
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const totalFiles = existingImages.length - removeImages.length + newFiles.length + selectedFiles.length;

        if (totalFiles > 4) {
            setError("เพิ่มรูปภาพได้สูงสุด 4 รูป");
            return;
        }
        setNewFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    };

    // จัดการการลบรูปภาพที่มีอยู่
    const handleRemoveExistingImage = (imageUrl) => {
        setRemoveImages(prev => [...prev, imageUrl]);
        setExistingImages(prev => prev.filter(url => url !== imageUrl));
    };

    // จัดการการลบไฟล์ใหม่ที่เลือก
    const handleRemoveNewFile = (indexToRemove) => {
        setNewFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
        setFileKey(prevKey => prevKey + 1); // รีเซ็ต input file
    };

    // เปิด dialog สำหรับเลือกไฟล์
    const handleClick = () => {
        fileInputRef.current.click();
    };

    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 pt-3 d-flex justify-content-center">
                        <h1>แก้ไขข้อมูลสุนัข</h1>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xl-8 offset-xl-2 pt-3">
                        <form>
                            {/* ชื่อสุนัข */}
                            <div className="mb-3">
                                <label className="form-label">ชื่อสุนัข</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={dogname}
                                    onChange={(e) => setDogName(e.target.value)}
                                    required
                                />
                            </div>

                            {/* วันเกิดและราคา */}
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">วันเกิด</label>
                                    <DatePicker
                                        selected={birthDay ? new Date(birthDay) : null}
                                        onChange={(date) => setBirthDay(date)}
                                        dateFormat="dd/MM/yyyy"
                                        className="form-control"
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

                            {/* สีและลักษณะนิสัย */}
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">สี</label>
                                    <select
                                        className="form-select"
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                        required
                                    >
                                        <option value="">เลือกสี</option>
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

                            {/* หมายเหตุ */}
                            <div className="mb-3">
                                <label className="form-label">หมายเหตุ</label>
                                <textarea
                                    className="form-control"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            {/* การจัดการรูปภาพ */}
                            <div className="mb-3">
                                <label className="form-label">เพิ่มรูป (ขั้นต่ำ 1 รูป สูงสุด 4 รูป)</label>
                                <input
                                    key={fileKey}
                                    type="file"
                                    className="form-control"
                                    multiple
                                    onChange={handleFileChange}
                                    ref={fileInputRef}
                                    style={{ display: 'none' }} // ซ่อน input file
                                />

                                {/* แสดงรูปภาพที่มีอยู่และรูปภาพใหม่ */}
                                <div className="mt-1 d-flex flex-wrap align-items-center">
                                    {/* รูปภาพที่มีอยู่ */}
                                    {existingImages.length > 0 && (
                                        <div className="d-flex flex-wrap">
                                            {existingImages.map((imageUrl, index) => (
                                                <div key={index} className="position-relative m-2">
                                                    <img
                                                        src={imageUrl.startsWith('http') ? imageUrl : `${apiUrl}${imageUrl}`}
                                                        alt={`Existing ${index}`}
                                                        className="img-thumbnail"
                                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn-close position-absolute top-0 end-0"
                                                        onClick={() => handleRemoveExistingImage(imageUrl)}
                                                    ></button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* รูปภาพใหม่ */}
                                    {newFiles.length > 0 && (
                                        <div className="d-flex flex-wrap">
                                            {newFiles.map((file, index) => (
                                                <div key={index} className="position-relative m-2">
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt={file.name}
                                                        className="img-thumbnail"
                                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn-close position-absolute top-0 end-0"
                                                        onClick={() => handleRemoveNewFile(index)}
                                                    ></button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* ปุ่มเพิ่มรูป */}
                                    <div
                                        className="d-flex justify-content-center align-items-center"
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

                            {/* ปุ่มส่งข้อมูล */}
                            <div className="text-center mb-3">
                                <AlertSave
                                    onConfirm={() => {
                                        if (!dogname || !birthDay || !price || !color || !description || !personality) {
                                            setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
                                            return false;
                                        } else {
                                            updateDog();
                                        }
                                    }}
                                    title={"คุณแน่ใจหรือไม่ที่จะแก้ไขสุนัข?"}
                                    confirmText={"ยืนยัน"}
                                    successMessage={"แก้ไขสำเร็จ"}
                                    failMessage={"แก้ไขไม่สำเร็จ"}
                                >
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        style={{ width: '30%', height: '40px' }}
                                    >
                                        แก้ไขข้อมูลสุนัข
                                    </button>
                                </AlertSave>
                            </div>
                        </form>

                        {/* แสดงข้อความสำเร็จและข้อผิดพลาด */}
                        {success && (
                            <div className="alert alert-success mt-3" role="alert">
                                แก้ไขข้อมูลสุนัขสำเร็จ
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

export default EditDogForm;
