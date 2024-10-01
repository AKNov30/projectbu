
import { Routes, Route } from "react-router-dom";

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
import Result from "./pages/adminPage/result/Result";
import './index.css'

function App() {

  return (
    <>
      <AppbarMain />
      <Routes>
        <Route path='/' element={<Home></Home>}></Route>
        <Route path='/register' element={<RegisterForm></RegisterForm>}></Route>
        <Route path='/shop' element={<Shop></Shop>}></Route>
        <Route path='/detaildog' element={<DetailDog></DetailDog>}></Route>
        <Route path='/cancle' element={<Cancle></Cancle>}></Route>
        <Route path='/history' element={<History></History>}></Route>
        <Route path='/reserve' element={<Reserve></Reserve>}></Route>

        {/* admin routes */}
        <Route path='/home-admin' element={<HomeAdmin />} />
        <Route path='/adddog' element={<AddDogForm />} />
        <Route path='/reserve-admin' element={<Reserveadmin />} />
        <Route path="/reserve/:id" element={<Reserveinfo />} />
        <Route path="/change-date" element={<ChangeDate />} />
        <Route path="/list-user" element={<ListUser />} />
        <Route path="/result" element={<Result />} />
        {/* <Route path='*' element={<Notfound />}></Route> */}
      </Routes>
    </>
  )
}

export default App