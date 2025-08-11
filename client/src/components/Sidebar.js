import React, { useEffect, useState } from 'react'
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { FaImage } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa";
import { NavLink, useNavigate } from 'react-router-dom';
import { BiLogOut } from "react-icons/bi";
import { GoArrowUpLeft } from "react-icons/go";
import { MdGroupAdd } from "react-icons/md";
import Avatar from './Avatar';
import { useSelector } from 'react-redux';
import EditUserDetails from './EditUserDetails';
import Divider from './Divider';
import SearchUser from './SearchUser';
import CreateGroup from './CreateGroup';
const Sidebar = () => {
    const userData=useSelector((state)=>state?.auth?.signupData);
    const [editUserOpen,setEditUserOpen]=useState(false);
    const [allUser,setAllUser]=useState([]);
const [openSearchUser ,setOpenSearchUser]=useState(false);
const [openCreateGroup,setOpenCreateGroup]=useState(false);
const [allGroupChat,setAllGroupChat]=useState(false);
const[allGroups,setAllGroups]=useState([]);
const navigate=useNavigate();

const socketConnection=useSelector(state=>state?.auth?.socketConnection);

useEffect(() => {
  console.log("socketConnection", socketConnection);
  
  if (socketConnection?.connected && userData?._id) {
   
    
    setTimeout(() => {
      socketConnection.emit("sidebar", userData?._id);
          socketConnection.emit("all-group-chat",userData?._id);
    }, 100);  

    socketConnection.on("conversation",(data)=>{
      // console.log("conversation data",data);
      const conversationUserData=data.map((conversationUser,index)=>{
       if(conversationUser?.sender?._id === conversationUser?.receiver?._id){
             return{
          ...conversationUser,
          userDetails:conversationUser?.sender
            }
       }
       else if(conversationUser?.receiver?._id!==userData?._id){
            return{
          ...conversationUser,
          userDetails:conversationUser?.receiver
        }
       }else{
       return{
          ...conversationUser,
          userDetails:conversationUser?.sender
        }
       }

      })
      setAllUser(conversationUserData);
    })

socketConnection.on("all-group",(data)=>{
setAllGroups(data);
})

    
  }
}, [socketConnection, userData?._id,allGroupChat]);

const handleOnClick=()=>{
  localStorage.removeItem("user");
navigate("/checkEmailPage");

}

  return (
    <div className="w-full h-full grid grid-cols-[48px,1fr] bg-white">
      <div className="bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-600 flex flex-col justify-between">
<div>
    <NavLink onClick={()=>setAllGroupChat(false)} className={({isActive})=>`w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded ${isActive && "bg-slate-200"}`} title='chat'>
                        <IoChatbubbleEllipses
                            size={20}
                        />
                    </NavLink>

                  <div  title='Create Group' onClick={() => setAllGroupChat(prev => !prev)}
 className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded'>
              <FaUserGroup
               size={20}
              />
              
                     </div>
 
        <div title='add friend' onClick={()=>setOpenSearchUser(true)} className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded'>
        <FaUserPlus 
            size={20}
        /> 
      </div>

       <div title='Create Group' onClick={()=>setOpenCreateGroup(true)} className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded'>
      
 <MdGroupAdd
 size={20} />
        </div>
       
</div>

      <div className="flex flex-col items-center"> 
      <button className="mx-auto" title={userData?.name} onClick={()=>{setEditUserOpen(true)}}>
        <Avatar
            width={40} 
            height={40}
            name={userData?.name}
            imageUrl={userData?.profile_pic}
            userId={userData?._id}
        />
      </button>
        
         <button  onClick={handleOnClick} title='logout' className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded'>
           <span className="-ml-2">
             <BiLogOut 
            size={20}
         />
           </span>
         </button>

      </div>

      </div>

    <div className="w-full ">

<div className="h-16 flex items-center">
   <h2 className="text-xl font-bold p-4 text-slate-800 h-16">Message </h2>
</div>
 
 <div className="bg-slate-200 p-[0.5px]"></div>

 <div className="h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar">

     {
          !allGroupChat   &&    allUser.length===0 && (
        <div className="mt-12">
          <div className="flex justify-center items-center my-4 text-slate-400">
            <GoArrowUpLeft 
              size={50}
            />
          </div>
          <p className="text-lg text-center text-slate-400">Explore Users to start a conversation with.
          </p>
      
        </div>
        
      )
     }

     {
     !allGroupChat  && allUser?.map((conv,index)=>{
          return(
            <NavLink to={"/"+conv?.userDetails?._id} key={conv?._id} className="flex items-center gap-2 py-3 px-2 border border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer"> 
                
                   <div>
                     <Avatar
                      imageUrl={conv?.userDetails?.profile_pic}
                      name={conv?.userDetails?.name}
                      width={40}
                      height={40}
                     />
                      
                   </div>

                   <div>
                    <h3 className="text-ellipsis line-clamp-1 font-semibold text-base">{conv?.userDetails?.name}</h3>

                    <div className="text-slate-500 text-xs flex items-center gap-1">
                    <div className="flex items-center gap-1">
                      {
                        conv?.lastMsg?.imageUrl && (
                            <div  className="flex items-center gap-1">
                              <span><FaImage/></span>
                              {!conv?.lastMsg?.text && <span>Image</span>}
                            </div>

                        )
                      }
                       {
                        conv?.lastMsg?.videoUrl && (
                            <div  className="flex items-center gap-1">
                              <span><FaVideo/></span>
                              {!conv?.lastMsg?.text && <span>Video</span>}
                            </div>

                        )
                      }
                    </div>
                   <p>
                   {conv?.lastMsg?.text?.length > 10
                  ? conv.lastMsg.text.slice(0, 20) + '...'
                    : conv.lastMsg.text}
                                </p>


                    </div>
                  
                   </div>
                         {
                         Boolean( conv?.unseenMsg) && 
                           <p className=" text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-primary text-white font-semibold rounded-full">{conv?.unseenMsg}</p>
                         }
                     

            </NavLink>
          )
        })
     }

{allGroupChat && allGroups.length === 0 && (
  <div className="mt-12">
          <div className="flex justify-center items-center my-4 text-slate-400">
            <GoArrowUpLeft 
              size={50}
            />
          </div>
          <p className="text-lg text-center text-slate-400">Create Group to start a conversation .
          </p>
      
        </div>
)}

{
  allGroupChat && allGroups?.map((group,index)=>{
     return(
            <NavLink to={`/group/${group?._id}`} key={group?._id} className="flex items-center gap-2 py-3 px-2 border border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer"> 
                
                   <div>
                     <Avatar
                      imageUrl={group?.profile_pic}
                      name={group?.name}
                      width={40}
                      height={40}
                     />
                      
                   </div>

                   <div>
                    <h3 className="text-ellipsis line-clamp-1 font-semibold text-base">{group?.name}</h3>

                    <div className="text-slate-500 text-xs flex items-center gap-1">
                
                    </div>
                  
                   </div>
                       
            </NavLink>
          )
  })

}

 </div>

     </div>


      {
        editUserOpen  && (
            <EditUserDetails onClose={()=>setEditUserOpen(false)} user={userData}/>
        )
      }

      {/* search users */}
      {
           openSearchUser && (
             <SearchUser onClose={()=>setOpenSearchUser(false)}/>
           )
      }
     
            {
              openCreateGroup && (
                <CreateGroup onClose={()=>setOpenCreateGroup(false)}/>
              )
            }
      
    </div>
  )
}

export default Sidebar
