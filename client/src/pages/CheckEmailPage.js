import React, { useEffect, useState } from 'react';
import { IoIosClose } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import { checkEmailOfUser, registerUser } from '../services/operations/authAPI';
import { PiUserCircle } from "react-icons/pi";
import { useDispatch, useSelector } from 'react-redux';

import { setSignupData } from '../slices/auth';

const CheckEmailPage = () => {
  const [data, setData] = useState({
    email: "",
  });

  const navigate = useNavigate();

const dispatch=useDispatch();


  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(()=>{
localStorage.removeItem("user");
  dispatch(setSignupData(null));
  },[]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

     const formData = new FormData();
formData.append("email", data.email);

dispatch(checkEmailOfUser(formData, navigate));

  setData(prev=>({
    email:"",
  }));

  };



  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
         <div className="w-fit mx-auto mb-2">
          <PiUserCircle
          size={80} />

         </div>
        
        <h1>Welcome to Chat app!</h1>
        <form className="grid gap-4 mt-3" onSubmit={handleSubmit}>
          

          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="enter your email"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>

          <button  className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 text-white leading-relaxed tracking-wide">
            Let's Go
          </button>
        </form>

        <p className="text-center my-3">New User?
          <Link to={"/registerPage"} className="hover:text-primary font-semibold">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default CheckEmailPage;
