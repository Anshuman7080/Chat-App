import React, { useEffect, useState } from 'react';
import { IoIosClose } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import { checkPasswordOfUser } from '../services/operations/authAPI';
import { PiUserCircle } from "react-icons/pi";
import Avatar from '../components/Avatar';
import { useDispatch, useSelector } from 'react-redux';

const CheckPasswordPage = () => {
  const [data, setData] = useState({
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.signupData);
  console.log("user Data in checkPassword", userData);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    if (!userData?.name) {
      navigate("/checkEmailPage");
    }
  }, []);

  console.log("user id is", userData?._id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("password is",data.password);

    const formData = new FormData();
    formData.append("password", data.password);
    formData.append("userId", userData?._id);
    dispatch(checkPasswordOfUser(formData, navigate));

    setData({ password: "" }); 
  };

  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
        <div className="w-fit mx-auto mb-2 flex justify-center items-center flex-col">
          <Avatar
            width={70}
            height={70}
            name={userData?.name}
            imageUrl={userData?.profile_pic}
            userId={userData?._id}
          />
          <h2 className="font-semibold text-lg mt-1">{userData?.name}</h2>
        </div>

        <h1>Welcome to Chat app!</h1>
        <form className="grid gap-4 mt-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="enter your password"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>

          <button className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 text-white leading-relaxed tracking-wide">
            Let's Go
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckPasswordPage;
