import React from 'react'

function Shop() {
    //ข้อมูลหมา
    const products = [
        {
          id: 'BR001',
          name: 'ปั๊กสีน้ำตาลธรรมชาติ4',
          color: 'ดำ',
          age: '4 วัน',
          price: '4,500 THB',
          imgSrc: 'image/dogblack.png',
          link: 'detaildog',
        },
        {
          id: 'BR002',
          name: 'ปั๊กสีน้ำตาลธรรมชาติ3',
          color: 'ขาว',
          age: '14 วัน',
          price: '4,500 THB',
          imgSrc: 'image/dogwhite.png',
          link: 'detaildog',
        },
        {
          id: 'BR003',
          name: 'ปั๊กสีน้ำตาลธรรมชาติ2',
          color: 'ขาว-ดำ',
          age: '34 วัน',
          price: '4,500 THB',
          imgSrc: 'image/dogpanda.png',
          link: 'detaildog',
        },
        {
          id: 'BR004',
          name: 'ปั๊กสีน้ำตาลธรรมชาติ1',
          color: 'น้ำตาล',
          age: '44 วัน',
          price: '4,500 THB',
          imgSrc: 'image/dogbrown.png',
          link: 'detaildog',
        },
        {
            id: 'BR005',
            name: 'ปั๊กสีน้ำตาลธรรมชาติ1',
            color: 'น้ำตาล',
            age: '44 วัน',
            price: '4,500 THB',
            imgSrc: 'image/dogbrown.png',
            link: 'detaildog',
          },
          {
            id: 'BR006',
            name: 'ปั๊กสีน้ำตาลธรรมชาติ1',
            color: 'น้ำตาล',
            age: '44 วัน',
            price: '4,500 THB',
            imgSrc: 'image/dogbrown.png',
            link: 'detaildog',
          },
      ];
  return (
    <>
        <div className="container-fluid">
      <div className="row">
        <div className="col-xl-1 col-lg-1 col-md-0"></div>
        <div className="col-xl-2 col-lg-2 col-md-2 pt-3">
          <h1>Shop</h1>
        </div>
      </div>

      {/* Start Search CSS */}
      <div className="row">
        <div className="col-xl-2 col-lg-1 col-md-0"></div>

        <div className="col-xl-3 col-lg-3 col-md-4 col-6">
          <label>ค้นหา</label>
          <input type="search" className="form-control rounded" placeholder="Search" />
        </div>

        <div className="col-xl-1 col-lg-2 col-md-2 col-3">
          <label>สี</label>
          <div>
            <select className="form-select">
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
            <select className="form-select">
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
            <select className="form-select">
              <option value="all">ทั้งหมด</option>
              <option value="2024">0-2500</option>
              <option value="2023">2500-3500</option>
              <option value="2022">3500-4500</option>
              <option value="2021">4500-5500</option>
            </select>
          </div>
        </div>

        <div className="col-xl-1 col-lg-1 col-md-1 col-1" style={{ cursor: 'pointer' }}>
          <img src="image/search.png" alt="Search" height="25" className="btn-search" />
        </div>
      </div>
    </div>

    <div className="row">     
      <div className="col-lg-10 m-auto">
        <div className="row">
          {products.map((product) => (
            <div className="col-xl-3 col-lg-6 col-md-6 d-md-flex align-items-stretch pt-3" key={product.id}>
              <a className="card-setting bg-white" href={product.link}>
                <div className="d-flex justify-content-center">
                  <img className="setting-pic justify-content-center img-fluid" src={product.imgSrc} alt={product.name} />
                </div>
                
                <div className="setting-text">
                  <h5 className="fw-bold pt-3">{product.name}</h5>
                  <p>รหัส : {product.id}</p>
                  <p>สี : {product.color}</p>
                  <p>อายุ : {product.age}</p>
                  <p>ราคา : {product.price}</p>
                </div>
                <div className="d-flex justify-content-center pt-3">
                  <button type="button" className="btn btn-outline-warning setting-btn-reserve">รายละเอียด</button>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  )
}

export default Shop