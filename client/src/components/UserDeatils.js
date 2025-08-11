


import React from 'react'
import { IoIosClose } from "react-icons/io";

const UserDeatils = ({profile_pic,email,name,onClose}) => {
   
  return (
    <div className="fixed top-0 bottom-0 right-0 left-0 bg-gray-700  bg-opacity-40 flex flex-col justify-center items-center z-10  ">
      
      
       <div className="bg-green-100 p-4 py-6 m-1 w-full max-w-sm rounded flex flex-col items-center gap-3">
         <div>
            <img src={profile_pic}
                className="w-24 h-24  rounded-full"
            />
        </div>
        
        <div className="text-xl font-semibold">{name}</div>
        <div className="-mt-2 text-sm">
            {email}
        </div>
       </div>

 <div className="absolute top-0 right-0 text-2xl p-2 lg:text-4xl hover:text-white" onClick={onClose} >
        <button>
          <IoIosClose
          size={30} 
            color='black'
          />
        </button>
      </div>
        
       </div>


  )
}

export default UserDeatils
