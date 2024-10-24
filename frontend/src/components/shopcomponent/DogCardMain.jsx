// src/components/Card.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { logo } from '../../assets'; // Default logo image

function DogCardMain({ product, imageUrls }) {
  // ตรวจสอบว่า imageUrls มีค่าและเป็น array ที่ไม่ว่างเปล่า
  const validImageUrl = imageUrls.find(url => url && url.startsWith("https://res.cloudinary.com"));

  return (
    <div className="col-xl-3 col-lg-6 col-md-6 d-md-flex align-items-stretch pt-3" key={product.dog_id}>
      <Link to={`/detail-dog/${product.dog_id}`} className="card-setting bg-white">
        <div className="d-flex justify-content-center">
          {validImageUrl ? (
            <img
              className="setting-pic justify-content-center img-fluid"
              src={validImageUrl} // ใช้ URL ที่ตรวจสอบแล้วว่าถูกต้อง
              alt={product.dogs_name}
            />
          ) : (
            <img
              className="setting-pic justify-content-center img-fluid"
              src={logo} // ใช้รูปสำรองหากไม่มี URL ที่ถูกต้อง
              alt={product.dogs_name}
            />
          )}
        </div>

        <div className="setting-text">
          <h5 className="fw-bold pt-3">{product.dogs_name}</h5>
          <p>รหัส : {product.dog_id}</p>
          <p>สี : {product.color}</p>
          <p>อายุ : {product.age}</p>
          <p>ราคา : {product.price} THB</p>
        </div>
        <div className="d-flex justify-content-center pt-3">
          <button type="button" className="btn btn-outline-warning setting-btn-reserve">
            รายละเอียด
          </button>
        </div>
      </Link>
    </div>
  );
}

export default DogCardMain;
