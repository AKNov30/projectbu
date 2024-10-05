// src/components/DetailDog.jsx

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import DogCard from '../../../components/shopcomponent/DogCard'; // สร้างไฟล์ DogCard.jsx สำหรับการใช้งานซ้ำ

function DetailDog() {
  const { dog_id } = useParams(); // ดึง dog_id จาก URL
  const [dog, setDog] = useState(null); // สถานะสำหรับรายละเอียดสุนัข
  const [relatedDogs, setRelatedDogs] = useState([]); // สถานะสำหรับสุนัขที่เกี่ยวข้อง
  const [loading, setLoading] = useState(true); // สถานะการโหลด
  const [error, setError] = useState(null); // สถานะข้อผิดพลาด

  // ฟังก์ชั่นคำนวณอายุจากวันเกิด
  const calculateAge = (birthday) => {
    const birthDate = new Date(birthday);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months -= 1;
      const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += previousMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    let ageParts = [];
    if (days > 0) ageParts.push(`${days} วัน`);
    if (months > 0) ageParts.push(`${months} เดือน`);
    if (years > 0) ageParts.push(`${years} ปี`);

    return ageParts.join(' ');
  };

  // ดึงรายละเอียดสุนัขเฉพาะตัว
  const fetchDogDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/dogs/${dog_id}`);
      setDog(response.data);
    } catch (err) {
      console.error('Error fetching dog details:', err);
      setError(err.response?.data?.message || 'Failed to fetch dog details.');
    } finally {
      setLoading(false);
    }
  };

  // ดึงสุนัขที่เกี่ยวข้องตามสี
  const fetchRelatedDogs = async (color) => {
    try {
      const response = await axios.get('http://localhost:5000/api/shop-dogs');
      // คัดกรองสุนัขที่มีสีเดียวกันและไม่ใช่ตัวปัจจุบัน
      let related = response.data.filter(
        (item) => item.color === color && item.dog_id !== dog_id
      );

      // ถ้าไม่มีสุนัขที่มีสีเดียวกัน ให้เลือกสุนัขใดก็ได้ที่ไม่ใช่ตัวปัจจุบัน
      if (related.length < 4) {
        const additionalDogs = response.data.filter(
          (item) => item.dog_id !== dog_id && !related.includes(item)
        );
        // สุ่มสุนัขเพิ่มเติมและเลือกสุนัขที่ต้องการ
        const shuffledAdditionalDogs = additionalDogs.sort(() => 0.5 - Math.random());
        related = [...related, ...shuffledAdditionalDogs].slice(0, 4);
      } else {
        // สุ่มสุนัขที่เกี่ยวข้องและเลือกสูงสุด 4 ตัว
        related = related.sort(() => 0.5 - Math.random()).slice(0, 4);
      }

      setRelatedDogs(related);
    } catch (err) {
      console.error('Error fetching related dogs:', err);
    }
  };

  useEffect(() => {
    fetchDogDetails();
  }, [dog_id]);

  useEffect(() => {
    if (dog) {
      fetchRelatedDogs(dog.color);
    }
  }, [dog]);

  if (loading) return <div className="container-fluid"><p>Loading...</p></div>;
  if (error) return <div className="container-fluid"><p>Error: {error}</p></div>;
  if (!dog) return <div className="container-fluid"><p>No dog found.</p></div>;

  // แปลง URL รูปภาพ
  let imageUrls = [];
  try {
    imageUrls = JSON.parse(dog.image_url);
  } catch (error) {
    console.error('Error parsing image_url for dog_id', dog.dog_id, error);
  }

  return (
    <>
      <div className="container-fluid">
        {/* หัวข้อ */}
        <div className="row">
          <div className="col-1"></div>
          <div className="col-xl-2 pt-3">
            <h1>รายละเอียด</h1>
          </div>
        </div>

        {/* ส่วนรายละเอียดสุนัข */}
        <div className="row">
          <div className="col-xl-1 col-lg-1 col-md-0"></div>
          <div className="col-xl-3 col-lg-5 col-md-5">
            <img
              className="setting-pic-info just-flex-center img-fluid"
              src={imageUrls.length > 0 ? `http://localhost:5000${imageUrls[0]}` : dogBrown}
              alt={dog.dogs_name}
            />
          </div>
          <div className="col-xl-7 col-lg-5 col-md-6 bg-grey p-3">
            <h2>{dog.dogs_name}</h2>
            <h3>฿ {dog.price} THB</h3>
            <h4>รายละเอียด</h4>
            <p className="px-3">รหัส : {dog.dog_id}</p>
            <p className="px-3">
              วันเกิด : {new Date(dog.birthday).toLocaleDateString()} (อายุ {calculateAge(dog.birthday)})
            </p>
            <p className="px-3">สี : {dog.color}</p>
            <p className="px-3">นิสัย : {dog.personality}</p>

            <div className="just-flex-end d-flex pt-3">
              <button type="button" className="btn btn-outline-secondary setting-btn-reserve">โทร</button>
              <Link to="/reserve" className="btn btn-warning setting-btn-reserve mx-2">จอง</Link>
            </div>
          </div>
          <div className="col-1 col-md-0"></div>
        </div>

        {/* รูปภาพเพิ่มเติม */}
        <div className="row">
          <div className="col-1"></div>
          <div className="col-xl-5 col-lg-11">
            {imageUrls.slice(1).map((url, index) => (
              <img
                key={index}
                className="setting-pic-info-small just-flex-center img-fluid me-2"
                src={`http://localhost:5000${url}`}
                alt={`${dog.dogs_name} ${index + 2}`}
              />
            ))}
          </div>
        </div>

        {/* ส่วนสุนัขที่เกี่ยวข้อง */}
        <div className="row">
          <div className="col-1"></div>
          <div className="col-10">
            <hr />
            <p>คุณอาจสนใจ</p>
          </div>
          <div className="col-1"></div>
        </div>

        <div className="row">
          <div className="col-xl-1 col-lg-1 col-md-0 col-sm-0"></div>
          <div className="col-xl-10 col-lg-10 col-md-12">
            <div className="row">
              {relatedDogs.slice(0, 4).map((relatedDog) => (
                <DogCard key={relatedDog.dog_id} dog={relatedDog} />
              ))}
            </div>
          </div>
          {/* <div className="col-1"></div> */}
        </div>
        {/* End Related Dogs Section */}
      </div>
    </>
  );
}

export default DetailDog;
