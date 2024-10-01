import React from 'react';

function LoginForm() {
  return (
    <>
    {/* Start Modal_Login CSS */}
    <div
        className="modal fade"
        id="login"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-12 d-flex justify-content-center">
                  <img
                    src="image/logo.png"
                    style={{ width: '100px' }}
                    alt="Logo"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-12 d-flex justify-content-center pt-3">
                  <h2>ล็อคอิน</h2>
                </div>
              </div>

              {/* ฟอร์มสำหรับล็อคอิน */}
              <form action="/login" method="POST">
                {/* เพิ่ม form */}
                <div className="row">
                  <div className="col-12 pt-3 px-5">
                    <label htmlFor="email" className="form-label">
                      อีเมล์(ใช้เป็น Username)
                    </label>
                    <input
                      name="email"
                      type="email"
                      className="form-control"
                      aria-describedby="fisrtname"
                      required
                    />
                  </div>

                  <div className="col-12 pt-3 px-5">
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
                  <div className="col-12 d-flex justify-content-end pt-4 px-5">
                    <button name="signin" type="submit" className="btn btn-primary">
                      ล็อคอิน
                    </button>
                  </div>
                </div>
              </form>

              <div className="row">
                <div className="col-12 d-flex justify-content-center pt-4 px-5">
                  <a className="px-2" href="register">สมัครสมาชิก</a>
                  {/* ลิงก์ไปหน้าสมัครสมาชิก */}
                  <a className="px-2" href="home-admin">Admin</a>
                  {/* ลิงก์ไปหน้าแอดมิน */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginForm;
