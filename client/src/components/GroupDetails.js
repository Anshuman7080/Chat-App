
import React from 'react'
import Avatar from './Avatar';
import UserSearchCard from './UserSearchCard';
import { IoIosClose } from 'react-icons/io';

const GroupDetails = ({groupData,onClose}) => {
    // console.log("groupData",groupData);
  return (
    <div className=" fixed left-0 top-0 right-0 bottom-0 bg-gray-700 bg-opacity-40 flex flex-col justify-center items-center z-40">
    
    <div className="bg-green-100 p-4 py-6 m-1 w-full max-w-sm max-h-full rounded flex flex-col items-center gap-3">
       
       <div>
         {
            groupData?.profile_pic && (
                <img src={groupData?.profile_pic}
         alt="No Profile Pic"
                className="w-24 h-24 rounded-full"
            />
            )
         }

         {
            !groupData?.profile_pic && (
               <Avatar
         width={70}
             height={70}
          imageUrl={groupData?.profile_pic}
          name={groupData?.name}
           userId={groupData?._id}
         />
            )
         }
            
       </div>

       <div className="font-semibold text-xl -mt-2">
        {groupData?.name}
       </div>
     
     <div>
  <div className="text-ellipsis font-bold mt-1">Members</div>

  <div className="max-h-32 overflow-y-scroll overflow-x-hidden scrollbar flex flex-col gap-2">
    {groupData?.members?.map((member, index) => (
      <div className="flex gap-2 justify-center" key={index}>
        <UserSearchCard user={member} flag={false} />
      </div>
    ))}
  </div>
</div>


       </div>

       <div className="absolute top-0 right-0 text-2xl p-2 lg:text-4xl hover:text-white" onClick={onClose}  >
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

export default GroupDetails
