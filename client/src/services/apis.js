
// const BASE_URL=process.env.REACT_APP_BASE_URL;

const BASE_URL="https://chat-app-backend-lw56.onrender.com/api/v1";
console.log(BASE_URL);

export const endpoints={
    REGISTER_API:BASE_URL+"/register",
    VERIFY_EMAIL:BASE_URL+'/check-email',
    VERIFY_PASSWORD:BASE_URL+'/check-password',
    USER_DETAILS:BASE_URL+'/user-details',
    UPDATE_USER_DETAILS:BASE_URL + '/update-user',
      FIND_USER:BASE_URL+'/search-user',
      FIND_ALL_USERS:BASE_URL+'/search-all-users',
      UPDATEGROUPDETAILS:BASE_URL+"/updateGroupDetails"
}
