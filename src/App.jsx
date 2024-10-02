
import { Routes, Route, useLocation } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

import AppbarMain from "./components/appbar/AppbarMain";
import AppbarAdmin from "./components/appbar/AppbarAdmin";

//page
import Shop from "./pages/mainPage/Shop";
import Home from "./pages/mainPage/Home";
import Cancle from "./pages/mainPage/Cancle";
import RegisterForm from "./components/LoginForm/RegisterForm";
import History from "./pages/mainPage/History";
import DetailDog from "./components/detaildog/DetailDog";
import Reserve from "./components/detaildog/Reserve";

import HomeAdmin from "./pages/adminPage/homeadmin/HomeAdmin";
import AddDogForm from "./pages/adminPage/AddDogForm";
import Reserveadmin from "./pages/adminPage/reserve/Reserveadmin";
import Reserveinfo from "./pages/adminPage/reserve/Reserveinfo";
import ChangeDate from "./pages/adminPage/ChangeDate";
import ListUser from "./pages/adminPage/listUser/ListUser";
import EditUser from "./pages/adminPage/listUser/EditUser";
import Result from "./pages/adminPage/result/Result";
// import './index.css'

function App() {
  const location = useLocation();

  // Check if the current path belongs to the admin routes
  const isAdminRoute = location.pathname.startsWith("/home-admin") ||
                       location.pathname.startsWith("/adddog") ||
                       location.pathname.startsWith("/reserve-admin") ||
                       location.pathname.startsWith("/reserve/") ||
                       location.pathname.startsWith("/change-date") ||
                       location.pathname.startsWith("/list-user") ||
                       location.pathname.startsWith("/result");

  return (
    <>
      <AppbarMain />
      <div className="row">
      <div className="col-md-2">
        {isAdminRoute && <AppbarAdmin />}
      </div>
      <div className={`col-md-${isAdminRoute ? '10' : '12'}`}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cancle" element={<Cancle />} />
        <Route path="/detaildog" element={<DetailDog />} />
        <Route path="/reserve" element={<Reserve />} />
        <Route path="/history" element={<History />} />

        {/* Admin routes */}
        <Route
          path="/home-admin"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <HomeAdmin />
            </PrivateRoute>
          }
        />
        <Route
          path="/adddog"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AddDogForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/reserve-admin"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <Reserveadmin />
            </PrivateRoute>
          }
        />
        <Route
          path="/reserve/:id"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <Reserveinfo />
            </PrivateRoute>
          }
        />
        <Route
          path="/change-date"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <ChangeDate />
            </PrivateRoute>
          }
        />
        <Route
          path="/list-user"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <ListUser />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <EditUser />
            </PrivateRoute>
          }
        />
        <Route
          path="/result"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <Result />
            </PrivateRoute>
          }
        />
        {/* <Route path='*' element={<Notfound />}></Route> */}
      </Routes>
      </div>
      </div>
    </>
  )
}

export default App