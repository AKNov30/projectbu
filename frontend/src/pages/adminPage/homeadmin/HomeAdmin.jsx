import React, { useEffect, useState } from 'react';
import { AlertDelete } from '../../../components/alert/Alert';
import { binIcon, editIcon } from '../../../assets';
import api from '../../../config/apiConfig';
import Pagination from '../../../components/pagination/Pagination'
import { formatPrice } from '../../../utils/formatPrice';

function HomeAdmin() {
  const [dogs, setDogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // หน้าปัจจุบัน
  const [totalPages, setTotalPages] = useState(1); // จำนวนหน้าทั้งหมด

  // ฟังก์ชันดึงข้อมูลสุนัขจาก API
  const fetchDogs = async (page) => {
    try {
      const response = await api.get(`/api/dogs?page=${page}&limit=14`);
      setDogs(response.data.dogs);
      setTotalPages(response.data.totalPages); // ตั้งค่าจำนวนหน้าทั้งหมด
    } catch (error) {
      console.error('Error fetching dogs:', error);
    }
  };

  // แปลงวันที่จาก ISO เป็น วัน/เดือน/ปี
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  // ลบสุนัข
  const deleteDog = async (dog_id) => {
    try {
      await api.delete(`/api/dogs/${dog_id}`);
      fetchDogs(currentPage); // Refresh list หลังลบ
    } catch (error) {
      console.error('Error deleting dog:', error);
      alert('Error deleting dog. Please try again.');
    }
  };

  // เปลี่ยนหน้า
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchDogs(page);
  };

  // ใช้ useEffect เพื่อติดต่อ API เมื่อ component ถูก mount
  useEffect(() => {
    fetchDogs(currentPage);
  }, [currentPage]);

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12 pt-3 d-flex justify-content-center">
            <h1>จัดการสุนัข</h1>
          </div>
        </div>

        <div>
          <table className="table table-striped table-hover border">
            <thead className='head-table'>
              <tr>
                <th scope="col" style={{ width: '5%' }}>รหัส</th>
                <th scope="col" style={{ width: '10%' }}>ชื่อสุนัข</th>
                <th scope="col" style={{ width: '10%' }}>วันเกิด</th>
                <th className="text-right" scope="col" style={{ width: '5%' }}>ราคาสุนัข (บาท)</th>
                <th scope="col" style={{ width: '7%' }}>สี</th>
                <th scope="col" style={{ width: '10%' }} className="text-center">&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {dogs.map((dog) => (
                <tr className="text-right" key={dog.dog_id}>
                  <td>{dog.dog_id}</td>
                  <td>{dog.dogs_name}</td>
                  <td>{formatDate(dog.birthday)}</td>
                  <td>{formatPrice(dog.price)}</td> 
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

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
}

export default HomeAdmin;
