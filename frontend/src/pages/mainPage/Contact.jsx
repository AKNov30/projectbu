import React from 'react'
import { banner } from '../../assets/'
import { contact } from '../../assets/'
function Contact() {
  return (
    <>
    { <div className="container-fullid">
      <div className='text-center pt-2'>
        <img src={ contact } className='div-contact' alt="Banner Image" />
      </div>
    </div> }
    <div class="d-flex justify-content-center pt-4">

    </div>
    <div className="container">

          <div className='row pt-3'>

            {/* <div className='col-12 text-center pb-3'>
              <h4>สุนัขพันธุ์ปั๊ก</h4>
              เป็นสุนัขพันธุ์เล็กที่ได้รับความนิยมมากเพราะมีลักษณะหน้าตาน่ารัก ขี้เล่น และมีนิสัยเป็นมิตรกับคนและสัตว์อื่น ๆ <br></br> เป็นอย่างดี โดยรวมแล้ว ปั๊กเป็นสุนัขที่เลี้ยงง่ายแต่ต้องดูแลในบางจุดอย่างใกล้ชิด
            </div> */}

            <div className='col-6 pt-5 d-flex justify-content-start'>
              <div>
                <h4 className='text-center'>การดูแลปั๊ก</h4>
                <hr></hr>
                <div>

                  <p>
                    <strong>การให้อาหาร : </strong> ปั๊กมีแนวโน้มจะอ้วนง่าย ควรควบคุมปริมาณอาหารให้เหมาะสม เลือกอาหารที่มีคุณค่าทางโภชนาการและเหมาะสมสำหรับสุนัขพันธุ์เล็ก
                  </p>

                </div>
                

                <p>
                <strong>การออกกำลังกาย : </strong> แม้ปั๊กจะเป็นสุนัขขนาดเล็ก แต่ก็ควรพาไปออกกำลังกายทุกวัน การพาเดินเล่นหรือเล่นเกมในบ้านจะช่วยให้พวกเขาได้เคลื่อนไหว
                </p>

                <p>
                <strong>ดูแลสุขภาพการหายใจ : </strong> เนื่องจากปั๊กมีใบหน้าสั้น ทำให้พวกเขาอาจมีปัญหาเกี่ยวกับการหายใจได้ โดยเฉพาะเมื่ออากาศร้อน ควรหลีกเลี่ยงการพาปั๊กออกไปข้างนอกเมื่ออากาศร้อนเกินไป และควรให้อยู่ในพื้นที่ที่มีอากาศถ่ายเทดี
                </p>

                <p>
                <strong>ทำความสะอาดใบหน้า : </strong> ลักษณะใบหน้าของปั๊กมีรอยย่น ซึ่งสามารถสะสมฝุ่นและเชื้อโรคได้ง่าย ควรทำความสะอาดบริเวณใบหน้าและรอยย่นเป็นประจำเพื่อลดโอกาสการติดเชื้อ
                </p>

                <p>
                <strong>การดูแลขนและผิวหนัง : </strong> ปั๊กมีขนสั้นและอาจร่วงง่าย ควรแปรงขนอย่างสม่ำเสมอ และหมั่นตรวจสอบผิวหนังเพื่อหาสัญญาณของการระคายเคืองหรือการติดเชื้อ
                </p>
    
              </div>
              
            </div>

            <div className='col-6 pt-5 d-flex justify-content-center'>
              <div>
                <h4 className='text-center'>ติดต่อฉัน</h4>
                <hr></hr>
                <div className='pt-2'>เบอร์โทรศัพท์ : 0879948760 (ปีเตอร์)</div>
                <div className='pt-2'>อีเมล : Sittichok.Juns@bumail.net</div>
                <div className='pt-2'>ไลน์ : TiieterND</div>
                <div className='pt-2'>ที่อยู่ : NBPUGBKK <br></br>
                    พฤกษาวิวล์ 107 สุขสวัสดิ์78 บ้านเลขที่ 230/75 <br></br>
                    เขตทุ่งครุ แขวงทุ่งครุ จ.กรุงเทพมหานคร 10290
                </div>
                    
              
              </div>

            </div>

          </div>



    </div>
    
  </>
  )
}

export default Contact