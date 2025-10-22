import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Header from './Components/NewHeader';
import Footer from './Components/Footer';
import Dashboard from './Pages/dashboard';
import Report from './Pages/report';
import File from './Pages/file';
import Login from './Login';
import MISUPDC from './mis_updc';
import MIS_Form from './Pages/MIS_Form';
import User_Form from './Pages/User_Form';
import User_List from './Pages/User_List';
import GroupManager from './Pages/groupManager';
import UserRole from './Pages/userRole';
import UploadDatabase from './Pages/uploadDatabase';
import UpdateUserModal from './Components/UpdateUserModal';
import AddGroupModal from './Components/AddGroupModal';
import { AuthProvider } from './AuthContext';
import ShortReport from './Pages/shortreport';
import UpdateGroupModal from './Components/UpdateGroupModal';
import AddRoleModal from './Components/AddRoleModal';
import UpdateRoleModal from './Components/UpdateRoleModal';
import PrivateRoute from './PrivateRoute';
import DBSiteReports from './Pages/dbSiteReports';
import SiteReports from './Pages/siteReports';
import DailyReport from './Pages/dailyReport';
import FollowUpReportForm from './Pages/follow_up_report';
import DPRReport from './Pages/DPRReport';
import ClientDPR from './Pages/ClientDPR';
import DevelopmentPage from './Pages/developmentPage';
import CumulativeReport from './Pages/cumulativeReport';
import CustomerQAReport from './Pages/customerQAReport';
import { createRoot } from 'react-dom/client';
import AddRemarks from './Pages/addRemarks';
import Locationwisereport from './Pages/clientreport';


const AppContent = () => {
  const location = useLocation('');
  const [showSideBar, setShowSideBar] = useState(false);

  return (
    <>
      {location.pathname !== '/' && location.pathname !== '/clientreport' && (
        <Header showSideBar={showSideBar} setShowSideBar={setShowSideBar} />
      )}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard showSideBar={showSideBar} />} />} />
        <Route path="/uploadDatabase" element={<PrivateRoute element={<UploadDatabase showSideBar={showSideBar} />} />} />
        <Route path="/report" element={<PrivateRoute element={<Report showSideBar={showSideBar} />} />} />
        <Route path="/dailyReport" element={<PrivateRoute element={<DailyReport showSideBar={showSideBar} />} />} />
        <Route path="/dbSiteReports" element={<PrivateRoute element={<DBSiteReports showSideBar={showSideBar} />} />} />
        <Route path="/siteReports" element={<PrivateRoute element={<SiteReports showSideBar={showSideBar} />} />} />
        <Route path="/groupManager" element={<PrivateRoute element={<GroupManager showSideBar={showSideBar} />} />} />
        <Route path="/addGroupModal" element={<PrivateRoute element={<AddGroupModal showSideBar={showSideBar} />} />} />
        <Route path="/updateGroupModal" element={<PrivateRoute element={<UpdateGroupModal showSideBar={showSideBar} />} />} />
        <Route path="/userRole" element={<PrivateRoute element={<UserRole showSideBar={showSideBar} />} />} />
        <Route path="/addRoleModal" element={<PrivateRoute element={<AddRoleModal showSideBar={showSideBar} />} />} />
        <Route path="/updateRoleModal" element={<PrivateRoute element={<UpdateRoleModal showSideBar={showSideBar} />} />} />
        <Route path="/User_Form" element={<PrivateRoute element={<User_Form showSideBar={showSideBar} />} />} />
        <Route path="/User_List" element={<PrivateRoute element={<User_List showSideBar={showSideBar} />} />} />
        <Route path="/file" element={<PrivateRoute element={<File showSideBar={showSideBar} />} />} />
        <Route path="/addRemarks" element={<PrivateRoute element={<AddRemarks showSideBar={showSideBar} />} />} />
        <Route path="/MIS_Form" element={<PrivateRoute element={<MIS_Form showSideBar={showSideBar} />} />} />
        <Route path="/mis_updc" element={<PrivateRoute element={<MISUPDC showSideBar={showSideBar} />} />} />
        <Route path="/UpdateUserModal" element={<PrivateRoute element={<UpdateUserModal showSideBar={showSideBar} />} />} />
        <Route path="/shortreport" element={<PrivateRoute element={<ShortReport showSideBar={showSideBar} />} />} />
        <Route path="/DPRReport" element={<PrivateRoute element={<DPRReport showSideBar={showSideBar} />} />} />
        <Route path="/follow_up_report" element={<PrivateRoute element={<FollowUpReportForm showSideBar={showSideBar} />} />} />
        <Route path="/ClientDPR" element={<PrivateRoute element={<ClientDPR showSideBar={showSideBar} />} />} />
        <Route path="/developmentPage" element={<PrivateRoute element={<DevelopmentPage />} />} />
        <Route path="/cumulativeReport" element={<PrivateRoute element={<CumulativeReport showSideBar={showSideBar} />} />} />
        <Route path="/customerQAReport" element={<PrivateRoute element={<CustomerQAReport showSideBar={showSideBar} />} />} />
        <Route path="/clientreport" element={<PrivateRoute element={<Locationwisereport showSideBar={showSideBar} />} />} />

      </Routes>

      {location.pathname !== '/' && (
        <Footer />
      )}
    </>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

const root = createRoot(document.getElementById('root'));
root.render(<App />);
reportWebVitals();
