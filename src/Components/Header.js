import React, { useState } from 'react'
import { IoMenuOutline } from "react-icons/io5";
import { IoLogOut } from "react-icons/io5";
import { FaHome } from "react-icons/fa";
import { VscGraph } from "react-icons/vsc";
import { IoIosArrowDown } from "react-icons/io";
import { BsFillCloudArrowUpFill } from "react-icons/bs";
import { BsCloudyFill } from "react-icons/bs";
import SideBar from './SideBar';
import { BrowserRouter, Routes, Route, Link, Router } from "react-router-dom";
// import Dashboard from './pages/dashboard';


const Header = () => {
  const [showSideBar, setShowSideBar] = useState(false);
  const [showMobileSideBar, setShowMobileSideBar] = useState();
  const [showReportDropdown, setShowReportDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState(false);

  const handleReportDropdown = () => {
    setShowReportDropdown(!showReportDropdown);
  }
  const handleActiveTab = () => {
    setActiveTab(!activeTab);
  }

  const handleSideBar = () => {
    setShowSideBar(!showSideBar);
    
  }
  const handleMobileSideBar = () => {
    setShowMobileSideBar(!showMobileSideBar)
  }



  return (
    <>
    <div className='d-none d-xl-block d-sm-none'>
      <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#4BC0C0' }}>
        <div className="container-fluid" >
          <span className="btn" onClick={handleSideBar}><IoMenuOutline style={{ color: 'white', fontSize: '30px', marginLeft: '200px' }} /></span>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              
            </ul>
            <form className="d-flex">
             <Link to='/'>
             <button href='/' className="btn logout-btn" style={{ color: 'white' }}><IoLogOut style={{ color: 'white', fontSize: '30px', marginRight: '10px' }} />LOGOUT</button>
             </Link>
              
              <p className='ms-2' style={{ color: 'white', marginTop: '10px' }}>Welcome: Admin</p>
            </form>
          </div>
        </div>
      </nav>

      {showSideBar ? (
        <>
        {/* <div className='container-fluid'> */}
        <div className='row'>
            <div className='col-1'>
              <div className='shrink-sidebar'>
                <div className='row shrink-header-image' >
                  <img src='ezeefile.png'/>
                </div>
                <p className='ms-4 mt-5'><FaHome style={{ marginRight: '10px' }} /></p>
                <p className='ms-4 '><VscGraph style={{ marginRight: '10px' }} /></p>
              </div>
            </div>
            <div className='col-11'></div>
          </div>
        {/* </div> */}
          
        </>
      ) : (
        <>
        <div className='container-fluid'>
          <div className='row'>
          <div className='col-2' style={{ paddingRight: '0px', paddingLeft: '0px' }}>
            <div className='sidebar'>
              <div className='row header-image' >
                <img src='ezeefile.png'  />
              </div>
              <div className='row' onClick={handleActiveTab} >
                <Link to='/dashboard' className='ms-1 mt-5' style={{ color: 'black', textDecoration: 'none' }}><FaHome style={{ marginRight: '10px' }} />Dashboard</Link>
              </div>
              <div className='row' onClick={handleActiveTab}>
                <a className='ms-1' style={{ color: 'black', textDecoration: 'none' }}><VscGraph style={{ marginRight: '10px' }} />MIS Report <IoIosArrowDown style={{ marginLeft: '50px' }} onClick={handleReportDropdown} /></a>
              </div>
              {showReportDropdown && (
                <>
                  <Link to='/report' className='ms-1' style={{ color: 'black', textDecoration: 'none', marginTop: '20px' }}><BsFillCloudArrowUpFill style={{ marginRight: '10px' }} />Location Wise Report</Link>
                  <Link to='/file' className='ms-1' style={{ color: 'black', textDecoration: 'none' }}><BsCloudyFill style={{ marginRight: '10px' }} />Last Upload File</Link>
                </>
              )}

            </div>
          </div>
          <div className='col-10' style={{ paddingRight: '0px', paddingLeft: '0px' }}>

          </div>
          </div>
        </div>
          
        </>
      )}
</div>
<div className='d-block d-xl-none d-sm-block'>
<nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#4BC0C0' }}>
        <div className="container-fluid" >
          <span className="btn" onClick={handleMobileSideBar}><IoMenuOutline style={{ color: 'white', fontSize: '30px' }} /></span>
            <form className="d-flex">
              <Link to='/'>
              <button className="btn logout-btn" style={{ color: 'white' }}><IoLogOut style={{ color: 'white', fontSize: '30px', marginRight: '10px' }} />LOGOUT</button>
              </Link>
              <p className='ms-2' style={{ color: 'white', marginTop: '10px' }}>Welcome: Admin</p>
            </form>
          </div>
      </nav>
      {showMobileSideBar &&
          <div className='col-2' style={{ paddingRight: '0px', paddingLeft: '0px' }}>
            <div className='mobile-sidebar'>
              <div className='row header-image' style={{ boxShadow: '0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02)', width: '250px' }}>
                <img src='ezeefile.png' />
              </div>
              <div className='row' onClick={handleActiveTab} >
                <Link to='/dashboard' className='ms-4 mt-5' style={{ color: 'black', textDecoration: 'none' }}><FaHome style={{ marginRight: '10px' }} />Dashboard</Link>
              </div>
              <div className='row' onClick={handleActiveTab}>
                <a className='ms-4' style={{ color: 'black', textDecoration: 'none' }}><VscGraph style={{ marginRight: '10px' }} />MIS Report <IoIosArrowDown style={{ marginLeft: '50px' }} onClick={handleReportDropdown} /></a>
              </div>
              {showReportDropdown && (
                <>
                  <Link to='/report' className='ms-4' style={{ color: 'black', textDecoration: 'none', marginTop: '20px' }}><BsFillCloudArrowUpFill style={{ marginRight: '10px' }} />Location Wise Report</Link>
                  <Link to='/file' className='ms-4' style={{ color: 'black', textDecoration: 'none' }}><BsCloudyFill style={{ marginRight: '10px' }} />Last Upload File</Link>
                </>
              )}

            </div>
          </div>
      }
</div>
    </>
  )
}

export default Header