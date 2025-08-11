import React, { useState } from 'react'
import Avatar from './Avatar'
import { Link } from 'react-router-dom'
import { IoAddCircleOutline } from "react-icons/io5";
const UserSearchCard = ({user,onClose,flag,setGroupMember}) => {

  const [clicked,setClicked]=useState(false);
   const handleOnClick=()=>{
         
  setGroupMember(prev => prev.includes(user._id) ? prev : [...prev, user._id])
     setClicked(true);
   
   }
  return (
 <>

{
 
  !flag &&    <Link to={"/"+user?._id} onClick={onClose} className="flex items-center gap-3 p-2 lg:p-4 border border-transparent border-b-slate-200  hover:border hover:border-primary rounded cursor-pointer">
       <div>
       
        <Avatar
          width={50}
          height={50}
          name={user?.name}
          imageUrl={user?.profile_pic}
          userId={user?._id}
        />
       </div>
     
      <div>
        <div className="font-semibold text-ellipsis line-clamp-1">
        {user?.name}
        </div>
          <p className="text-sm text-ellipsis line-clamp-1">{user?.email}</p>
      </div>
    </Link>
}


{

  flag && 
     <div className="flex items-center justify-between gap-3  lg:p-4 border border-transparent border-b-slate-200  hover:border hover:border-primary rounded ">
       <div className='flex items-center gap-2 p-2 '>
        <Avatar
          width={50}
          height={50}
          name={user?.name}
          imageUrl={user?.profile_pic}
          userId={user?._id}
        />

         <div>
        <div className="font-semibold text-ellipsis line-clamp-1">
        {user?.name}
        </div>
          <p className="text-sm text-ellipsis line-clamp-1 hidden md:block ">{user?.email}</p>
      </div>

       </div>
     
     
              
              <div className={`items-center hover:cursor-pointer mr-4 hover:text-primary ${clicked ==true ? "text-secondary":""} `}
              onClick={handleOnClick}>
                <IoAddCircleOutline
                size={25} />
              </div>
    </div>

  
}
  
 </>
  )
}

export default UserSearchCard
