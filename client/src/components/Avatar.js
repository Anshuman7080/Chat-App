

import React from "react"
import { PiUserCircle } from "react-icons/pi";
import { useSelector } from "react-redux";
const Avatar =({userId,name,imageUrl,width,height})=>{
    let avatarFirstName="";
    let avatarLastName="";
    const onlineUser=useSelector(state=>state?.user?.onlineUser);
   console.log("online user",onlineUser);

    if(name){
        const splitName=name?.split(" ");
        if(splitName.length > 1){
            avatarFirstName=splitName[0][0] ;
            avatarLastName= splitName[1][0];
        }else{
            avatarFirstName=splitName[0][0];
        }
    }
    const avatar=`https://api.dicebear.com/5.x/initials/svg?seed=${avatarFirstName} ${avatarLastName}`

     const isOnline=onlineUser.includes(userId);
     

return (
    <div className="text-slate-800 relative  rounded-full shadow border font-bold " style={{width:width+"px" , height:height+"px" }}>
       {
        imageUrl ? (
            <img
               src={imageUrl}
               width={width}
               height={height}
               alt={name}
             className="rounded-full object-cover w-full h-full"
            />
        ):(
            name ? (
                <div style={{width:width+"px" , height:height+"px",}} className="overflow-hidden rounded-full flex justify-center items-center">
                  <img
                    src={avatar}
                    width={width}
                    height={height}
                     alt={name}
                       className='rounded-full object-cover w-full h-full ' 
                  />
                  

                </div>
            ):(
                <PiUserCircle size={width}/>
            )
        )
       }
      
        {
            isOnline && (
                <div className="bg-green-600 p-1 absolute bottom-2 -right-1 z-10 rounded-full "></div>
            )
        }

    </div>
)



}

export default Avatar;