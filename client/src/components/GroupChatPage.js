import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import backgroundImage from "../assets/wallapaper.jpeg"
import { BsThreeDotsVertical } from "react-icons/bs";
import Avatar from './Avatar';
import { FaAngleLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { LuSendHorizontal } from "react-icons/lu";
import { IoClose } from 'react-icons/io5';
import Loading from './Loading';
import uploadFile from '../helper/uploadFile';
import { FaPlus } from 'react-icons/fa';
import { FaImage } from 'react-icons/fa';
import { FaVideo } from 'react-icons/fa';
import moment from 'moment';
import UserDeatils from './UserDeatils';
import EditGroupDetails from './EditGroupDetails';
import GroupDetails from './GroupDetails';
const GroupChatPage = () => {

  const[allMessage,setAllMessage]=useState([]);
  const [showAllGroup,setShowAllGroup]=useState(false);
  const [showOptions,setShowOptions]=useState(false);
  const[message,setMessage]=useState({
  text:"",
  imageUrl:"",
  videoUrl:""
  })
  const [changeGroupDetail,setChangeGroupDetail]=useState(false);
  const currentMessage=useRef(null);
  const [loading,setLoading]=useState(false);
  const params=useParams();
  const[showGroupDetails,setShowGroupDetails]=useState(false);
  const user=useSelector((state)=>state?.auth?.signupData)
  const [groupData,setGroupData]=useState(null);
  const [open ,setOpen]=useState(false);
const socketConnection=useSelector((state)=>state?.auth?.socketConnection);

  useEffect(()=>{
    if(currentMessage.current){
      currentMessage.current.scrollIntoView({behaviour:"smooth" ,block:"end"});
    }
  },[allMessage])

// console.log("socket in groupChatPage",socketConnection);

useEffect(() => {

  if (!socketConnection) return;
 

  const handleConnect = () => {

  socketConnection.emit('Group-message-page', params?.groupId);
  socketConnection.on("group-details",(data)=>{
// console.log("group-details",data);
setGroupData(data);

  })
  socketConnection.emit("group-message",user?._id)

  };
 


 if (socketConnection.connected) {
    setTimeout(() => {
      handleConnect();
    
    }, 100);
  }


  socketConnection.on("groupMessageUpdate", (newMessage) => {
    // console.log("Received new message:", newMessage);
    setAllMessage(newMessage); 

  });

   return () => {
    socketConnection.off("groupMessageUpdate");
    socketConnection.off("group-details");
  };

}, [socketConnection, params?.groupId]);

// console.log("groupDetails",groupData)
// console.log("all messages",allMessage);

const handleOnchange = (e)=>{
    const { name, value} = e.target

    setMessage(preve => {
      return{
        ...preve,
        text : value
      }
    })
  }


const handleSendMessage=(e)=>{
e.preventDefault();
const payload = {
  groupId: params?.groupId,
  userId: user?._id,
  content: {
    text: message?.text,
     imageUrl:message?.imageUrl,
  videoUrl:message?.videoUrl,
    sender: user?._id
  }
};

console.log("Payload to send:", payload);

  socketConnection.emit("group-message",payload);

 setMessage({
          text : "",
          imageUrl : "",
          videoUrl : ""
        })
  

// console.log("coming here");
//   socketConnection.on("groupMessageUpdate",(data)=>{
//   console.log("groupMessageUpdate",data);
// setAllMessage(data);
// })


}


 const handleClearImage = ()=>{
    setMessage(preve => {
      return{
        ...preve,
        imageUrl : ""
      }
    })
  }

   const handleClearVideo = ()=>{
    setMessage(preve => {
      return{
        ...preve,
        videoUrl : ""
      }
    })
  }

  const handleUploadVideoImage=()=>{
setOpen(prev=> !prev)
}


  const handleUploadImage = async(e)=>{
    const file = e.target.files[0]

    setLoading(true)
    const uploadPhoto = await uploadFile(file)
    setLoading(false)
   setOpen(false);

    setMessage(preve => {
      return{
        ...preve,
        imageUrl : uploadPhoto.url
      }
    })

  }

  const handleUploadVideo = async(e)=>{
    const file = e.target.files[0]

    setLoading(true)
    const uploadPhoto = await uploadFile(file)
    setLoading(false)
    setOpen(false)

    setMessage(preve => {
      return{
        ...preve,
        videoUrl : uploadPhoto.url
      }
    })
  }


  const handleOnClick=()=>{
    setChangeGroupDetail(true);
    setShowOptions(false);
  }

  const handleOnClickForGroupDetails=()=>{
    setShowGroupDetails(true);
    setShowOptions(false);
  }


  return (
      <div style ={{backgroundImage:`url(${backgroundImage})`}} className="bg-no-repeat bg-cover ">

     <header className="sticky top-0 z-20 h-16 bg-white flex justify-between items-center px-4 ">
     
         <div className="flex items-center gap-4 ">
            <Link to={"/"} className="lg:hidden">
                    <FaAngleLeft
                    size={25} />
            </Link>
          <div>
            <Avatar
              width={50}
              height={50}
              imageUrl={groupData?.profile_pic}
              name={groupData?.name}
              userId={groupData?._id}
            />
          </div>
          <div>
           <h3 className="font-semibold text-lg my-0  text-ellipsis line-clamp-1" >{groupData?.name}</h3> 
          </div>
         </div>
    
  <div className="relative">
  <button
    className="cursor-pointer hover:text-primary"
    onClick={() => setShowOptions(prev => !prev)}
    aria-expanded={showOptions}
  >
    <BsThreeDotsVertical />
  </button>

  {showOptions && (
   <>

    <div className="absolute min-w-32 top-full right-5 mt-2 flex flex-col gap-1 border border-gray-500 bg-gray-200 shadow-md p-2 rounded-md z-50">
  <div onClick={handleOnClickForGroupDetails} className="cursor-pointer hover:text-primary">Group Details</div>
  <hr className="border-gray-400" />
  
  <div onClick={handleOnClick} className="cursor-pointer hover:text-primary">Edit Group Details</div>
  
</div>

   </>
  )}
</div>


       </header>


          {/* show all messages */}
       <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50 " >
    
{/* all message showing here */}

<div className=" flex flex-col gap-2 py-2  mx-1" ref={currentMessage}>
  {
    allMessage?.map((msg,index)=>{
      return(
        <div key={index} className={` p-1 relative py-1 my-2 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md  ${user._id===msg?.msgByUserId?._id ? "ml-auto bg-teal-100" : " ml-10 bg-white"}`}>
      
         {/* editing group messsage visuals */}
          <div>
            <img
              src={msg?.msgByUserId?.profile_pic}
              className="absolute w-7 h-7 rounded-full -ml-9"
            />
            <div className="-mt-1">
              <p className="text-xs font-semibold text-rose-400">
                {msg?.msgByUserId?.name}
              </p>
            </div>
          </div>

          <div className="w-full">
            {
            msg?.imageUrl && (
           <img
            src={msg?.imageUrl}
            className="w-full h-full object-scale-down"
           />
            )
          }
    
            {
            msg?.videoUrl && (
           <video
            src={msg?.videoUrl}
            className="w-full h-full object-scale-down"
            controls
           />
            )
          }
          </div>


          <p className="px-2 flex flex-wrap">{msg?.text}</p>
          <p className="text-xs -pb-2 ml-auto w-fit">{moment(msg.createdAt).format("hh:mm")}</p>
        </div>
      )
    })
  }
</div>

   {/* upload image display */}
      {
        message.imageUrl && (
  <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex  justify-center items-center rounded overflow-hidden">
           <div className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"  
           onClick={handleClearImage}>
            <IoClose size={30}/>
           </div>
           <div className="bg-white p-3">
             <img
              src={message?.imageUrl}
                 className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
              alt="uploadImage"
             />
           </div>
       </div>
        )
      }

      {/* upload video display */}

      {
        message?.videoUrl && (
  <div className="w-full h-full  sticky bottom-0 bg-slate-700 bg-opacity-30  flex justify-center items-center rounded overflow-hidden">
           <div className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"  
           onClick={handleClearVideo}>
            <IoClose size={30}/>
           </div>
           <div className="bg-white p-3">
             <video
              src={message?.videoUrl}
              controls
              muted
              autoPlay
            className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
             />
           </div>
       </div>
        )
      }

      {
        loading && (
         <div className="w-full h-full flex justify-center items-center">
           <Loading/>
         </div>
        )
      }

       </section>


       {/* send message */}
       <section className="h-16 bg-white flex items-center p-4">
          <div className=" relative">
          <button onClick={handleUploadVideoImage} 
          className=" flex justify-center items-center w-11 h-11  rounded-full hover:bg-primary hover:text-white">
              <FaPlus
              size={20} />
          </button>
          {/* video and image */}
         {
           open  &&  (
<div className="bg-white shadow rounded absolute bottom-14 w-36 p-2 ">
      <form>
        <label htmlFor="uploadImage"
        className="flex items-center p-2  px-3 gap-3 hover:bg-slate-200 cursor-pointer"> 
        <div className="text-primary">
          <FaImage size={18}/>
        </div>
        <p>Image</p>
        </label>

         <label htmlFor="uploadVideo"
          className="flex items-center p-2  px-3 gap-3 hover:bg-slate-200 cursor-pointer"> 
        <div className="text-purple-500">
            <FaVideo 
              size={18}
            />    
        </div>
        <p>Video</p>
        </label>
      
       <input
        type="file"
        id="uploadImage"
        onChange={handleUploadImage}
        className="hidden"
       />
       
       <input
        type="file"
        id="uploadVideo"
        onChange={handleUploadVideo}
          className="hidden"
       />
    
      </form>
          </div>
           )
         }

          </div>
          {/* input box */}

          <form className="h-full w-full flex gap-2" onSubmit={handleSendMessage}>
         
            <input
              type="text"
               name="text"
              placeholder='Type here message...'
              className="py-1 px-4 outline-none w-full h-full"
              value={message.text}
              onChange={handleOnchange}
            />
            <button className="text-primary hover:text-secondary">
             <LuSendHorizontal 
              size={28}
             />

            </button>
          
          </form>
        
       </section>


    {
      changeGroupDetail && (
        <div>
          <EditGroupDetails groupDetails={groupData} onClose={setChangeGroupDetail}/>
        </div>
      )
    }


{
  showGroupDetails  && (
    <div>
      <GroupDetails groupData={groupData} onClose={()=>{setShowGroupDetails(false)}}/>
    </div>
  )
}


    </div>
  )
}

export default GroupChatPage
