// src/components/Shop.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import calculateAge from '../../../utils/calculateAge';
import { search } from '../../../assets';
import { logo } from '../../../assets'; // เพิ่มรูป default image ถ้าไม่มีรูป
import { Link } from 'react-router-dom';

function Shop() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterColor, setFilterColor] = useState('ทั้งหมด');
  const [filterAge, setFilterAge] = useState('ทั้งหมด');
  const [filterPrice, setFilterPrice] = useState('all');

  // Function to fetch dog data from API
  const fetchDogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/shop-dogs'); // ใช้ endpoint ใหม่
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching dogs:', error);
    }
  };

  useEffect(() => {
    fetchDogs();
  }, []);

  // Function to filter products based on search and filters
  const getFilteredProducts = () => {
    return products.filter(product => {
      const ageInMilliseconds = new Date() - new Date(product.birthday);
      const price = parseInt(product.price.replace(/,/g, '').replace(' THB', ''), 10);

      // Search filter
      const matchesSearch = product.dogs_name.toLowerCase().includes(searchTerm.toLowerCase());

      // Color filter
      const matchesColor = filterColor === 'ทั้งหมด' || product.color === filterColor;

      // Age filter
      let matchesAge = false;
      switch (filterAge) {
        case 'ทั้งหมด':
          matchesAge = true;
          break;
        case '14d':
          matchesAge = ageInMilliseconds <= 14 * 24 * 60 * 60 * 1000;
          break;
        case '28d':
          matchesAge = ageInMilliseconds <= 28 * 24 * 60 * 60 * 1000;
          break;
        case '2m':
          matchesAge = ageInMilliseconds <= 2 * 30 * 24 * 60 * 60 * 1000; // 2 เดือน
          break;
        case '3m':
          matchesAge = ageInMilliseconds <= 3 * 30 * 24 * 60 * 60 * 1000; // 3 เดือน
          break;
        default:
          matchesAge = true;
      }

      // Price filter
      let matchesPrice = true;
      if (filterPrice === '2024') {
        matchesPrice = price <= 2500;
      } else if (filterPrice === '2023') {
        matchesPrice = price >= 2500 && price <= 3500;
      } else if (filterPrice === '2022') {
        matchesPrice = price >= 3500 && price <= 4500;
      } else if (filterPrice === '2021') {
        matchesPrice = price >= 4500 && price <= 5500;
      }

      return matchesSearch && matchesColor && matchesAge && matchesPrice;
    });
  };

  const filteredProducts = getFilteredProducts();

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-1 col-lg-1 col-md-0"></div>
          <div className="col-xl-2 col-lg-2 col-md-2 pt-3">
            <h1>Shop</h1>
          </div>
        </div>

        {/* Start Search and Filters */}
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
            <div>
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
          </div>

          <div className="col-xl-2 col-lg-2 col-md-2 col-3">
            <label>อายุ(ไม่เกิน)</label>
            <div>
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
          </div>

          <div className="col-xl-2 col-lg-3 col-md-3 col-5">
            <label>ราคา</label>
            <div>
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
          </div>

          <div className="col-xl-1 col-lg-1 col-md-1 col-1" style={{ cursor: 'pointer' }}>
            <img src={search} alt="Search" height="25" className="btn-search" />
          </div>
        </div>
      </div>

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

              return (
                <div className="col-xl-3 col-lg-6 col-md-6 d-md-flex align-items-stretch pt-3" key={product.dog_id}>
                  <Link to={`/detail-dog/${product.dog_id}`} className="card-setting bg-white"> {/* Use Link here */}
                    <div className="d-flex justify-content-center">
                      {imageUrls.length > 0 ? (
                        <img
                          className="setting-pic justify-content-center img-fluid"
                          src={`http://localhost:5000${imageUrls[0]}`} // Show the first image from the array
                          alt={product.dogs_name}
                        />
                      ) : (
                        <img
                          className="setting-pic justify-content-center img-fluid"
                          src={logo} // Default image
                          alt={product.dogs_name}
                        />
                      )}
                    </div>

                    <div className="setting-text">
                      <h5 className="fw-bold pt-3">{product.dogs_name}</h5>
                      <p>รหัส : {product.dog_id}</p>
                      <p>สี : {product.color}</p>
                      <p>อายุ : {calculateAge(product.birthday)}</p>
                      <p>ราคา : {product.price}</p>
                    </div>
                    <div className="d-flex justify-content-center pt-3">
                      <button type="button" className="btn btn-outline-warning setting-btn-reserve">
                        รายละเอียด
                      </button>
                    </div>
                  </Link> {/* Close Link here */}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Shop;
