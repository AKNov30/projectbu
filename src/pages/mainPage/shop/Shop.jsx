import React, { useEffect, useState } from 'react';
import axios from 'axios';
import calculateAge from '../../../utils/calculateAge';
import { search } from '../../../assets';
import DogCardMain from '../../../components/shopcomponent/DogCardMain';

function Shop() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterColor, setFilterColor] = useState('ทั้งหมด');
  const [filterAge, setFilterAge] = useState('ทั้งหมด');
  const [filterPrice, setFilterPrice] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch dog data from API
  const fetchDogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/shop-dogs', {
        params: {
          page: currentPage,
          limit: 8,
          color: filterColor,
          age: filterAge,
          price: filterPrice
        }
      });
  
      console.log('Response data:', response.data); // ตรวจสอบข้อมูล response
  
      setProducts(response.data.dogs);  // ดึงข้อมูลสุนัขจาก body
      setTotalPages(response.data.totalPages);  // ดึง totalPages จาก body
    } catch (error) {
      console.error('Error fetching dogs:', error);
    }
  };
  
  

  useEffect(() => {
    fetchDogs();
  }, [currentPage, filterColor, filterAge, filterPrice]);

  // Filter products based on search term
  const getFilteredProducts = () => {
    return products.filter(product => {
      const matchesSearch = product.dogs_name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  };

  const filteredProducts = getFilteredProducts();

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-1 col-lg-1 col-md-0"></div>
          <div className="col-xl-2 col-lg-2 col-md-2 pt-3">
            <h1>Shop</h1>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="row">
          <div className="col-xl-2 col-lg-1 col-md-0"></div>

          <div className="col-xl-3 col-lg-3 col-md-4 col-6">
            <label>ค้นหา</label>
            <input
              type="search"
              className="form-control rounded"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="col-xl-1 col-lg-2 col-md-2 col-3">
            <label>สี</label>
            <select
              className="form-select"
              value={filterColor}
              onChange={(e) => setFilterColor(e.target.value)}
            >
              <option value="ทั้งหมด">ทั้งหมด</option>
              <option value="น้ำตาล">น้ำตาล</option>
              <option value="ดำ">ดำ</option>
              <option value="ขาว">ขาว</option>
              <option value="ขาว-ดำ">ขาว-ดำ</option>
            </select>
          </div>

          <div className="col-xl-2 col-lg-2 col-md-2 col-3">
            <label>อายุ (ไม่เกิน)</label>
            <select
              className="form-select"
              value={filterAge}
              onChange={(e) => setFilterAge(e.target.value)}
            >
              <option value="ทั้งหมด">ทั้งหมด</option>
              <option value="14d">14 วัน</option>
              <option value="28d">28 วัน</option>
              <option value="2m">2 เดือน</option>
              <option value="3m">3 เดือน</option>
            </select>
          </div>

          <div className="col-xl-2 col-lg-3 col-md-3 col-5">
            <label>ราคา</label>
            <select
              className="form-select"
              value={filterPrice}
              onChange={(e) => setFilterPrice(e.target.value)}
            >
              <option value="all">ทั้งหมด</option>
              <option value="2024">0-2500</option>
              <option value="2023">2500-3500</option>
              <option value="2022">3500-4500</option>
              <option value="2021">4500-5500</option>
            </select>
          </div>
          <div className="col-xl-1 col-lg-1 col-md-1 col-1">
                <img src={search} alt="Logo" height="25" class="btn-search" />
          </div>
        </div>

        {/* Display filtered products */}
        <div className="row mt-4">
          <div className="col-lg-10 m-auto">
            <div className="row">
              {filteredProducts.map((product) => {
                let imageUrls = [];
                try {
                  imageUrls = JSON.parse(product.image_url);
                } catch (error) {
                  console.error('Error parsing image_url for dog_id', product.dog_id, error);
                }

                const age = calculateAge(product.birthday);

                return (
                  <DogCardMain key={product.dog_id} product={{ ...product, age }} imageUrls={imageUrls} />
                );
              })}
            </div>
          </div>
        </div>

        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-center mt-2">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link btn btn-primary"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}  // ปิดการใช้งานปุ่มหากเป็นหน้าที่ 1
              >
                Previous
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, index) => (
              <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                <button
                  className="page-link btn btn-outline-primary"
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link btn btn-primary"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}  // ปิดการใช้งานปุ่มหากเป็นหน้าสุดท้าย
              >
                Next
              </button>
            </li>
          </ul>
        </nav>

      </div>
    </>
  );
}

export default Shop;
