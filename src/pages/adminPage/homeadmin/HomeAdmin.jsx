import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AlertDelete } from '../../../components/alert/Alert';

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

  //ลบสุนัข
  const deleteDog = async (dog_id) => {
    try {
      await axios.delete(`http://localhost:5000/api/dogs/${dog_id}`);
      // Refresh the dog list after deletion
      fetchDogs();
    } catch (error) {
      console.error('Error deleting dog:', error);
      alert('Error deleting dog. Please try again.');
    }
  };

  // ใช้ useEffect เพื่อติดต่อ API เมื่อ component ถูก mount
  useEffect(() => {
    fetchDogs();
  }, []);

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-11 pt-3 d-flex justify-content-center">
            <h1>รายชื่อสุนัข</h1>
          </div>
        </div>

        <div>
          <table className="table table-striped table-hover">
            <thead>
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
                <tr key={dog.dog_id} className=''>
                  <td>{dog.dog_id}</td>
                  <td>{dog.dogs_name}</td>
                  <td>{formatDate(dog.birthday)}</td>
                  <td>{dog.price} บาท</td> {/* Optional: Display currency */}
                  <td>{dog.color}</td>
                  <td className="text-center">
                    <a className="hover-icon me-2" href={`editdog/${dog.dog_id}`} aria-label="Edit">
                      <img className="pic-icon" src={editIcon} alt="Edit" />
                    </a>
                    <AlertDelete
                      onDelete={() => deleteDog(dog.dog_id)}
                      title="คุณแน่ใจหรือไม่ที่จะลบสุนัข?"
                      text="คุณจะไม่สามารถกู้คืนได้อีก!"
                      confirmText="ยืนยัน!"
                      successTitle="ลบเรียบร้อย!"
                      successText="สุนัขได้ถูกลบแล้ว."
                      >
                      <img className="pic-icon" src={binIcon} alt="Delete" />
                    </AlertDelete>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </>
  )
}

export default HomeAdmin