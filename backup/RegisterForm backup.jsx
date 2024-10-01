
const RegisterForm = () => {

  return (
    <>
    <div className="container">
      {/* Back Button */}
      <div className="row fix-row">
        <div className="col-12 pt-1">
          <a
            className="px-2 d-flex"
            href="shop"
            style={{ color: 'black', cursor: 'pointer' }}
          >
            <img src="image/back.png" style={{ width: '25px' }} alt="Back" />
            ย้อนกลับ
          </a>
        </div>
      </div>

      {/* Logo */}
      <div className="row">
        <div className="col-12 pt-3 d-flex justify-content-center">
          <img src="image/logo.png" style={{ width: '100px' }} alt="Banner Image" />
        </div>
      </div>

      {/* Title */}
      <div className="row">
        <div className="col-12 pt-3 d-flex justify-content-center">
          <h1>สมัครสมาชิก</h1>
        </div>
      </div>

      {/* Signup Form */}
      <form id="registerForm">
        <div className="row">
          <div className="col-xl-4 pt-3"></div>
          <div className="col-xl-2 pt-3">
            <label htmlFor="firstname" className="form-label">ชื่อ</label>
            <input
              name="firstname"
              type="text"
              className="form-control"
              aria-describedby="firstname"
              required
            />
          </div>
          <div className="col-xl-2 pt-3">
            <label htmlFor="lastname" className="form-label">นามสกุล</label>
            <input
              name="lastname"
              type="text"
              className="form-control"
              aria-describedby="lastname"
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="col-xl-4 pt-3"></div>
          <div className="col-xl-4 pt-3">
            <label htmlFor="email" className="form-label">อีเมล์(ใช้เป็น Username)</label>
            <input
              name="email"
              type="email"
              className="form-control"
              aria-describedby="email"
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="col-xl-4 pt-3"></div>
          <div className="col-xl-4 pt-3">
            <label htmlFor="password" className="form-label">รหัสผ่าน</label>
            <input
              name="password"
              type="password"
              className="form-control"
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="col-xl-4 pt-3"></div>
          <div className="col-xl-4 pt-3">
            <label htmlFor="confirm_password" className="form-label">ยืนยันรหัสผ่าน</label>
            <input
              name="c_password"
              type="password"
              className="form-control"
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="col-xl-4 pt-3"></div>
          <div className="col-xl-4 pt-3">
            <label htmlFor="phone" className="form-label">เบอร์โทรศัพท์</label>
            <input
              name="phone"
              type="tel"
              className="form-control"
              aria-describedby="phone"
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="col-xl-4 pt-3"></div>
          <div className="col-xl-4 pt-5">
            <button
              name="signup"
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', height: '50px' }}
            >
              สมัครสมาชิก
            </button>
          </div>
        </div>
      </form>
    </div>
    </>
  );
};

export default RegisterForm;
