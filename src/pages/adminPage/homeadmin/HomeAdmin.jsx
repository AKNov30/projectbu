import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { binIcon, editIcon } from '../../../assets'

function HomeAdmin() {
  const [dogs, setDogs] = useState([]);

  // ฟังก์ชันดึงข้อมูลสุนัขจาก API
  const fetchDogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/dogs'); // เปลี่ยนเป็น URL API ของคุณ
      setDogs(response.data); // ตั้งค่าข้อมูลสุนัขใน state
    } catch (error) {
      console.error('Error fetching dogs:', error);
    }
  };

  // แปลงวันที่จาก ISO เป็น วัน/เดือน/ปี
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0'); // เติม 0 ข้างหน้า ถ้าต่ำกว่า 10
    const month = String(date.getMonth() + 1).padStart(2, '0'); // เดือนเริ่มจาก 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`; // คืนค่าวัน/เดือน/ปี
  };


  // ลบสุนัข 
  const handleDelete = async () => {

  };

  // ใช้ useEffect เพื่อติดต่อ API เมื่อ component ถูก mount
  useEffect(() => {
    fetchDogs();
  }, []);

  return (
    <>
      <div className="container-fluid">
        <div className="row pt-5">
          <main className="col-xl-9 col-lg-9 col-md-8 pt-3">
            <h3 className="px-3 py-3 text-center">รายชื่อสุนัข</h3>
            <div className="table-responsive">
              <table className="table table-striped table-hover bg-light border">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col" style={{ width: '5%' }}>รหัส</th>
                    <th scope="col" style={{ width: '10%' }}>ชื่อสุนัข</th>
                    <th scope="col" style={{ width: '10%' }}>วันเกิด</th>
                    <th scope="col" style={{ width: '5%' }}>ราคา</th>
                    <th scope="col" style={{ width: '7%' }}>สี</th>
                    <th scope="col" style={{ width: '10%' }} className="text-center">&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  {dogs.map((dog) => (
                    <tr key={dog.dog_id}>
                      <td>{dog.dog_id}</td>
                      <td>{dog.dogs_name}</td>
                      <td>{formatDate(dog.birthday)}</td>
                      <td>{dog.price} บาท</td> {/* Optional: Display currency */}
                      <td>{dog.color}</td>
                      <td className="text-center">
                        <a className="hover-icon me-2" href={`editdog/${dog.dog_id}`} aria-label="Edit">
                          <img className="pic-icon" src={editIcon} alt="Edit" />
                        </a>
                        <a className="hover-icon" aria-label="Delete" onClick={() => handleDelete(dog.dog_id)}>
                          <img className="pic-icon" src={binIcon} alt="Delete" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>

    </>
  )
}

export default HomeAdmin