import React, { useEffect, useState } from 'react';
import { CiSearch } from "react-icons/ci";
import Loading from './Loading';
import UserSearchCard from './UserSearchCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllTheUsers, searchUserByEmailOrName } from '../services/operations/UserApi';
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const CreateGroup = ({onClose}) => {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [groupName, setGroupName] = useState("");

  const[groupMember,setGroupMember]=useState([]);
  const[groupDetail,setGroupDetail]=useState(null);
  const dispatch = useDispatch();
const user=useSelector(state=>state.auth?.signupData);

 const socketConnection=useSelector(state=>state?.auth?.socketConnection);
const navigate=useNavigate();

 useEffect(() => {
  const fetchUsers = async () => {
    setLoading(true);
    const allUsers = await fetchAllTheUsers();
    console.log("all users", allUsers);

    if (allUsers?.data?.success) {
      setSearchUser(allUsers.data.data);
    } else {
      setSearchUser([]);
    }

    setLoading(false);
  };

  fetchUsers();
}, []);




  // console.log("group Members",groupMember);

const handleCreateGroup = () => {
  if (groupName.length === 0) {
    alert("Please enter group name");
    return;
  }
  if (groupMember.length < 2) {
    alert("Please add at least 2 members");
    return;
  }

  const formData = new FormData();
  formData.append("groupName", groupName);
  formData.append("admin", user?._id);
  formData.append("groupMembers", user?._id);
  groupMember.forEach(member => {
    formData.append("groupMembers", member);
  });

  const data = {};
  formData.forEach((value, key) => {
    if (data[key]) {
      data[key] = Array.isArray(data[key]) ? [...data[key], value] : [data[key], value];
    } else {
      data[key] = value;
    }
  });

  if (socketConnection) {
    socketConnection.emit("Create-group", data);

     socketConnection.on("Invalid-Group-Name", () => {
    setGroupDetail(null);
    alert("Group Name is Already Used");
  });

  socketConnection.on("new-group", (data) => {
    console.log("new group data", data);
    setGroupDetail(data);
     navigate(`/group/${data._id}`); 
  
  });

  }

  setGroupName("");
  setGroupMember([]);
  if (onClose) onClose();
};



  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 bg-slate-700 bg-opacity-40 p-2 z-50">
      <div className="w-full max-w-lg mx-auto mt-10">
        <div className="bg-white rounded h-14 overflow-hidden flex">
          <input
            type="text"
            placeholder="Enter the group name..."
            className="w-full outline-none py-1 h-full px-4"
            onChange={(e) => setGroupName(e.target.value)}
            value={groupName}
          />
          <div className="h-14 w-14 flex justify-center items-center">
            <CiSearch size={25} />
          </div>
        </div>

        {/* display search user */}
        <div className="bg-white mt-2 w-full p-4 rounded">
          {!loading && searchUser.length === 0 && (
            <p className="text-center text-slate-500">No user found</p>
          )}

          {loading && (
            <p><Loading /></p>
          )}

          {!loading && searchUser.length > 0 && (
            searchUser.filter((userData)=>userData?._id!=user?._id).
            map((user) => (
             <UserSearchCard key={user._id} user={user} onClose={onClose} flag={true}  setGroupMember={setGroupMember}
                   />
             
            ))
          )}


           <div className=' flex justify-end mt-4'>
        <button className="bg-primary w-32 h-10 rounded-lg text-lg font-semibold " onClick={handleCreateGroup}>
          Create Group
        </button>
       </div>


        </div>
      

      
      
      </div>
      <div className="absolute top-0 right-0 text-2xl p-2 lg:text-4xl hover:text-white" onClick={onClose}>
        <button>
          <IoIosClose
          size={25} />
        </button>
      </div>
      
    </div>
  );
};

export default CreateGroup;
