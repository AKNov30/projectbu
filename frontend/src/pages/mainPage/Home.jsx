import React from 'react';

import { banner } from '../../assets/'

function Home() {
  return (
    <>
      <div className="container-fullid">
        <img src={ banner } className="img-fluid" alt="Banner Image" />
      </div>
      <div class="d-flex justify-content-center pt-4">
        <div className="underline-home "></div>
      </div>
    
      <h3 class="pt-2 text-center text-new-dark">ยินดีต้อนรับเข้าสู่เว็บไซต์ "PuglifeHouse"</h3>
      <h4 class="text-center">เว็บไซต์สำหรับขายสุนัขพันธุ์ปั๊กโดยเฉพาะ</h4>
    </>
  );
}

export default Home;
