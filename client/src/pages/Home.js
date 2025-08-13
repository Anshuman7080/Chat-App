import React, { useEffect } from 'react'
import { Outlet, useLocation, useNavigate, useNavigation } from 'react-router-dom'
import { fetchDetailsOfUser } from '../services/operations/UserApi'
import { useDispatch, useSelector } from 'react-redux'
import Sidebar from '../components/Sidebar'
import logo from "../assets/logo.png"
import io from "socket.io-client" 
import { setOnlineUser } from '../slices/userSlice'
import { setSocketConnection } from '../slices/auth'
const Home = () => {
const dispatch=useDispatch();
  const token=localStorage.getItem("token");
const navigate=useNavigate();

console.log("token is ",token);
const location=useLocation();
  useEffect(()=>{
dispatch( fetchDetailsOfUser(navigate,token));
  },[]);
const basePath=location.pathname === '/';


useEffect(() => {
  const socketConnection = io("https://chat-app-backend-lw56.onrender.com",{
    auth: {
      token: localStorage.getItem("token"),
    },
  });

// useEffect(() => {
//   const socketConnection = io("http://localhost:5000",{
//     auth: {
//       token: localStorage.getItem("token"),
//     },
//   });


  socketConnection.on("connect", () => {
    // console.log(" Connected:", socketConnection.id);
    // console.log("socket connection in home",socketConnection)
    dispatch(setSocketConnection(socketConnection)); 
  });

  socketConnection.on("connect_error", (err) => {
    console.error("Connection error:", err.message);
  });

  socketConnection.on("onlineUser", (data) => {
    dispatch(setOnlineUser(data));
  });

  return () => {
    socketConnection.disconnect();
  };
}, []);







  return (
    <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
   <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
<Sidebar/>
   </section>
      
          <section className={`${basePath && "hidden "}`}>
            <Outlet/>
          </section>


<div className= {`justify-center items-center flex-col gap-2 hidden ${!basePath ? "hidden" : "lg:flex"}`}>
  <div>
    <img
      src={logo}
      width={250}
      alt="logo"
    />
  </div>
  <p className="text-lg mt-2 text-slate-500 ">Select user to send message</p>
</div>

    </div>
  )
}

export default Home
