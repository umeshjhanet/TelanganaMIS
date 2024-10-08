import React, { useEffect, useState } from 'react'
import { IoMenuOutline } from "react-icons/io5";
import { IoLogOut } from "react-icons/io5";
import { FaHome } from "react-icons/fa";
import { VscGraph } from "react-icons/vsc";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { BsFillCloudArrowUpFill } from "react-icons/bs";
import { BsCloudyFill } from "react-icons/bs";
import { BrowserRouter, Routes, Route, Link, Router } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { RiUserFill } from "react-icons/ri";
import { HiMiniUserGroup, HiMiniUserPlus } from "react-icons/hi2";
import { MdUpload } from "react-icons/md";
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
  // Retrieve user info from local storage
  const userLog = JSON.parse(localStorage.getItem('user'));
  // console.log("User's Info", userLog);

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
    localStorage.removeItem('user');
    navigate('/');
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/user_master`);
        setUser(response.data);

        // Log the entire response data to inspect its structure
        console.log('Response Data:', response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

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
                    <div className='row' onClick={() => window.open("/Super_Admin.pdf", '_blank')}>
                      <Link to='#' className='ms-1 mt-5' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><PiFilePdfDuotone style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />User Manual</Link>
                    </div>
                    <div className='row' onClick={handleActiveTab}>
                      <Link to='/dashboard' className='ms-1' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><FaHome style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Dashboard</Link>
                    </div>
                    <div className='row mt-1' onClick={handleActiveTab}>
                      <Link to='/uploadDatabase' className='ms-1' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><MdUpload style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Upload Database</Link>
                    </div>

                    <div className='row mt-1' onClick={handleActiveTab}>
                      <a className='ms-1' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />MIS Report <IoIosArrowDown style={{ marginLeft: '50px' }} onClick={handleReportDropdown} /></a>
                    </div>
                    {showReportDropdown && (
                      <>
                        <hr />
                        <Link to='/report' className='ms-1' style={{ color: 'black', textDecoration: 'none', marginTop: '20px', cursor: 'pointer' }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Location Wise Report</Link>
                        <Link to='/file' className='ms-1' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><BsCloudyFill style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Last Upload File</Link>
                        <br/><Link to='/dailyReport' className='ms-1' style={{ color: 'black', textDecoration: 'none', marginTop: '20px', cursor: 'pointer' }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Daily Report</Link>
                        <hr />
                      </>
                    )}
                    <div className='row mt-1' onClick={handleActiveTab}>
                      <Link to='/dbSiteReports' className='ms-1' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Server/DB Site Reports</Link>
                    </div>
                    <div className='row mt-1' onClick={handleActiveTab}>
                      <Link to='/siteReports' className='ms-1' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Server Site Reports</Link>
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
                <div className='row' onClick={() => window.open("/Super_Admin.pdf", '_blank')}>
                  <Link to='#' className='ms-1' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><PiFilePdfDuotone style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />User Manual</Link>
                </div>
                <div className='row' onClick={handleActiveTab}>
                  <Link to='/dashboard' className='ms-1 mt-5' style={{ color: 'black', textDecoration: 'none' }}><FaHome style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Dashboard</Link>
                </div>
                <div className='row' onClick={handleActiveTab}>
                  <Link to='/uploadDatabase' className='ms-1' style={{ color: 'black', textDecoration: 'none' }}><MdUpload style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Upload Database</Link>
                </div>
                <div className='row' onClick={handleActiveTab}>
                  <a className='ms-1' style={{ color: 'black', textDecoration: 'none' }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />MIS Report <IoIosArrowDown style={{ marginLeft: '50px' }} onClick={handleReportDropdown} /></a>
                </div>
                {showReportDropdown && (
                  <>
                    <hr />
                    <Link to='/report' className='ms-1' style={{ color: 'black', textDecoration: 'none', marginTop: '20px' }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Location Wise Report</Link>
                    <br /><Link to='/file' className='ms-1' style={{ color: 'black', textDecoration: 'none' }}><BsCloudyFill style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Last Upload File</Link><br/>
                    <br/><Link to='/dailyReport' className='ms-1' style={{ color: 'black', textDecoration: 'none', marginTop: '20px', cursor: 'pointer' }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Daily Report</Link>
                    <hr />
                  </>
                )}
                <div className='row' onClick={handleActiveTab}>
                  <a className='ms-1' style={{ color: 'black', textDecoration: 'none' }}><FaUserAlt style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Masters <IoIosArrowDown style={{ marginLeft: '73px' }} onClick={handleMasterDropdown} /></a>
                </div>
                {showMasterDropdown && (
                  <>
                    <hr />
                    <Link to='/groupManager' className='ms-1' style={{ color: 'black', textDecoration: 'none', }}><FaUsers style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Group Manager<br /></Link>
                    <Link to='/userRole' className='ms-1' style={{ color: 'black', textDecoration: 'none', marginTop: '20px' }}><RiUserFill style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />User Role<br /></Link>
                    <Link to='/User_Form' className='ms-1' style={{ color: 'black', textDecoration: 'none', marginTop: '20px' }}><HiMiniUserPlus style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Add User<br /></Link>
                    <Link to='/User_List' className='ms-1' style={{ color: 'black', textDecoration: 'none' }}><HiMiniUserGroup style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />User List<br /></Link>
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
                    <div className='row' onClick={() => window.open("/Cbsl_Admin.pdf", '_blank')}>
                      <Link to='#' className='ms-1 mt-5' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><PiFilePdfDuotone style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />User Manual</Link>
                    </div>
                    <div className='row' onClick={handleActiveTab}>
                      <Link to='/dashboard' className='ms-1' style={{ color: 'black', textDecoration: 'none' }}><FaHome style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Dashboard</Link>
                    </div>

                    <div className='row' onClick={handleActiveTab}>
                      <a className='ms-1' style={{ color: 'black', textDecoration: 'none' }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />MIS Report <IoIosArrowDown style={{ marginLeft: '50px' }} onClick={handleReportDropdown} /></a>
                    </div>
                    {showReportDropdown && (
                      <>
                        <hr />
                        <Link to='/report' className='ms-1' style={{ color: 'black', textDecoration: 'none', marginTop: '20px' }}><BsFillCloudArrowUpFill style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Location Wise Report</Link>
                        <Link to='/file' className='ms-1' style={{ color: 'black', textDecoration: 'none' }}><BsCloudyFill style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Last Upload File</Link>
                        <hr />
                      </>
                    )}
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
                <div className='row' onClick={() => window.open("/Cbsl_Admin.pdf", '_blank')}>
                  <Link to='#' className='ms-4 mt-5' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><PiFilePdfDuotone style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />User Manual</Link>
                </div>
                <div className='row' onClick={handleActiveTab}>
                  <Link to='/dashboard' className='ms-4 ' style={{ color: 'black', textDecoration: 'none' }}><FaHome style={{ marginRight: '10px' }} />Dashboard</Link>
                </div>
                <div className='row' onClick={handleActiveTab}>
                  <a className='ms-4' style={{ color: 'black', textDecoration: 'none' }}><VscGraph style={{ marginRight: '10px' }} />MIS Report <IoIosArrowDown style={{ marginLeft: '50px' }} onClick={handleReportDropdown} /></a>
                </div>
                <div className='row' onClick={handleActiveTab}>
                  <a className='ms-4' style={{ color: 'black', textDecoration: 'none' }}><VscGraph style={{ marginRight: '10px' }} /> Masters <IoIosArrowDown style={{ marginLeft: '50px' }} onClick={handleMasterDropdown} /></a>
                </div>
                {showReportDropdown && (
                  <>
                    <Link to='/report' className='ms-4' style={{ color: 'black', textDecoration: 'none', marginTop: '20px' }}><BsFillCloudArrowUpFill style={{ marginRight: '10px' }} />Location Wise Report</Link>
                    <Link to='/file' className='ms-4' style={{ color: 'black', textDecoration: 'none' }}><BsCloudyFill style={{ marginRight: '10px' }} />Last Upload File</Link>
                  </>
                )}

                {/* {showMasterDropdown && (
                <>
                  <Link to='/User_Form' className='ms-4' style={{ color: 'black', textDecoration: 'none', marginTop: '20px' }}><BsFillCloudArrowUpFill style={{ marginRight: '10px' }} />Group Manager<br /></Link><br />
                  <Link to='/User_Form' className='ms-4' style={{ color: 'black', textDecoration: 'none', marginTop: '20px' }}><BsFillCloudArrowUpFill style={{ marginRight: '10px' }} />User Role<br /></Link><br />
                  <Link to='/User_Form' className='ms-4' style={{ color: 'black', textDecoration: 'none', marginTop: '20px' }}><BsFillCloudArrowUpFill style={{ marginRight: '10px' }} />Add User<br /></Link><br />
                  <Link to='/User_List' className='ms-4' style={{ color: 'black', textDecoration: 'none' }}><BsCloudyFill style={{ marginRight: '10px' }} />User List<br /></Link><br />
                </>
              )} */}
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
                    <div className='row' onClick={() => window.open("/Cbsl_User.pdf", '_blank')}>
                      <Link to='#' className='ms-4 mt-5' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><PiFilePdfDuotone style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />User Manual</Link>
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
                    <div className='row' onClick={() => window.open("/Cbsl_User.pdf", '_blank')}>
                      <Link to='#' className='ms-1 mt-5' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><PiFilePdfDuotone style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />User Manual</Link>
                    </div>
                    <div className='row' onClick={handleActiveTab}>
                      <Link to='/dashboard' className='ms-1 ' style={{ color: 'black', textDecoration: 'none' }}><FaHome style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Dashboard</Link>
                    </div>

                    <div className='row' onClick={handleActiveTab}>
                      <Link to='/uploadDatabase' className='ms-1' style={{ color: 'black', textDecoration: 'none' }}><MdUpload style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Upload Database</Link>
                    </div>
                    <div className='row' onClick={handleActiveTab}>
                      <a className='ms-1' style={{ color: 'black', textDecoration: 'none' }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />MIS Report <IoIosArrowDown style={{ marginLeft: '50px' }} onClick={handleReportDropdown} /></a>
                    </div>
                    {showReportDropdown && (
                      <>
                        <hr />
                        <Link to='/report' className='ms-1' style={{ color: 'black', textDecoration: 'none', marginTop: '20px' }}><BsFillCloudArrowUpFill style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Location Wise Report</Link>

                        <hr />
                      </>
                    )}
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
                <div className='row' onClick={() => window.open("/Cbsl_User.pdf", '_blank')}>
                  <Link to='#' className='ms-4 mt-5' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><PiFilePdfDuotone style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />User Manual</Link>
                </div>
                <div className='row' onClick={handleActiveTab}>
                  <Link to='/dashboard' className='ms-4' style={{ color: 'black', textDecoration: 'none' }}><FaHome style={{ marginRight: '10px' }} />Dashboard</Link>
                </div>
                <div className='row' onClick={handleActiveTab}>
                  <a className='ms-4' style={{ color: 'black', textDecoration: 'none' }}><VscGraph style={{ marginRight: '10px' }} />MIS Report <IoIosArrowDown style={{ marginLeft: '50px' }} onClick={handleReportDropdown} /></a>
                </div>
                <div className='row' onClick={handleActiveTab}>
                  <a className='ms-4' style={{ color: 'black', textDecoration: 'none' }}><VscGraph style={{ marginRight: '10px' }} /> Masters <IoIosArrowDown style={{ marginLeft: '50px' }} onClick={handleMasterDropdown} /></a>
                </div>
                {showReportDropdown && (
                  <>
                    <Link to='/uploadDatabase'><p className='ms-4 '><MdUpload style={{ marginRight: '10px', color: '#107393' }} /></p></Link>
                  </>
                )}
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
                    <div className='row mt-5' onClick={handleActiveTab}>
                      <Link to='/dashboard' className='ms-1 ' style={{ color: 'black', textDecoration: 'none' }}><FaHome style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Dashboard</Link>
                    </div>
                    <div className='row' onClick={handleActiveTab}>
                      <Link to='/dbSiteReports' className='ms-1' style={{ color: 'black', textDecoration: 'none' }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Server/DB Site Reports</Link>
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
                <div className='row mt-5' onClick={handleActiveTab}>
                  <Link to='/dashboard' className='ms-4' style={{ color: 'black', textDecoration: 'none' }}><FaHome style={{ marginRight: '10px' }} />Dashboard</Link>
                </div>
                <div className='row' onClick={handleActiveTab}>
                  <Link to='/dbSiteReports' className='ms-1' style={{ color: 'black', textDecoration: 'none' }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Server/DB Site Reports</Link>
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
                    <div className='row' onClick={() => window.open("/District_Head.pdf", '_blank')}>
                      <Link to='#' className='ms-4 mt-5' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><PiFilePdfDuotone style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />User Manual</Link>
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
                    <div className='row' onClick={() => window.open("/District_Head.pdf", '_blank')}>
                      <Link to='#' className='ms-1 mt-5' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><PiFilePdfDuotone style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />User Manual</Link>
                    </div>
                    <div className='row' onClick={handleActiveTab}>
                      <Link to='/dashboard' className='ms-1' style={{ color: 'black', textDecoration: 'none' }}><FaHome style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Dashboard</Link>
                    </div>
                    <div className='row' onClick={handleActiveTab}>
                      <Link to='/locationwisereport' className='ms-1' style={{ color: 'black', textDecoration: 'none' }}><FaHome style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Another Dashboard</Link>
                    </div>
                    <div className='row' onClick={handleActiveTab}>
                      <a className='ms-1' style={{ color: 'black', textDecoration: 'none' }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />MIS Report <IoIosArrowDown style={{ marginLeft: '50px' }} onClick={handleReportDropdown} /></a>
                    </div>
                    {showReportDropdown && (
                      <>
                        <hr />
                        <Link to='/report' className='ms-1' style={{ color: 'black', textDecoration: 'none', marginTop: '20px' }}><BsFillCloudArrowUpFill style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Location Wise Report</Link>

                        <hr />
                      </>
                    )}
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
                  <Link to='#' className='ms-4 mt-5' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><PiFilePdfDuotone style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />User Manual</Link>
                </div>
                <div className='row' onClick={handleActiveTab}>
                  <Link to='/dashboard' className='ms-4 ' style={{ color: 'black', textDecoration: 'none' }}><FaHome style={{ marginRight: '10px' }} />Dashboard</Link>
                </div>
                <div className='row' onClick={handleActiveTab}>
                  <a className='ms-4' style={{ color: 'black', textDecoration: 'none' }}><VscGraph style={{ marginRight: '10px' }} />MIS Report <IoIosArrowDown style={{ marginLeft: '50px' }} onClick={handleReportDropdown} /></a>
                </div>
                <div className='row' onClick={handleActiveTab}>
                  <a className='ms-4' style={{ color: 'black', textDecoration: 'none' }}><VscGraph style={{ marginRight: '10px' }} /> Masters <IoIosArrowDown style={{ marginLeft: '50px' }} onClick={handleMasterDropdown} /></a>
                </div>
                {showReportDropdown && (
                  <>
                    <Link to='/report' className='ms-4' style={{ color: 'black', textDecoration: 'none', marginTop: '20px' }}><BsFillCloudArrowUpFill style={{ marginRight: '10px' }} />Location Wise Report</Link>

                  </>
                )}
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
                    <div className='row' onClick={() => window.open("/Cbsl_Admin.pdf", '_blank')}>
                      <Link to='#' className='ms-4 mt-5' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><PiFilePdfDuotone style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />User Manual</Link>
                    </div>
                    <Link to='/dashboard'><p className='ms-4 '><FaHome style={{ marginRight: '10px', color: '#107393' }} /></p></Link>
                    <div className='row' onClick={handleActiveTab}>
                      <Link to='/locationwisereport' className='ms-1 ' style={{ color: 'black', textDecoration: 'none' }}><FaHome style={{ marginRight: '10px', fontSize: '20px', color: '#337ab7' }} />New Page</Link>
                    </div>
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
                    <div className='row' onClick={() => window.open("/Cbsl_Admin.pdf", '_blank')}>
                      <Link to='#' className='ms-1 mt-5' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><PiFilePdfDuotone style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />User Manual</Link>
                    </div>
                    <div className='row' onClick={handleActiveTab}>
                      <Link to='/dashboard' className='ms-1 ' style={{ color: 'black', textDecoration: 'none' }}><FaHome style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Dashboard</Link>
                    </div>
                    <div className='row' onClick={handleActiveTab}>
                      <Link to='/locationwisereport' className='ms-1 ' style={{ color: 'black', textDecoration: 'none' }}><FaHome style={{ marginRight: '10px', fontSize: '20px', color: '#337ab7' }} />New Page</Link>
                    </div>
                    <div className='row' onClick={handleActiveTab}>
                      <a className='ms-1' style={{ color: 'black', textDecoration: 'none' }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />MIS Report <IoIosArrowDown style={{ marginLeft: '50px' }} onClick={handleReportDropdown} /></a>
                    </div>
                    {showReportDropdown && (
                  <>
                    <hr />
                    <Link to='/report' className='ms-1' style={{ color: 'black', textDecoration: 'none', marginTop: '20px' }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Location Wise Report</Link>
                    <br /><Link to='/file' className='ms-1' style={{ color: 'black', textDecoration: 'none' }}><BsCloudyFill style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Last Upload File</Link><br/>
                    <br/><Link to='/dailyReport' className='ms-1' style={{ color: 'black', textDecoration: 'none', marginTop: '20px', cursor: 'pointer' }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Daily Report</Link>
                    <hr />
                  </>
                )}

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
                <div className='row' onClick={() => window.open("/Cbsl_Admin.pdf", '_blank')}>
                  <Link to='#' className='ms-1 mt-5' style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}><PiFilePdfDuotone style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />User Manual</Link>
                </div>
                <div className='row' onClick={handleActiveTab}>
                  <Link to='/dashboard' className='ms-1' style={{ color: 'black', textDecoration: 'none' }}><FaHome style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Dashboard</Link>
                </div>
                <div className='row' onClick={handleActiveTab}>
                  <a className='ms-1' style={{ color: 'black', textDecoration: 'none' }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />MIS Report <IoIosArrowDown style={{ marginLeft: '50px' }} onClick={handleReportDropdown} /></a>
                </div>
                {showReportDropdown && (
                  <>
                    <hr />
                    <Link to='/report' className='ms-1' style={{ color: 'black', textDecoration: 'none', marginTop: '20px' }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Location Wise Report</Link>
                    <br /><Link to='/file' className='ms-1' style={{ color: 'black', textDecoration: 'none' }}><BsCloudyFill style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Last Upload File</Link><br/>
                    <Link to='/dailyReport' className='ms-1' style={{ color: 'black', textDecoration: 'none', marginTop: '20px', cursor: 'pointer' }}><VscGraph style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Daily Report</Link>
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
  const externalClient = () => {
    return(
      <>
      <div className='d-none d-xl-block d-lg-block d-md-none d-sm-none'>
          <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#4BC0C0' }}>
            <div className="container-fluid" >
              <span className="btn" onClick={handleSideBar}><IoMenuOutline style={{ color: 'white', fontSize: '30px', marginLeft: '200px' }} /></span>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                </ul>
                <form className="d-flex">
                  <button onClick={handleLogout} className="btn logout-btn" style={{ color: 'white', marginTop: '4px' }}><IoLogOut style={{ color: 'white', fontSize: '30px', marginRight: '10px' }} />LOGOUT</button>
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
                    <Link to='/dashboard'><p className='ms-4 mt-4 '><FaHome style={{ marginRight: '10px', color: '#107393' }} /></p></Link>
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
                    <div className='row mt-4' onClick={handleActiveTab}>
                      <Link to='/dashboard' className='ms-1 ' style={{ color: 'black', textDecoration: 'none' }}><FaHome style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Dashboard</Link>
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
                <button onClick={handleLogout} className="btn logout-btn" style={{ color: 'white', marginTop: '4px' }}><IoLogOut style={{ color: 'white', fontSize: '30px', marginRight: '10px' }} />LOGOUT</button>
              </form>
            </div>
          </nav>
          {showMobileSideBar &&
            <div className='col-2' style={{ paddingRight: '0px', paddingLeft: '0px' }}>
              <div className='mobile-sidebar'>
                <div className='row header-image' style={{ boxShadow: '0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02)', width: '200px' }}>
                  <img src='logo.png' />
                </div>
                <div className='row mt-4' onClick={handleActiveTab}>
                  <Link to='/dashboard' className='ms-1' style={{ color: 'black', textDecoration: 'none' }}><FaHome style={{ marginRight: '10px', fontSize: '20px', color: '#107393' }} />Dashboard</Link>
                </div>
              </div>
            </div>
          }
        </div>
      </>
    )
  }

  const isAdmin = userLog && userLog.user_roles.includes("Admin");
  const isServerUser = userLog && userLog.user_roles.includes("Server Database Monitoring");
  const isCbslUser = userLog && userLog.user_roles.includes("Cbsl User");
  const isDistrictHeadUser = userLog && userLog.user_roles.includes("All District Head");
  const iscbslAdmin = userLog && userLog.user_roles.includes("CBSL Admin");
  const isExternalClient = userLog && userLog.user_roles.includes("Client");

  return (
    <>
      {isAdmin && adminUser()}
      {isExternalClient && externalClient()}
      {isServerUser && serverUser()}
      {isCbslUser && clientUser()}
      {isDistrictHeadUser && districtHeadUser()}
      {iscbslAdmin && cbslAdminUser()}
      {!isAdmin && !isCbslUser && !isDistrictHeadUser && !iscbslAdmin && !isServerUser && !isExternalClient && normalUser()}
    </>

  )
}

export default Header


