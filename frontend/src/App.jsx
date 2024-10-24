
import { Routes, Route, useLocation } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

import AppbarMain from "./components/appbar/AppbarMain";
import AppbarAdmin from "./components/appbar/AppbarAdmin";

//page
import Shop from "./pages/mainPage/shop/Shop";
import Home from "./pages/mainPage/Home";
import Cancle from "./pages/mainPage/Cancle";
import RegisterForm from "./components/LoginForm/RegisterForm";
import History from "./pages/mainPage/History";
import DetailDog from "./pages/mainPage/shop/DetailDog";
import Reserve from "./pages/mainPage/shop/Reserve";
import Pay from "./pages/mainPage/shop/Pay";
import Contact from "./pages/mainPage/Contact";

import HomeAdmin from "./pages/adminPage/homeadmin/HomeAdmin";
import EditDogForm from "./pages/adminPage/addDog/EditDogForm";
import AddDogForm from "./pages/adminPage/addDog/AddDogForm";
import Reserveadmin from "./pages/adminPage/reserve/Reserveadmin";
import Reserveinfo from "./pages/adminPage/reserve/Reserveinfo";
import ChangeDate from "./pages/adminPage/ChangeDate";
import ListUser from "./pages/adminPage/listUser/ListUser";
import EditUser from "./pages/adminPage/listUser/EditUser";
import Result from "./pages/adminPage/result/Result";

import Notfound from "./Notfound";

function App() {
  const location = useLocation();

  // Check if the current path belongs to the admin routes
  const isAdminRoute = location.pathname.startsWith("/admin");

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
        <Route path="/contact" element={<Contact />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cancle" element={<Cancle />} />
        <Route path="/reserve" element={<Reserve />} />
        <Route path="/history" element={<History />} />
        <Route
          path="/cancle"
          element={
            <PrivateRoute allowedRoles={['member']}>
              <Cancle />
            </PrivateRoute>
          }
        />
        <Route path="/detail-dog/:dog_id"element={<DetailDog />}/>
        <Route
          path="/reserve/:dog_id"
          element={
            <PrivateRoute allowedRoles={['member']}>
              <Reserve />
            </PrivateRoute>
          }
        />
        <Route
          path="/pay"
          element={
            <PrivateRoute allowedRoles={['member']}>
              <Pay />
            </PrivateRoute>
          }
        />
        <Route
          path="/history"
          element={
            <PrivateRoute allowedRoles={['member']}>
              <History />
            </PrivateRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <HomeAdmin />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/home-admin"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <HomeAdmin />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/adddog"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AddDogForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/editdog/:dogId"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <EditDogForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/reserve-admin"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <Reserveadmin />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/reserve/:id"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <Reserveinfo />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/change-date"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <ChangeDate />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/list-user"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <ListUser />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/edit/:id"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <EditUser />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/result"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <Result />
            </PrivateRoute>
          }
        />
        <Route path='*' element={<Notfound />}></Route>
      </Routes>
      </div>
      </div>
    </>
  )
}

export default App