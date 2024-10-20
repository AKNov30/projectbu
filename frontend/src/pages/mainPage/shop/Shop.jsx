import React, { useEffect, useState } from 'react';
import calculateAge from '../../../utils/calculateAge';
import { search } from '../../../assets';
import DogCardMain from '../../../components/shopcomponent/DogCardMain';
import api from '../../../config/apiConfig';
import Pagination from '../../../components/pagination/Pagination';

function Shop() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterColor, setFilterColor] = useState('ทั้งหมด');
  const [filterAge, setFilterAge] = useState('ทั้งหมด');
  const [filterPrice, setFilterPrice] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Fetch dog data from API
  const fetchDogs = async () => {
    try {
      setLoading(true); // ตั้งค่า loading เป็น true ก่อนดึงข้อมูล
      const response = await api.get('/api/shop-dogs', {
        params: {
          page: currentPage,
          limit: 8,
          color: filterColor,
          age: filterAge,
          price: filterPrice
        }
      });

      setProducts(response.data.dogs);
      setTotalPages(response.data.totalPages);
      setLoading(false); // ตั้งค่า loading เป็น false เมื่อดึงข้อมูลสำเร็จ
    } catch (error) {
      console.error('Error fetching dogs:', error);
      setError('มีข้อผิดพลาดในการดึงข้อมูล'); // แสดงข้อความข้อผิดพลาด
      setLoading(false); // ตั้งค่า loading เป็น false เมื่อเกิดข้อผิดพลาด
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

  // If loading, show loading message
  if (loading) return <p>Loading...</p>;

  // If error, show error message
  if (error) return <p>{error}</p>;

  return (
    <>
      <div className="container-fluid">
        <div className="row">

          <div className="col-xl-12 col-lg-12 col-md-12 pt-4 d-flex justify-content-center">
            <h1 className="text-logo">PUGLIFE HOUSE SHOP</h1>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="row d-flex justify-content-center py-4">

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
              <option value="2024">0 - 2,500</option>
              <option value="2023">2,500 - 3,500</option>
              <option value="2022">3,500 - 4,500</option>
              <option value="2021">4,500 - 5,500</option>
            </select>
          </div>
          <div className="underline"></div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {/* Display filtered products */}
        <div className="row">
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

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

      </div>
    </>
  );
}

export default Shop;
