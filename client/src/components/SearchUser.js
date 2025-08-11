import React, { useEffect, useState } from 'react';
import { CiSearch } from "react-icons/ci";
import Loading from './Loading';
import UserSearchCard from './UserSearchCard';
import { useDispatch } from 'react-redux';
import { fetchAllTheUsers, searchUserByEmailOrName } from '../services/operations/UserApi';
import { IoIosClose } from "react-icons/io";
const SearchUser = ({onClose}) => {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();

  const handleSearchUser = async () => {
    if (!search.trim()) {
      return;
    }
    setLoading(true);
  
    const response = await dispatch(searchUserByEmailOrName({search:search}));
    if (response?.data?.success) {
      setSearchUser(response?.data?.data);
    } else {
      setSearchUser([]);
    }
    setLoading(false);
  };


 useEffect(() => {
  const fetchUsers = async () => {
    setLoading(true);
    const allUsers = await fetchAllTheUsers();
  

    if (allUsers?.data?.success) {
      setSearchUser(allUsers.data.data);
    } else {
      setSearchUser([]);
    }

    setLoading(false);
  };

  fetchUsers();
}, []);


  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearchUser();
    }, 500); 

    return () => clearTimeout(delayDebounce);
  }, [search]);

  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 bg-slate-700 bg-opacity-40 p-2 z-30">
      <div className="w-full max-w-lg mx-auto mt-10">
        <div className="bg-white rounded h-14 overflow-hidden flex">
          <input
            type="text"
            placeholder="Search user by name, email...."
            className="w-full outline-none py-1 h-full px-4"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
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
            searchUser.map((user) => (
              <UserSearchCard key={user._id} user={user} onClose={onClose} flag={false} />
            ))
          )}
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

export default SearchUser;
