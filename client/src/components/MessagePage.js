import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import Avatar from './Avatar';
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaAngleLeft } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { FaImage } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import Loading  from "./Loading"
import backgroundImage from "../assets/wallapaper.jpeg"
import { LuSendHorizontal } from "react-icons/lu";
import uploadFile from '../helper/uploadFile';
import moment from "moment"
import UserDeatils from './UserDeatils';
const MessagePage = () => {
  const params=useParams();
  const[allMessage,setAllMessage]=useState([]);
  const [showUserDetails,setShowUserDetails]=useState(false);
  const user=useSelector(state=>state.auth?.signupData);
const [loading,setLoading]=useState(false);
const [open ,setOpen]=useState(false);
const currentMessage=useRef(null);
const [dataUser,setDataUser]=useState({
name:"",
email:"",
profile_pic:"",
online:false,
_id:""
})
const[message,setMessage]=useState({
text:"",
imageUrl:"",
videoUrl:""
})

const [showDeleteOptions, setShowDeleteOptions] = useState(false);
const [selectedMessageId, setSelectedMessageId] = useState(null);

useEffect(()=>{
  if(currentMessage.current){
    currentMessage.current.scrollIntoView({behavior:"smooth" ,block:"end"});
  }
},[allMessage])
const handleUploadVideoImage=()=>{
setOpen(prev=> !prev)
}

const handleContextMenu = (e, messageId) => {
  e.preventDefault();
  setSelectedMessageId(messageId);
  setShowDeleteOptions(true);
};

const handleLongPress = (messageId) => {
  setSelectedMessageId(messageId);
  setShowDeleteOptions(true);
};


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

const handleOnchange = (e)=>{
    const { name, value} = e.target

    setMessage(preve => {
      return{
        ...preve,
        text : value
      }
    })
  }



 const socketConnection=useSelector(state=>state?.auth?.socketConnection);
// console.log("socketconnection in message page",socketConnection )

useEffect(() => {

  if (!socketConnection) return;
 

  const handleConnect = () => {
  socketConnection.emit('message-page', params?.userId);
  socketConnection.emit("seen",params?.userId)
  };
 
   socketConnection.on('connect', handleConnect);

 if (socketConnection.connected) {
    setTimeout(() => {
      handleConnect();
    }, 100); 
  }

  
  const handleMessageUser = (data) => {
    setDataUser(data);
  };
  const handleMessage = (data) => {
    setAllMessage(data);
  };

  socketConnection.on("message-user", handleMessageUser);
  socketConnection.on("message", handleMessage);

  return () => {
    socketConnection.off("connect", handleConnect);
    socketConnection.off("message-user", handleMessageUser);
    socketConnection.off("message", handleMessage);
  };
}, [socketConnection, params?.userId]);



const handleSendMessage = (e)=>{
    e.preventDefault()

    if(message.text || message.imageUrl || message.videoUrl){
     
      if(socketConnection){
      
        socketConnection.emit('new-message',{
          sender : user?._id,
          receiver : params.userId,
          text : message.text,
          imageUrl : message.imageUrl,
          videoUrl : message.videoUrl,
          msgByUserId : user?._id
        })
  
        setMessage({
          text : "",
          imageUrl : "",
          videoUrl : ""
        })
      }
    }
  }

  return (
    <div style ={{backgroundImage:`url(${backgroundImage})`}} className="bg-no-repeat bg-cover  ">

       <header className="sticky top-0 h-16 bg-white flex justify-between items-center px-4">
         <div className="flex items-center gap-4 ">
            <Link to={"/"} className="lg:hidden">
                    <FaAngleLeft
                    size={25} />
            </Link>
          <div>
            <Avatar
              width={50}
              height={50}
              imageUrl={dataUser?.profile_pic}
              name={dataUser?.name}
              userId={dataUser?._id}
            />
          </div>
          <div>
           <h3 className="font-semibold text-lg my-0  text-ellipsis line-clamp-1" >{dataUser?.name}</h3> 
           <p className="-my-2 text-sm">
            {
              dataUser.online ? <span className="text-primary">online</span> : <span className="text-slate-400">offline</span>
            }
           </p>
          </div>
         </div>
    
    <div>
   <button className="cursor-pointer hover:text-primary" onClick={()=>setShowUserDetails(true)}>
       <BsThreeDotsVertical />
   </button>
    </div>

       </header>

       {/* show all messages */}
       <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50">
    
{/* all message showing here */}

<div className=" flex flex-col gap-2 py-2  mx-1" ref={currentMessage}>
  {
    allMessage.map((msg,index)=>{
      return(
        <div key={index} className={` p-1 py-1 my-2 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md  ${user._id===msg.msgByUserId ? "ml-auto bg-teal-100" : "bg-white"}`}>
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


          <p className="px-2">{msg.text}</p>
          <p className="text-xs ml-auto w-fit">{moment(msg.createdAt).format("hh:mm")}</p>
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
        message.videoUrl && (
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
        showUserDetails && 
        <UserDeatils  profile_pic={dataUser?.profile_pic} name={dataUser?.name} email={dataUser?.email} onClose={()=>setShowUserDetails(false)}/>
       }

    </div>
  )
}

export default MessagePage
