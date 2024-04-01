import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import reportWebVitals from './reportWebVitals';
import Header from './Components/Header';
import Footer from './Footer';
import Dashboard from './dashboard';
import Report from './report';
import File from './file';
import Login from './Login';
import MISUPDC from './mis_updc';
import MIS_Form from './MIS_Form';
import User_Form from './User_Form';
import User_List from './User_List';
import GroupManager from './groupManager';
import UserRole from './userRole';
import UploadDatabase from './uploadDatabase';
import UpdateUserModal from './Components/UpdateUserModal';
import AddGroupModal from './Components/AddGroupModal';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/uploadDatabase' element={<UploadDatabase/>}/>
        <Route path="/report" element={<Report />} />
        <Route path="/groupManager" element={<GroupManager />} />
        <Route path="/groupManager" element={<AddGroupModal />} />
        <Route path="/userRole" element={<UserRole />} />
        <Route path="/User_Form" element={<User_Form />} />
        <Route path="/User_List" element={<User_List />} />
        <Route path="/file" element={<File />} />
        <Route path="/MIS_Form" element={<MIS_Form/>}/>
        <Route path="/mis_updc" element={<MISUPDC/>}/>
        <Route path="/User_List" element={<UpdateUserModal />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
