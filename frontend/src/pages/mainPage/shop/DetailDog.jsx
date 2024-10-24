// src/components/DetailDog.jsx

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { apiUrl } from '../../../config/apiConfig';
import calculateAge from '../../../utils/calculateAge';
import DogCard from '../../../components/shopcomponent/DogCard';
import { formatPrice } from '../../../utils/formatPrice';

function DetailDog() {
  const { dog_id } = useParams(); // ดึง dog_id จาก URL
  const [dog, setDog] = useState(null); // สถานะสำหรับรายละเอียดสุนัข
  const [relatedDogs, setRelatedDogs] = useState([]); // สถานะสำหรับสุนัขที่เกี่ยวข้อง
  const [loading, setLoading] = useState(true); // สถานะการโหลด
  const [error, setError] = useState(null); // สถานะข้อผิดพลาด
  const [user, setUser] = useState(null);

  // ดึง user_role จาก localStorage
  const [userRole, setUserRole] = useState(localStorage.getItem('user_role') || '');

  // ดึงรายละเอียดสุนัขเฉพาะตัว
  const fetchDogDetails = async () => {
    try {
      const response = await api.get(`/api/dogs/${dog_id}`);
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
    // console.log(typeof dog_id);
    try {
      const response = await api.get('/api/all-dogs');
      // คัดกรองสุนัขที่มีสีเดียวกันและไม่ใช่ตัวปัจจุบัน
      let related = response.data.filter(
        (item) => item.color === color && item.dog_id != dog_id
      );

      // ถ้าไม่มีสุนัขที่มีสีเดียวกัน ให้เลือกสุนัขใดก็ได้ที่ไม่ใช่ตัวปัจจุบัน
      if (related.length < 4) {
        const additionalDogs = response.data.filter(
          (item) => item.dog_id != dog_id && !related.includes(item)
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
      <div className="container">
        {/* หัวข้อ */}
        <div className="row">
          <div className="col-1"></div>
          <div className="col-xl-2 pt-3 pb-2">
            <h1>รายละเอียด</h1>
          </div>
        </div>

        {/* ส่วนรายละเอียดสุนัข */}
        <div className="row">
          <div className="col-xl-1 col-lg-1 col-md-0"></div>
          <div className="col-xl-4 col-lg-5 col-md-5">
            <img
              className="setting-pic-info just-flex-center img-fluid"
              src={imageUrls.length > 0 ? `${apiUrl}${imageUrls[0]}` : dogBrown}
              alt={dog.dogs_name}
            />
          </div>
          <div className="col-xl-7 col-lg-5 col-md-6 bg-grey p-3">
            <h2>{dog.dogs_name}</h2>
            <h3>ราคา : {formatPrice(dog.price)} บาท</h3>
            <h4 className="px-3">รายละเอียด</h4>
            <div className="dog-info-grid px-5">
              <div>รหัส</div> <div>: {dog.dog_id}</div>
              <div>วันเกิด</div> 
              <div>: {new Date(dog.birthday).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })} (อายุ {calculateAge(dog.birthday)})</div>
              <div>สี</div> <div>: {dog.color}</div>
              <div>ลักษณะนิสัย</div> <div>: {dog.personality}</div>
            </div>
            <div className="just-flex-end d-flex pt-3">
              
              {/* ถ้าไม่ได้ login หรือ role=admin จะไม่สามารถกดจองได้ */}
              {userRole === 'member' ? (
                <Link to={`/reserve/${dog.dog_id}`} className="btn btn-warning setting-btn-reserve mx-2">จอง</Link>
              ) : (
                <button type="button" className="btn btn-warning setting-btn-reserve mx-2" disabled>จอง</button>
              )}
            </div>
            <div className="d-flex justify-content-center pt-4">**สุนัขทุกตัวได้ฉีดวัคซีนแรกเกิดทุกตัวแล้ว**</div>
            <div className="d-flex justify-content-center">สามารถสอบถามข้อมูลเพิ่มเติมได้ที่ เบอร์โทร : 087-994-8760</div>
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
                src={`${apiUrl}${url}`}
                alt={`${dog.dogs_name} ${index + 2}`}
              />
            ))}
          </div>
        </div>

        {/* ส่วนสุนัขที่เกี่ยวข้อง */}
        <div className="row">
          <div className="col-1"></div>
          <div className="col-11">
            <hr/>
            <h4>คุณอาจสนใจ</h4>
          </div>
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
