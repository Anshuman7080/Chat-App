import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import RegisterPage from './pages/RegisterPage';
import CheckPasswordPage from './pages/CheckPasswordPage';
import CheckEmailPage from './pages/CheckEmailPage';
import MessagePage from './components/MessagePage';

import AuthLayouts from './layout';
import UpdatePassword from './pages/UpdatePassword';
import GroupChatPage from './components/GroupChatPage';

import PrivateRoute from './helper/privateRoute';



function App() {
  return (
    <div >
<Routes>
  <Route path="/" element={
    <PrivateRoute>
  <Home/>
  </PrivateRoute>}>
  
    <Route path=":userId" element={
      <PrivateRoute>
    <MessagePage/>
      </PrivateRoute>
    }/>
      <Route path="group/:groupId" element={
        <PrivateRoute>
        <GroupChatPage />
        </PrivateRoute>} />
  </Route>

  <Route path="/registerPage" element={<AuthLayouts><RegisterPage/></AuthLayouts>}></Route>
  <Route path="/checkPasswordPage" element={<AuthLayouts><CheckPasswordPage/></AuthLayouts>}/>
  <Route path="/checkEmailPage" element={<AuthLayouts><CheckEmailPage/></AuthLayouts>}/>
 <Route path="/updatePassword" element={<AuthLayouts><UpdatePassword/></AuthLayouts>}/>


</Routes>
    </div>
  );
}

export default App;
