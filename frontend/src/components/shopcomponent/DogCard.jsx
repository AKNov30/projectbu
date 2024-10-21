// src/components/DogCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { logo } from '../../assets';
import { apiUrl } from '../../config/apiConfig';
import { formatPrice } from '../../utils/formatPrice';

function DogCard({ dog }) {
  let imageUrls = [];
  try {
    imageUrls = JSON.parse(dog.image_url);
  } catch (error) {
    console.error('Error parsing image_url for dog_id', dog.dog_id, error);
  }

  return (
    <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 mb-4">
      <Link
        to={`/detail-dog/${dog.dog_id}`}
        className="card-setting bg-white h-100 d-flex flex-column text-decoration-none text-dark" // เพิ่ม text-decoration-none และ text-dark เพื่อให้ลิงก์ไม่มีสไตล์เดิม
      >
        <div className="d-flex justify-content-center align-items-center p-2">
          <img
            className="setting-pic img-fluid"
            src={imageUrls.length > 0 ? `${ apiUrl }${imageUrls[0]}` : logo}
            alt={dog.dogs_name}
            style={{ maxHeight: '200px', objectFit: 'cover' }}
          />
        </div>

        <div className="card-body flex-grow-1">
          <h5 className="card-title">{dog.dogs_name}</h5>
          <p className="card-text">สี : {dog.color}</p>
          <p className="card-text">ราคา : {formatPrice(dog.price)} THB</p>
        </div>

        <div className="card-footer text-center">
          <button type="button" className="btn btn-outline-warning btn-sm">
            รายละเอียด
          </button>
        </div>
      </Link>
    </div>
  );
}

export default DogCard;
