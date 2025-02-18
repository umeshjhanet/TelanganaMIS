import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Header from './Components/Header';
import Footer from './Components/Footer';
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
import { AuthProvider } from './AuthContext';
import ShortReport from './shortreport';
import UpdateGroupModal from './Components/UpdateGroupModal';
import AddRoleModal from './Components/AddRoleModal';
import UpdateRoleModal from './Components/UpdateRoleModal'
import DBSiteReports from './dbSiteReports';
import SiteReports from './siteReports';
import PrivateRoute from './PrivateRoute';
import DailyReport from './dailyReport';
import Locationwisereport from './clientreport';
import AddRemarks from './addRemarks';
import DPRReport from './DPRReport';
import ClientDPR from './ClientDPR';
import FollowUpReportForm from './follow_up_report';
import CostingReport from './CostingReport';
import CustomerQAReport from './customerQAReport';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/uploadDatabase" element={<PrivateRoute element={<UploadDatabase />} />} />
        <Route path="/report" element={<PrivateRoute element={<Report />} />} />
        <Route path="/customerQAReport" element={<PrivateRoute element={<CustomerQAReport />} />} />
        <Route path="/dbSiteReports" element={<PrivateRoute element={<DBSiteReports />} />} />
        <Route path="/siteReports"element={<PrivateRoute element={<SiteReports />} />} />
        <Route path="/groupManager" element={<PrivateRoute element={<GroupManager />} />} />
        <Route path="/addGroupModal" element={<PrivateRoute element={<AddGroupModal />} />} />
        <Route path="/updateGroupModal" element={<PrivateRoute element={<UpdateGroupModal />} />} />
        <Route path="/userRole" element={<PrivateRoute element={<UserRole />} />} />
        <Route path="/addRoleModal" element={<PrivateRoute element={<AddRoleModal />} />} />
        <Route path="/updateRoleModal" element={<PrivateRoute element={<UpdateRoleModal />} />} />
        <Route path="/User_Form" element={<PrivateRoute element={<User_Form />} />} />
        <Route path="/User_List" element={<PrivateRoute element={<User_List />} />} />
        <Route path="/file" element={<PrivateRoute element={<File />} />} />
        <Route path="/MIS_Form" element={<PrivateRoute element={<MIS_Form />} />} />
        <Route path="/mis_updc" element={<PrivateRoute element={<MISUPDC />} />} />
        <Route path="/UpdateUserModal" element={<PrivateRoute element={<UpdateUserModal />} />} />
        <Route path="/dailyReport" element={<PrivateRoute element={<DailyReport />} />} />
        <Route path="/DPRReport" element={<PrivateRoute element={<DPRReport />} />} />
        <Route path="/clientreport" element={<PrivateRoute element={<Locationwisereport />} />} />
        <Route path="/addRemarks" element={<PrivateRoute element={<AddRemarks />} />} />
        <Route path="/ClientDPR" element={<PrivateRoute element={<ClientDPR />} />} />
        <Route path="/CostingReport" element={<PrivateRoute element={<CostingReport />} />} />
        <Route path="/follow_up_report" element={<PrivateRoute element={<FollowUpReportForm />} />} />
      </Routes>
    </Router>
    
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
reportWebVitals();

