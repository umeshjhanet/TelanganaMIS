import React, { useEffect, useState } from 'react'
import { IoMenuOutline } from "react-icons/io5";
import { IoLogOut } from "react-icons/io5";
import { FaHome } from "react-icons/fa";
import { VscGraph } from "react-icons/vsc";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { BsFillCloudArrowUpFill } from "react-icons/bs";
import { BsCloudyFill } from "react-icons/bs";
import { BrowserRouter, Routes, Route, Link, Router, useLocation } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { RiUserFill } from "react-icons/ri";
import { HiMiniUserGroup, HiMiniUserPlus } from "react-icons/hi2";
import { MdAdd, MdBarChart, MdMessage, MdNote, MdReport, MdUpload } from "react-icons/md";
import axios from 'axios';
import { API_URL } from '../Api';
import { PiFilePdfDuotone } from "react-icons/pi";

const Header = () => {
  const [showSideBar, setShowSideBar] = useState(false);
  const [showMobileSideBar, setShowMobileSideBar] = useState();
  const [showReportDropdown, setShowReportDropdown] = useState(false);
  const [showMasterDropdown, setShowMasterDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState(false);
  const [user, setUser] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) =>
    location.pathname === path
      ? { color: '#4BC0C0', fontWeight: 'bold' } // Green when active
      : { color: 'black', textDecoration: 'none' }; // Black when not active

  // Retrieve user info from local storage
  const userLog = JSON.parse(localStorage.getItem('user'));


  const handleReportDropdown = () => {
    setShowReportDropdown(!showReportDropdown);
  }
  const handleMasterDropdown = () => {
    setShowMasterDropdown(!showMasterDropdown);
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

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/');
  };


  

  const adminUser = () => {
    return (
      <>
        <div className='d-none d-xl-block d-lg-block d-md-none d-sm-none'>
          <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#4BC0C0' }}>
            <div className="container-fluid" >
              <span className="btn" onClick={handleSideBar}><IoMenuOutline style={{ color: 'white', fontSize: '30px', marginLeft: '200px' }} /></span>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                </ul>
                <form className="d-flex">
                  {/* <Link to='/'> */}
                  <button onClick={handleLogout} href='/' className="btn logout-btn" style={{ color: 'white', marginTop: '4px' }}><IoLogOut style={{ color: 'white', fontSize: '30px', marginRight: '10px' }} />LOGOUT</button>
                  {/* </Link> */}
                  <p className='ms-2' style={{ color: 'white', marginTop: '10px' }}>Welcome: {userLog ? userLog.first_name : 'Guest'}</p>
                </form>
              </div>
            </div>
          </nav>

          {showSideBar ? (
            <>
              <div className='row'>
                <div className='col-1'>
                  <div className='shrink-sidebar'>
                    <div className='row shrink-header-image' >
                      <img src='logo.png' />
                    </div>
                    <Link to='/dashboard'><p className='ms-4 mt-5'><FaHome style={{ marginRight: '10px', color: '#107393' }} /></p></Link>
                    <Link to='/uploadDatabase'><p className='ms-4 '><MdUpload style={{ marginRight: '10px', color: '#107393' }} /></p></Link>
                    <Link to='/report'><p className='ms-4'><VscGraph style={{ marginRight: '10px', color: '#107393' }} /></p></Link>
                    <Link to='/User_List'><p className='ms-4 '><FaUserAlt style={{ marginRight: '10px', color: '#107393' }} /></p></Link>
                    <Link to='/DPRReport'><p className='ms-4 '><MdUpload style={{ marginRight: '10px', color: '#107393' }} /></p></Link>
                    <Link to='/ClientDPR'><p className='ms-4 '><MdUpload style={{ marginRight: '10px', color: '#107393' }} /></p></Link>
                  </div>
                </div>
                <div className='col-11'></div>
              </div>
            </>
          ) : (
            <>
              <div className='row' style={{ marginLeft: '0' }}>
                <div className='col-2' style={{ paddingRight: '0px', paddingLeft: '0px' }}>
                  <div className='sidebar'>
                    <div className='row header-image'>
                      <img src='logo.png' />
                    </div>
                    <div className='row' >
                      <Link to='#' onClick={() => window.open("/Super_Admin.pdf", '_blank')} className='ms-1 mt-5' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><PiFilePdfDuotone style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />User Manual</Link>
                    </div>
                    <div className='row'>
                      <Link to='/dashboard' className='ms-1' style={{ ...isActive('/dashboard') }}><FaHome style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Dashboard</Link>
                    </div>
                    <div className='row mt-1'>
                      <Link to='/uploadDatabase' className='ms-1' style={{ ...isActive('/uploadDatabase') }}><MdUpload style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Upload Database</Link>
                    </div>
                    <div className='row'>
                      <Link to='/report' style={{ ...isActive('/report') }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Location Wise Report</Link>
                    </div>
                    <div className='row'>
                      <Link to='/file' style={{ ...isActive('/file') }}><BsCloudyFill style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Last Upload File</Link>
                    </div>
                    
                    <div className='row'>
                      <Link to='/cumulativeReport' style={{ ...isActive('/cumulativeReport') }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Daily Process-Wise</Link>
                    </div>
                    <div className='row'>
                      <Link to='/customerQAReport' style={{ ...isActive('/customerQAReport') }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Customer QA Report</Link>
                    </div>
                    <div className='row mt-1'>
                      <Link to='/dbSiteReports' className='ms-1' style={{ ...isActive('/dbSiteReports') }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Server/DB Site Reports</Link>
                    </div>
                    <div className='row mt-1'>
                      <Link to='/siteReports' className='ms-1' style={{ ...isActive('/siteReports') }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Server Site Reports</Link>
                    </div>
                    <div className='row mt-1'>
                      <Link to='/addRemarks' className='ms-1' style={{ ...isActive('/addRemarks') }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Add Remarks</Link>
                    </div>
                    <div className='row' >
                      <Link to='/MIS_Form' className='ms-1' style={{ ...isActive('/MIS_Form') }}><MdAdd style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Add Manpower</Link>
                    </div>
                    <div className='row mt-1'>
                      <a
                        href='/clientreport'
                        className='ms-1'
                        style={{ ...isActive('/clientreport') }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MdReport style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Client View
                      </a>
                    </div>
                    <div className='row mt-1' onClick={handleActiveTab}>
                      <a className='ms-1' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><FaUserAlt style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Masters <IoIosArrowDown style={{ marginLeft: '73px' }} onClick={handleMasterDropdown} /></a>
                    </div>
                    {showMasterDropdown && (
                      <>
                        <hr />
                        <Link to='/groupManager' className='ms-1' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><FaUsers style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Group Manager<br /></Link>
                        <Link to='/userRole' className='ms-1' style={{ color: 'black', textDecoration: 'none', marginTop: '20px', cursor: 'pointer' }}><RiUserFill style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />User Role<br /></Link>
                        <Link to='/User_Form' className='ms-1' style={{ color: 'black', textDecoration: 'none', marginTop: '20px', cursor: 'pointer' }}><HiMiniUserPlus style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Add User<br /></Link>
                        <Link to='/User_List' className='ms-1' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><HiMiniUserGroup style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />User List<br /></Link>
                        <hr />
                      </>
                    )}
                    {/* <div className='row mt-1' onClick={handleActiveTab}>
                      <Link to='/DPRReport' className='ms-1' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><MdBarChart style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />DPR Report</Link>
                    </div>
                    <div className='row mt-1' onClick={handleActiveTab}>
                      <Link to='/ClientDPR' className='ms-1' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><MdBarChart style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Client DPR</Link>
                    </div>
                    <div className='row mt-1' onClick={handleActiveTab}>
                      <Link to='/follow_up_report' className='ms-1' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><MdMessage style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Follow Ups</Link>
                    </div>
                    <div className='row mt-1' onClick={handleActiveTab}>
                      <Link to='/CostingReport' className='ms-1' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><MdBarChart style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Costing Report</Link>
                    </div> */}
                  </div>
                </div>
                <div className='col-10' style={{ paddingRight: '0px', paddingLeft: '0px' }}></div>
              </div>
            </>
          )}
        </div>
        <div className='d-block d-xl-none d-lg-none d-md-block d-sm-block'>
          <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#4BC0C0' }}>
            <div className="container-fluid" >
              <span className="btn" onClick={handleMobileSideBar}><IoMenuOutline style={{ color: 'white', fontSize: '30px' }} /></span>
              <form className="d-flex">
                <button onClick={handleLogout} className="btn logout-btn" style={{ color: 'white', marginTop: '4px' }}><IoLogOut style={{ color: 'white', fontSize: '30px', marginRight: '10px' }} />LOGOUT</button>
                <p className='ms-2' style={{ color: 'white', marginTop: '10px' }}>Welcome: {userLog ? userLog.first_name : 'Guest'}</p>
              </form>
            </div>
          </nav>
          {showMobileSideBar &&
            <div className='col-2' style={{ paddingRight: '0px', paddingLeft: '0px' }}>
              <div className='mobile-sidebar'>
                <div className='row header-image' style={{ boxShadow: '0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02)', width: '200px' }}>
                  <img src='logo.png' />
                </div>
                <div className='row'>
                  <Link to='#' onClick={() => window.open("/Super_Admin.pdf", '_blank')} className='ms-1' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><PiFilePdfDuotone style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />User Manual</Link>
                </div>
                <div className='row'>
                  <Link to='/dashboard' className='ms-1' style={{ ...isActive('/dashboard') }}><FaHome style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Dashboard</Link>
                </div>
                <div className='row mt-1'>
                  <Link to='/uploadDatabase' className='ms-1' style={{ ...isActive('/uploadDatabase') }}><MdUpload style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Upload Database</Link>
                </div>
                <div className='row'>
                  <Link to='/report' style={{ ...isActive('/report') }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Location Wise Report</Link>
                </div>
                <div className='row'>
                  <Link to='/file' style={{ ...isActive('/file') }}><BsCloudyFill style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Last Upload File</Link>
                </div>
                
                <div className='row'>
                  <Link to='/cumulativeReport' style={{ ...isActive('/cumulativeReport') }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Daily Process-Wise</Link>
                </div>
                <div className='row mt-1'>
                  <Link to='/dbSiteReports' className='ms-1' style={{ ...isActive('/dbSiteReports') }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Server/DB Site Reports</Link>
                </div>
                <div className='row mt-1'>
                  <Link to='/siteReports' className='ms-1' style={{ ...isActive('/siteReports') }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Server Site Reports</Link>
                </div>
                <div className='row mt-1'>
                  <Link to='/addRemarks' className='ms-1' style={{ ...isActive('/addRemarks') }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Add Remarks</Link>
                </div>
                <div className='row' >
                  <Link to='/MIS_Form' className='ms-1' style={{ ...isActive('/MIS_Form') }}><MdAdd style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Add Manpower</Link>
                </div>
                <div className='row mt-1'>
                  <a
                    href='/clientreport'
                    className='ms-1'
                    style={{ ...isActive('/clientreport') }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MdReport style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Client View
                  </a>
                </div>
                <div className='row mt-1' onClick={handleActiveTab}>
                  <a className='ms-1' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><FaUserAlt style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Masters <IoIosArrowDown style={{ marginLeft: '73px' }} onClick={handleMasterDropdown} /></a>
                </div>
                {showMasterDropdown && (
                  <>
                    <hr />
                    <Link to='/groupManager' className='ms-1' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><FaUsers style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Group Manager<br /></Link>
                    <Link to='/userRole' className='ms-1' style={{ color: 'black', textDecoration: 'none', marginTop: '20px', cursor: 'pointer' }}><RiUserFill style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />User Role<br /></Link>
                    <Link to='/User_Form' className='ms-1' style={{ color: 'black', textDecoration: 'none', marginTop: '20px', cursor: 'pointer' }}><HiMiniUserPlus style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Add User<br /></Link>
                    <Link to='/User_List' className='ms-1' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><HiMiniUserGroup style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />User List<br /></Link>
                    <hr />
                  </>
                )}
                
              </div>
            </div>
          }
        </div>
      </>
    )
  }
  const normalUser = () => {
    return (
      <>
        <div className='d-none d-xl-block d-md-block d-sm-none'>
          <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#4BC0C0' }}>
            <div className="container-fluid" >
              <span className="btn" onClick={handleSideBar}><IoMenuOutline style={{ color: 'white', fontSize: '30px', marginLeft: '200px' }} /></span>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                </ul>
                <form className="d-flex">
                  <button onClick={handleLogout} href='/' className="btn logout-btn" style={{ color: 'white', marginTop: '4px' }}><IoLogOut style={{ color: 'white', fontSize: '30px', marginRight: '10px' }} />LOGOUT</button>
                  <p className='ms-2' style={{ color: 'white', marginTop: '10px' }}>Welcome: {userLog && userLog.first_name}</p>
                </form>
              </div>
            </div>
          </nav>
          {showSideBar ? (
            <>
              <div className='row'>
                <div className='col-1'>
                  <div className='shrink-sidebar'>
                    <div className='row shrink-header-image' >
                      <img src='logo.png' />
                    </div>
                    <Link to='/dashboard'><p className='ms-4 mt-5'><FaHome style={{ marginRight: '10px', color: '#107393' }} /></p></Link>
                    <Link to='/report'><p className='ms-4'><VscGraph style={{ marginRight: '10px', color: '#107393' }} /></p></Link>
                  </div>
                </div>
                <div className='col-11'></div>
              </div>
            </>
          ) : (
            <>
              <div className='row' style={{ marginLeft: '0' }}>
                <div className='col-2' style={{ paddingRight: '0px', paddingLeft: '0px' }}>
                  <div className='sidebar'>
                    <div className='row header-image'>
                      <img src='logo.png' />
                    </div>
                    <div className='row'>
                      <Link to='#' onClick={() => window.open("/Cbsl_Admin.pdf", '_blank')} className='ms-1 mt-5' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><PiFilePdfDuotone style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />User Manual</Link>
                    </div>
                    <div className='row'>
                      <Link to='/dashboard' className='ms-1' style={{ ...isActive('/dashboard') }}><FaHome style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Dashboard</Link>
                    </div>
                    <div className='row'>
                      <Link to='/report' style={{ ...isActive('/report') }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Location Wise Report</Link>
                    </div>
                    <div className='row'>
                      <Link to='/file' style={{ ...isActive('/file') }}><BsCloudyFill style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Last Upload File</Link>
                    </div>
                  </div>
                </div>
                <div className='col-10' style={{ paddingRight: '0px', paddingLeft: '0px' }}></div>
              </div>
            </>
          )}
        </div>
        <div className='d-block d-xl-none d-md-none d-sm-block'>
          <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#4BC0C0' }}>
            <div className="container-fluid" >
              <span className="btn" onClick={handleMobileSideBar}><IoMenuOutline style={{ color: 'white', fontSize: '30px' }} /></span>
              <form className="d-flex">
                {/* <Link to='/'> */}
                <button onClick={handleLogout} className="btn logout-btn" style={{ color: 'white', marginTop: '4px' }}><IoLogOut style={{ color: 'white', fontSize: '30px', marginRight: '10px' }} />LOGOUT</button>
                {/* </Link> */}
                <p className='ms-2' style={{ color: 'white', marginTop: '10px' }}>Welcome: Admin</p>
              </form>
            </div>
          </nav>
          {showMobileSideBar &&
            <div className='col-2' style={{ paddingRight: '0px', paddingLeft: '0px' }}>
              <div className='mobile-sidebar'>
                <div className='row header-image' style={{ boxShadow: '0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02)', width: '200px' }}>
                  <img src='logo.png' />
                </div>
                <div className='row'>
                  <Link to='#' onClick={() => window.open("/Cbsl_Admin.pdf", '_blank')} className='ms-4 mt-5' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><PiFilePdfDuotone style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />User Manual</Link>
                </div>
                <div className='row'>
                  <Link to='/dashboard' className='ms-1' style={{ ...isActive('/dashboard') }}><FaHome style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Dashboard</Link>
                </div>
                <div className='row'>
                  <Link to='/report' style={{ ...isActive('/report') }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Location Wise Report</Link>
                </div>
                <div className='row'>
                  <Link to='/file' style={{ ...isActive('/file') }}><BsCloudyFill style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Last Upload File</Link>
                </div>
                
              </div>
            </div>
          }
        </div>
      </>
    )
  }
  const clientUser = () => {
    return (
      <>
        <div className='d-none d-xl-block d-md-block d-sm-none'>
          <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#4BC0C0' }}>
            <div className="container-fluid" >
              <span className="btn" onClick={handleSideBar}><IoMenuOutline style={{ color: 'white', fontSize: '30px', marginLeft: '200px' }} /></span>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                </ul>
                <form className="d-flex">
                  {/* <Link to='/'> */}
                  <button onClick={handleLogout} className="btn logout-btn" style={{ color: 'white', marginTop: '4px' }}><IoLogOut style={{ color: 'white', fontSize: '30px', marginRight: '10px' }} />LOGOUT</button>
                  {/* </Link> */}

                  <p className='ms-2' style={{ color: 'white', marginTop: '10px' }}>Welcome: {userLog && userLog.first_name}</p>
                </form>
              </div>
            </div>
          </nav>

          {showSideBar ? (
            <>
              <div className='row'>
                <div className='col-1'>
                  <div className='shrink-sidebar'>
                    <div className='row shrink-header-image' >
                      <img src='logo.png' />
                    </div>
                    <div className='row'>
                      <Link to='#' onClick={() => window.open("/Cbsl_User.pdf", '_blank')} className='ms-4 mt-5' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><PiFilePdfDuotone style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />User Manual</Link>
                    </div>
                    <Link to='/dashboard'><p className='ms-4'><FaHome style={{ marginRight: '10px', color: '#107393' }} /></p></Link>

                    <Link to='/uploadDatabase'><p className='ms-4 '><MdUpload style={{ marginRight: '10px', color: '#107393' }} /></p></Link>

                  </div>
                </div>
                <div className='col-11'></div>
              </div>
            </>
          ) : (
            <>
              <div className='row' style={{ marginLeft: '0' }}>
                <div className='col-2' style={{ paddingRight: '0px', paddingLeft: '0px' }}>
                  <div className='sidebar'>
                    <div className='row header-image'>
                      <img src='logo.png' />
                    </div>
                    <div className='row'>
                      <Link to='#' onClick={() => window.open("/Cbsl_User.pdf", '_blank')} className='ms-1 mt-5' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><PiFilePdfDuotone style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />User Manual</Link>
                    </div>
                    <div className='row'>
                      <Link to='/dashboard' className='ms-1' style={{ ...isActive('/dashboard') }}><FaHome style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Dashboard</Link>
                    </div>
                    <div className='row mt-1'>
                      <Link to='/uploadDatabase' className='ms-1' style={{ ...isActive('/uploadDatabase') }}><MdUpload style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Upload Database</Link>
                    </div>
                    <div className='row'>
                      <Link to='/report' style={{ ...isActive('/report') }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Location Wise Report</Link>
                    </div>
                    {/* {showReportDropdown && (
                    <>
                      <hr />
                      <Link to='/uploadDatabase'><p className='ms-4 '><MdUpload style={{ marginRight: '10px', color: '#107393' }} /></p></Link>
                      <hr />
                    </>
                  )} */}
                  </div>
                </div>
                <div className='col-10' style={{ paddingRight: '0px', paddingLeft: '0px' }}></div>
              </div>
            </>
          )}
        </div>
        <div className='d-block d-xl-none d-md-none d-sm-block'>
          <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#4BC0C0' }}>
            <div className="container-fluid" >
              <span className="btn" onClick={handleMobileSideBar}><IoMenuOutline style={{ color: 'white', fontSize: '30px' }} /></span>
              <form className="d-flex">
                {/* <Link to='/'> */}
                <button onClick={handleLogout} className="btn logout-btn" style={{ color: 'white', marginTop: '4px' }}><IoLogOut style={{ color: 'white', fontSize: '30px', marginRight: '10px' }} />LOGOUT</button>
                {/* </Link> */}
                <p className='ms-2' style={{ color: 'white', marginTop: '10px' }}>Welcome: Admin</p>
              </form>
            </div>
          </nav>
          {showMobileSideBar &&
            <div className='col-2' style={{ paddingRight: '0px', paddingLeft: '0px' }}>
              <div className='mobile-sidebar'>
                <div className='row header-image' style={{ boxShadow: '0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02)', width: '200px' }}>
                  <img src='logo.png' />
                </div>
                <div className='row'>
                  <Link to='#' onClick={() => window.open("/Cbsl_User.pdf", '_blank')} className='ms-4 mt-5' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><PiFilePdfDuotone style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />User Manual</Link>
                </div>
                <div className='row'>
                  <Link to='/dashboard' className='ms-1' style={{ ...isActive('/dashboard') }}><FaHome style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Dashboard</Link>
                </div>
                <div className='row mt-1'>
                  <Link to='/uploadDatabase' className='ms-1' style={{ ...isActive('/uploadDatabase') }}><MdUpload style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Upload Database</Link>
                </div>
                <div className='row'>
                  <Link to='/report' style={{ ...isActive('/report') }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Location Wise Report</Link>
                </div>
              </div>
            </div>
          }
        </div>
      </>
    )

  }
  const serverUser = () => {
    return (
      <>
        <div className='d-none d-xl-block d-md-block d-sm-none'>
          <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#4BC0C0' }}>
            <div className="container-fluid" >
              <span className="btn" onClick={handleSideBar}><IoMenuOutline style={{ color: 'white', fontSize: '30px', marginLeft: '200px' }} /></span>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                </ul>
                <form className="d-flex">
                  <button onClick={handleLogout} className="btn logout-btn" style={{ color: 'white', marginTop: '4px' }}><IoLogOut style={{ color: 'white', fontSize: '30px', marginRight: '10px' }} />LOGOUT</button>
                  <p className='ms-2' style={{ color: 'white', marginTop: '10px' }}>Welcome: {userLog && userLog.first_name}</p>
                </form>
              </div>
            </div>
          </nav>
          {showSideBar ? (
            <>
              <div className='row'>
                <div className='col-1'>
                  <div className='shrink-sidebar'>
                    <div className='row shrink-header-image' >
                      <img src='logo.png' />
                    </div>
                    <Link to='/dashboard'><p className='ms-4'><FaHome style={{ marginRight: '10px', color: '#107393' }} /></p></Link>
                    <Link to='/dbSiteReports'><p className='ms-4 '><VscGraph style={{ marginRight: '10px', color: '#107393' }} /></p></Link>
                    <Link to='/siteReports'><p className='ms-4 '><VscGraph style={{ marginRight: '10px', color: '#107393' }} /></p></Link>
                  </div>
                </div>
                <div className='col-11'></div>
              </div>
            </>
          ) : (
            <>
              <div className='row' style={{ marginLeft: '0' }}>
                <div className='col-2' style={{ paddingRight: '0px', paddingLeft: '0px' }}>
                  <div className='sidebar'>
                    <div className='row header-image'>
                      <img src='logo.png' />
                    </div>
                    <div className='row'>
                      <Link to='/dashboard' className='ms-1' style={{ ...isActive('/dashboard') }}><FaHome style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Dashboard</Link>
                    </div>
                    <div className='row mt-1'>
                      <Link to='/dbSiteReports' className='ms-1' style={{ ...isActive('/dbSiteReports') }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Server/DB Site Reports</Link>
                    </div>
                    <div className='row mt-1'>
                      <Link to='/siteReports' className='ms-1' style={{ ...isActive('/siteReports') }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Server Site Reports</Link>
                    </div>
                  </div>
                </div>
                <div className='col-10' style={{ paddingRight: '0px', paddingLeft: '0px' }}></div>
              </div>
            </>
          )}
        </div>
        <div className='d-block d-xl-none d-md-none d-sm-block'>
          <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#4BC0C0' }}>
            <div className="container-fluid">
              <span className="btn" onClick={handleMobileSideBar}><IoMenuOutline style={{ color: 'white', fontSize: '30px' }} /></span>
              <form className="d-flex">
                <button onClick={handleLogout} className="btn logout-btn" style={{ color: 'white', marginTop: '4px' }}><IoLogOut style={{ color: 'white', fontSize: '30px', marginRight: '10px' }} />LOGOUT</button>
                <p className='ms-2' style={{ color: 'white', marginTop: '10px' }}>Welcome: Admin</p>
              </form>
            </div>
          </nav>
          {showMobileSideBar &&
            <div className='col-2' style={{ paddingRight: '0px', paddingLeft: '0px' }}>
              <div className='mobile-sidebar'>
                <div className='row header-image' style={{ boxShadow: '0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02)', width: '200px' }}>
                  <img src='logo.png' />
                </div>
                <div className='row'>
                  <Link to='/dashboard' className='ms-1' style={{ ...isActive('/dashboard') }}><FaHome style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Dashboard</Link>
                </div>
                <div className='row mt-1'>
                  <Link to='/dbSiteReports' className='ms-1' style={{ ...isActive('/dbSiteReports') }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Server/DB Site Reports</Link>
                </div>
                <div className='row mt-1'>
                  <Link to='/siteReports' className='ms-1' style={{ ...isActive('/siteReports') }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Server Site Reports</Link>
                </div>
              </div>
            </div>
          }
        </div>
      </>
    )

  }
  const districtHeadUser = () => {
    return (
      <>
        <div className='d-none d-xl-block d-md-block d-sm-none'>
          <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#4BC0C0' }}>
            <div className="container-fluid" >
              <span className="btn" onClick={handleSideBar}><IoMenuOutline style={{ color: 'white', fontSize: '30px', marginLeft: '200px' }} /></span>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                </ul>
                <form className="d-flex">
                  {/* <Link to='/'> */}
                  {/* <button onClick={handleLogout}>Logout</button> */}
                  <button onClick={handleLogout} className="btn logout-btn" style={{ color: 'white', marginTop: '4px' }}><IoLogOut style={{ color: 'white', fontSize: '30px', marginRight: '10px' }} />LOGOUT</button>
                  {/* </Link> */}

                  <p className='ms-2' style={{ color: 'white', marginTop: '10px' }}>Welcome: {userLog && userLog.first_name}</p>
                </form>
              </div>
            </div>
          </nav>

          {showSideBar ? (
            <>
              <div className='row'>
                <div className='col-1'>
                  <div className='shrink-sidebar'>
                    <div className='row shrink-header-image' >
                      <img src='logo.png' />
                    </div>
                    <div className='row'>
                      <Link to='#' onClick={() => window.open("/District_Head.pdf", '_blank')} className='ms-4 mt-5' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><PiFilePdfDuotone style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />User Manual</Link>
                    </div>
                    <Link to='/dashboard'><p className='ms-4'><FaHome style={{ marginRight: '10px', color: '#107393' }} /></p></Link>
                    <Link to='/locationwisereport'><p className='ms-4'><VscGraph style={{ marginRight: '10px', color: '#107393' }} /></p></Link>
                    <Link to='/report'><p className='ms-4'><VscGraph style={{ marginRight: '10px', color: '#107393' }} /></p></Link>
                  </div>
                </div>
                <div className='col-11'></div>
              </div>
            </>
          ) : (
            <>
              <div className='row' style={{ marginLeft: '0' }}>
                <div className='col-2' style={{ paddingRight: '0px', paddingLeft: '0px' }}>
                  <div className='sidebar'>
                    <div className='row header-image'>
                      <img src='logo.png' />
                    </div>
                    <div className='row'>
                      <Link to='#' onClick={() => window.open("/District_Head.pdf", '_blank')} className='ms-1 mt-5' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><PiFilePdfDuotone style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />User Manual</Link>
                    </div>
                    <div className='row' >
                      <Link to='/dashboard' className='ms-1' style={{ ...isActive('/dashboard') }}><FaHome style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Dashboard</Link>
                    </div>
                    <div className='row' >
                      <Link to='/locationwisereport' className='ms-1' style={{ ...isActive('/locationwisereport') }}><FaHome style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Another Dashboard</Link>
                    </div>
                    <div className='row'>
                      <Link to='/report' style={{ ...isActive('/report') }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Location Wise Report</Link>
                    </div>
                  </div>
                </div>
                <div className='col-10' style={{ paddingRight: '0px', paddingLeft: '0px' }}></div>
              </div>
            </>
          )}
        </div>
        <div className='d-block d-xl-none d-md-none d-sm-block'>
          <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#4BC0C0' }}>
            <div className="container-fluid" >
              <span className="btn" onClick={handleMobileSideBar}><IoMenuOutline style={{ color: 'white', fontSize: '30px' }} /></span>
              <form className="d-flex">
                {/* <Link to='/'> */}
                <button onClick={handleLogout} className="btn logout-btn" style={{ color: 'white', marginTop: '4px' }}><IoLogOut style={{ color: 'white', fontSize: '30px', marginRight: '10px' }} />LOGOUT</button>
                {/* </Link> */}
                <p className='ms-2' style={{ color: 'white', marginTop: '10px' }}>Welcome: Admin</p>
              </form>
            </div>
          </nav>
          {showMobileSideBar &&
            <div className='col-2' style={{ paddingRight: '0px', paddingLeft: '0px' }}>
              <div className='mobile-sidebar'>
                <div className='row header-image' style={{ boxShadow: '0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02)', width: '200px' }}>
                  <img src='logo.png' />
                </div>
                <div className='row' onClick={() => window.open("/District_Head.pdf", '_blank')}>
                  <Link to='#' onClick={() => window.open("/District_Head.pdf", '_blank')} className='ms-4 mt-5' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><PiFilePdfDuotone style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />User Manual</Link>
                </div>
                <div className='row' >
                  <Link to='/dashboard' className='ms-1' style={{ ...isActive('/dashboard') }}><FaHome style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Dashboard</Link>
                </div>
                <div className='row' >
                  <Link to='/locationwisereport' className='ms-1' style={{ ...isActive('/locationwisereport') }}><FaHome style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Another Dashboard</Link>
                </div>
                <div className='row'>
                  <Link to='/report' style={{ ...isActive('/report') }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Location Wise Report</Link>
                </div>
              </div>
            </div>
          }
        </div>
      </>
    )
  }
  const cbslAdminUser = () => {
    return (
      <>
        <div className='d-none d-xl-block d-lg-block d-md-none d-sm-none'>
          <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#4BC0C0' }}>
            <div className="container-fluid" >
              <span className="btn" onClick={handleSideBar}><IoMenuOutline style={{ color: 'white', fontSize: '30px', marginLeft: '200px' }} /></span>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                </ul>
                <form className="d-flex">
                  {/* <Link to='/'> */}
                  <button onClick={handleLogout} className="btn logout-btn" style={{ color: 'white', marginTop: '4px' }}><IoLogOut style={{ color: 'white', fontSize: '30px', marginRight: '10px' }} />LOGOUT</button>
                  {/* </Link> */}
                  <p className='ms-2' style={{ color: 'white', marginTop: '10px' }}>Welcome: {userLog ? userLog.first_name : 'Guest'}</p>
                </form>
              </div>
            </div>
          </nav>

          {showSideBar ? (
            <>
              <div className='row'>
                <div className='col-1'>
                  <div className='shrink-sidebar'>
                    <div className='row shrink-header-image' >
                      <img src='logo.png' />
                    </div>
                    <div className='row'>
                      <Link to='#' onClick={() => window.open("/Cbsl_Admin.pdf", '_blank')} className='ms-4 mt-5' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><PiFilePdfDuotone style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />User Manual</Link>
                    </div>
                    <Link to='/dashboard'><p className='ms-4 '><FaHome style={{ marginRight: '10px', color: '#107393' }} /></p></Link>
                    <div className='row' onClick={handleActiveTab}>
                      <Link to='/locationwisereport' className='ms-1 ' style={{ color: 'black', textDecoration: 'none' }}><FaHome style={{ marginRight: '10px', fontSize: '20px', color: '#337ab7' }} />New Page</Link>
                    </div>
                    <Link to='/report'><p className='ms-4'><VscGraph style={{ marginRight: '10px', color: '#107393' }} /></p></Link>
                    <Link to='/addRemarks' style={{ textDecoration: 'none', color: 'black' }}><p className='ms-4'><VscGraph style={{ marginRight: '10px', color: '#107393' }} /></p></Link>
                  </div>
                </div>
                <div className='col-11'></div>
              </div>
            </>
          ) : (
            <>
              <div className='row' style={{ marginLeft: '0' }}>
                <div className='col-2' style={{ paddingRight: '0px', paddingLeft: '0px' }}>
                  <div className='sidebar'>
                    <div className='row header-image'>
                      <img src='logo.png' />
                    </div>
                    <div className='row'>
                      <Link to='#' onClick={() => window.open("/Cbsl_Admin.pdf", '_blank')} className='ms-1 mt-5' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><PiFilePdfDuotone style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />User Manual</Link>
                    </div>
                    <div className='row'>
                      <Link to='/dashboard' className='ms-1' style={{ ...isActive('/dashboard') }}><FaHome style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Dashboard</Link>
                    </div>
                    <div className='row'>
                      <Link to='/report' style={{ ...isActive('/report') }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Location Wise Report</Link>
                    </div>
                    <div className='row'>
                      <Link to='/file' style={{ ...isActive('/file') }}><BsCloudyFill style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Last Upload File</Link>
                    </div>
                    
                    <div className='row'>
                      <Link to='/cumulativeReport' style={{ ...isActive('/cumulativeReport') }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Daily Process-Wise</Link>
                    </div>
                    <div className='row'>
                      <Link to='/customerQAReport' style={{ ...isActive('/customerQAReport') }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Customer QA Report</Link>
                    </div>
                    <div className='row mt-1'>
                      <Link to='/addRemarks' className='ms-1' style={{ ...isActive('/addRemarks') }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Add Remarks</Link>
                    </div>
                    <div className='row' >
                      <Link to='/MIS_Form' className='ms-1' style={{ ...isActive('/MIS_Form') }}><MdAdd style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Add Manpower</Link>
                    </div>
                    <div className='row mt-1'>
                      <a
                        href='/clientreport'
                        className='ms-1'
                        style={{ ...isActive('/clientreport') }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MdReport style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Client View
                      </a>
                    </div>
                   
                  </div>
                </div>
                <div className='col-10' style={{ paddingRight: '0px', paddingLeft: '0px' }}></div>
              </div>
            </>
          )}
        </div>
        <div className='d-block d-xl-none d-lg-none d-md-block d-sm-block'>
          <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#4BC0C0' }}>
            <div className="container-fluid" >
              <span className="btn" onClick={handleMobileSideBar}><IoMenuOutline style={{ color: 'white', fontSize: '30px' }} /></span>
              <form className="d-flex">
                {/* <Link to='/'> */}
                <button onClick={handleLogout} className="btn logout-btn" style={{ color: 'white', marginTop: '4px' }}><IoLogOut style={{ color: 'white', fontSize: '30px', marginRight: '10px' }} />LOGOUT</button>
                {/* </Link> */}
                <p className='ms-2' style={{ color: 'white', marginTop: '10px' }}>Welcome: {userLog ? userLog.first_name : 'Guest'}</p>
              </form>
            </div>
          </nav>
          {showMobileSideBar &&
            <div className='col-2' style={{ paddingRight: '0px', paddingLeft: '0px' }}>
              <div className='mobile-sidebar'>
                <div className='row header-image' style={{ boxShadow: '0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02)', width: '200px' }}>
                  <img src='logo.png' />
                </div>
                <div className='row'>
                  <Link to='#' onClick={() => window.open("/Cbsl_Admin.pdf", '_blank')} className='ms-1 mt-5' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><PiFilePdfDuotone style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />User Manual</Link>
                </div>
                <div className='row'>
                  <Link to='/dashboard' className='ms-1' style={{ ...isActive('/dashboard') }}><FaHome style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Dashboard</Link>
                </div>
                <div className='row'>
                  <Link to='/report' style={{ ...isActive('/report') }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Location Wise Report</Link>
                </div>
                <div className='row'>
                  <Link to='/file' style={{ ...isActive('/file') }}><BsCloudyFill style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Last Upload File</Link>
                </div>
                
                <div className='row'>
                      <Link to='/cumulativeReport' style={{ ...isActive('/cumulativeReport') }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Daily Process-Wise</Link>
                    </div>
                <div className='row'>
                  <Link to='/customerQAReport' style={{ ...isActive('/customerQAReport') }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Customer QA Report</Link>
                </div>
                <div className='row mt-1'>
                  <Link to='/addRemarks' className='ms-1' style={{ ...isActive('/addRemarks') }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Add Remarks</Link>
                </div>
                <div className='row' >
                  <Link to='/MIS_Form' className='ms-1' style={{ ...isActive('/MIS_Form') }}><MdAdd style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Add Manpower</Link>
                </div>
                <div className='row mt-1'>
                  <a
                    href='/clientreport'
                    className='ms-1'
                    style={{ ...isActive('/clientreport') }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MdReport style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Client View
                  </a>
                </div>
              
              </div>
            </div>
          }
        </div>
      </>
    )
  }
  const managementUser = () => {
    return (
      <>
        <div className='d-none d-xl-block d-lg-block d-md-none d-sm-none'>
          <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#4BC0C0' }}>
            <div className="container-fluid" >
              <span className="btn" onClick={handleSideBar}><IoMenuOutline style={{ color: 'white', fontSize: '30px', marginLeft: '200px' }} /></span>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                </ul>
                <form className="d-flex">
                  {/* <Link to='/'> */}
                  <button onClick={handleLogout} className="btn logout-btn" style={{ color: 'white', marginTop: '4px' }}><IoLogOut style={{ color: 'white', fontSize: '30px', marginRight: '10px' }} />LOGOUT</button>
                  {/* </Link> */}
                  <p className='ms-2' style={{ color: 'white', marginTop: '10px' }}>Welcome: {userLog ? userLog.first_name : 'Guest'}</p>
                </form>
              </div>
            </div>
          </nav>

          {showSideBar ? (
            <>
              <div className='row'>
                <div className='col-1'>
                  <div className='shrink-sidebar'>
                    <div className='row shrink-header-image' >
                      <img src='logo.png' />
                    </div>
                    <div className='row'>
                      <Link to='#' onClick={() => window.open("/Cbsl_Admin.pdf", '_blank')} className='ms-4 mt-5' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><PiFilePdfDuotone style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />User Manual</Link>
                    </div>
                    <Link to='/dashboard'><p className='ms-4 '><FaHome style={{ marginRight: '10px', color: '#107393' }} /></p></Link>
                    <div className='row' onClick={handleActiveTab}>
                      <Link to='/locationwisereport' className='ms-1 ' style={{ color: 'black', textDecoration: 'none' }}><FaHome style={{ marginRight: '10px', fontSize: '20px', color: '#337ab7' }} />New Page</Link>
                    </div>
                    <Link to='/report'><p className='ms-4'><VscGraph style={{ marginRight: '10px', color: '#107393' }} /></p></Link>
                    <Link to='/addRemarks' style={{ textDecoration: 'none', color: 'black' }}><p className='ms-4'><VscGraph style={{ marginRight: '10px', color: '#107393' }} /></p></Link>
                  </div>
                </div>
                <div className='col-11'></div>
              </div>
            </>
          ) : (
            <>
              <div className='row' style={{ marginLeft: '0' }}>
                <div className='col-2' style={{ paddingRight: '0px', paddingLeft: '0px' }}>
                  <div className='sidebar'>
                    <div className='row header-image'>
                      <img src='logo.png' />
                    </div>
                    <div className='row mt-5'>
                      <Link to='/dashboard' className='ms-1' style={{ ...isActive('/dashboard') }}><FaHome style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Dashboard</Link>
                    </div>
                    <div className='row'>
                      <Link to='/report' style={{ ...isActive('/report') }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Location Wise Report</Link>
                    </div>
                    <div className='row'>
                      <Link to='/file' style={{ ...isActive('/file') }}><BsCloudyFill style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Last Upload File</Link>
                    </div>
                    
                    <div className='row'>
                      <Link to='/developmentPage' style={{ ...isActive('/developmentPage') }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Man Power Report</Link>
                    </div>
                    <div className='row'>
                      <Link to='/cumulativeReport' style={{ ...isActive('/cumulativeReport') }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Daily Process-Wise</Link>
                    </div>
                    <div className='row'>
                      <Link to='/customerQAReport' style={{ ...isActive('/customerQAReport') }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Customer QA Report</Link>
                    </div>
                    <div className='row mt-1'>
                      <a
                        href='/clientreport'
                        className='ms-1'
                        style={{ ...isActive('/clientreport') }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MdReport style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Client View
                      </a>
                    </div>
                  </div>
                </div>
                <div className='col-10' style={{ paddingRight: '0px', paddingLeft: '0px' }}></div>
              </div>
            </>
          )}
        </div>
        <div className='d-block d-xl-none d-lg-none d-md-block d-sm-block'>
          <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#4BC0C0' }}>
            <div className="container-fluid" >
              <span className="btn" onClick={handleMobileSideBar}><IoMenuOutline style={{ color: 'white', fontSize: '30px' }} /></span>
              <form className="d-flex">
                {/* <Link to='/'> */}
                <button onClick={handleLogout} className="btn logout-btn" style={{ color: 'white', marginTop: '4px' }}><IoLogOut style={{ color: 'white', fontSize: '30px', marginRight: '10px' }} />LOGOUT</button>
                {/* </Link> */}
                <p className='ms-2' style={{ color: 'white', marginTop: '10px' }}>Welcome: {userLog ? userLog.first_name : 'Guest'}</p>
              </form>
            </div>
          </nav>
          {showMobileSideBar &&
            <div className='col-2' style={{ paddingRight: '0px', paddingLeft: '0px' }}>
              <div className='mobile-sidebar'>
                <div className='row header-image' style={{ boxShadow: '0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02)', width: '200px' }}>
                  <img src='logo.png' />
                </div>
                <div className='row mt-5'>
                  <Link to='/dashboard' className='ms-1' style={{ ...isActive('/dashboard') }}><FaHome style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Dashboard</Link>
                </div>
                <div className='row'>
                  <Link to='/report' style={{ ...isActive('/report') }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Location Wise Report</Link>
                </div>
                <div className='row'>
                  <Link to='/file' style={{ ...isActive('/file') }}><BsCloudyFill style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Last Upload File</Link>
                </div>
                
                <div className='row'>
                  <Link to='/developmentPage' style={{ ...isActive('/developmentPage') }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Man Power Report</Link>
                </div>
                <div className='row'>
                  <Link to='/cumulativeReport' style={{ ...isActive('/cumulativeReport') }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Daily Process-Wise</Link>
                </div>
                <div className='row'>
                  <Link to='/customerQAReport' style={{ ...isActive('/customerQAReport') }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Customer QA Report</Link>
                </div>
                <div className='row mt-1'>
                  <a
                    href='/clientreport'
                    className='ms-1'
                    style={{ ...isActive('/clientreport') }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MdReport style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Client View
                  </a>
                </div>
              </div>
            </div>
          }
        </div>
      </>
    )
  }


  const roleComponents = {
    Admin: adminUser,
    "Server Database Monitoring": serverUser,
    "Cbsl User": clientUser,
    "All District Head": districtHeadUser,
    "CBSL Admin": cbslAdminUser,
    "Management": managementUser,
  };

  // Check user roles
  const userRoles = userLog?.user_roles || [];
  // const isManagement = userRoles.includes("CBSL Admin") && userLog?.user_id === 101;

  return (
    <>
      {/* Render Management User only once for user_id 101 */}
      {/* {isManagement ? managementUser() : ( */}
      <>
        {userRoles.map((role) => {
          const Component = roleComponents[role];
          return Component ? <Component key={role} /> : null;
        })}

        {/* Render Normal User if no role matches */}
        {!userRoles.some((role) => roleComponents[role]) && normalUser()}
      </>
      {/* )} */}
    </>
  );

}

export default Header