import React, { useEffect, useState } from "react";
import { IoMenuOutline } from "react-icons/io5";
import { IoLogOut } from "react-icons/io5";
import { FaHome } from "react-icons/fa";
import { VscGraph } from "react-icons/vsc";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { BsFillCloudArrowUpFill } from "react-icons/bs";
import { BsCloudyFill } from "react-icons/bs";
import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    Router,
    useLocation,
    NavLink,
} from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { RiUserFill } from "react-icons/ri";
import { HiMiniUserGroup, HiMiniUserPlus } from "react-icons/hi2";
import { MdReport, MdUpload } from "react-icons/md";
import axios from "axios";
import { API_URL } from "../Api";
import { PiFilePdfDuotone } from "react-icons/pi";
import { MdMessage, MdAdd, MdBarChart } from "react-icons/md";

const Header = ({ showSideBar, setShowSideBar }) => {
    const [showMobileSideBar, setShowMobileSideBar] = useState(false);
    const [showReportDropdown, setShowReportDropdown] = useState(false);
    const [showMasterDropdown, setShowMasterDropdown] = useState(false);
    const [activeTab, setActiveTab] = useState(false);
    const [user, setUser] = useState();
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) =>
        location.pathname === path
            ? { color: "#107393", fontWeight: "bold" }
            : { color: "black", textDecoration: "none" };

    const activeLink = ({ isActive }) => ({
        display: "flex",
        alignItems: "center",
        color: isActive ? "black" : "#107393",
        fontWeight: isActive ? "bold" : "normal",
        textDecoration: "none",
        cursor: "pointer",
    });

    const isClosedSideBarActive = (path) =>
        location.pathname === path
            ? { color: "#050606ff", fontWeight: "bold" }
            : { color: "black", textDecoration: "none" };

    // Retrieve user info from local storage
    const userLog = JSON.parse(localStorage.getItem("user"));
    const userRoles = userLog?.user_roles || [];

    const getManualFile = () => {
        if (userRoles.includes("CBSL Admin")) return "/CBSL_Admin.pdf";
        if (userRoles.includes("All District Head")) return "/District_Head.pdf";
        if (userRoles.includes("Cbsl User")) return "/Cbsl_User.pdf";
        if (userRoles.includes("Admin")) return "/Super_Admin.pdf";
        return null;
    };

    const manualFile = getManualFile();

    const handleReportDropdown = () => {
        setShowReportDropdown(!showReportDropdown);
    };

    const handleMasterDropdown = () => {
        setShowMasterDropdown(!showMasterDropdown);
    };

    const handleActiveTab = () => {
        setActiveTab(!activeTab);
    };

    const handleSideBar = () => {
        setShowSideBar(!showSideBar);
    };

    const handleMobileSideBar = () => {
        setShowMobileSideBar(!showMobileSideBar);
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        navigate("/");
    };
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 992);
        };

        // Check initially
        checkScreenSize();

        // Add event listener
        window.addEventListener("resize", checkScreenSize);

        // Cleanup
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    // Fixed expandedSideBar function - properly returns JSX
    const ExpandedSideBar = () => (
        <div className="col-2" style={{ paddingRight: "0px", paddingLeft: "0px" }}>
            <div className={isMobile ? "mobile-sidebar" : "sidebar"}>
                <div className="row header-image">
                    <img src="logo.png" alt="Logo" />
                </div>

                {manualFile ? (
                    <div
                        className="row"
                        onClick={() => window.open(manualFile, "_blank")}
                    >
                        <Link
                            to="#"
                            className="ms-1 mt-5"
                            style={{
                                color: "black",
                                textDecoration: "none",
                                cursor: "pointer",
                            }}
                        >
                            <PiFilePdfDuotone
                                style={{
                                    marginRight: "10px",
                                    fontSize: "20px",
                                    color: "#107393",
                                }}
                            />
                            User Manual
                        </Link>
                    </div>
                ) : (
                    ""
                )}

                <div className="row">
                    {userRoles.includes("Admin") ||
                        userRoles.includes("Server Database Monitoring") ||
                        userRoles.includes("Management") ||
                        userRoles.includes("CBSL Admin") ||
                        userRoles.includes("All District Head") ||
                        userRoles.includes("Cbsl User") ? (
                        <Link
                            to="/dashboard"
                            className="ms-1"
                            style={{ ...isActive("/dashboard") }}
                        >
                            <FaHome
                                style={{
                                    marginRight: "10px",
                                    fontSize: "20px",
                                    color: "#107393",
                                }}
                            />
                            Dashboard
                        </Link>
                    ) : (
                        ""
                    )}
                </div>
                <div className="row">
                    {userRoles.includes("All District Head") ? (
                        <Link
                            to="/locationwisereport"
                            className="ms-1"
                            style={{ ...isActive("/locationwisereport") }}
                        >
                            <FaHome
                                style={{
                                    marginRight: "10px",
                                    fontSize: "20px",
                                    color: "#107393",
                                }}
                            />
                            Another Dashboard
                        </Link>
                    ) : (
                        ""
                    )}
                </div>

                <div className="row mt-1">
                    {userRoles.includes("Admin") || userRoles.includes("Cbsl User") ? (
                        <Link
                            to="/uploadDatabase"
                            className="ms-1"
                            style={{ ...isActive("/uploadDatabase") }}
                        >
                            <MdUpload
                                style={{
                                    marginRight: "10px",
                                    fontSize: "20px",
                                    color: "#107393",
                                }}
                            />
                            Upload Database
                        </Link>
                    ) : (
                        ""
                    )}
                </div>

                <div className="row">
                    {userRoles.includes("Admin") ||
                        userRoles.includes("Management") ||
                        userRoles.includes("CBSL Admin") ||
                        userRoles.includes("All District Head") ||
                        userRoles.includes("Cbsl User") ||
                        userRoles.includes("Server Database Monitoring") ? (
                        <Link to="/report" style={{ ...isActive("/report") }}>
                            <VscGraph
                                style={{
                                    marginRight: "10px",
                                    fontSize: "20px",
                                    color: "#107393",
                                }}
                            />
                            Location Wise Report
                        </Link>
                    ) : (
                        ""
                    )}
                </div>

                <div className="row">
                    {userRoles.includes("Admin") ||
                        userRoles.includes("Management") ||
                        userRoles.includes("CBSL Admin") ? (
                        <Link to="/file" style={{ ...isActive("/file") }}>
                            <BsCloudyFill
                                style={{
                                    marginRight: "10px",
                                    fontSize: "20px",
                                    color: "#107393",
                                }}
                            />
                            Last Upload File
                        </Link>
                    ) : (
                        ""
                    )}
                </div>
                {userRoles.includes("Management") ? (
                    <div className="row">
                        <Link
                            to="/developmentPage"
                            style={{ ...isActive("/developmentPage") }}
                        >
                            <VscGraph
                                style={{
                                    marginRight: "10px",
                                    fontSize: "20px",
                                    color: "#107393",
                                }}
                            />
                            Man Power Report
                        </Link>
                    </div>
                ) : (
                    ""
                )}
                <div className="row">
                    {userRoles.includes("Admin") ||
                        userRoles.includes("Management") ||
                        userRoles.includes("CBSL Admin") ? (
                        <Link
                            to="/cumulativeReport"
                            style={{ ...isActive("/cumulativeReport") }}
                        >
                            <VscGraph
                                style={{
                                    marginRight: "10px",
                                    fontSize: "20px",
                                    color: "#107393",
                                }}
                            />
                            Daily Process-Wise
                        </Link>
                    ) : (
                        ""
                    )}
                </div>

                <div className="row">
                    {userRoles.includes("Admin") ||
                        userRoles.includes("Management") ||
                        userRoles.includes("CBSL Admin") ? (
                        <Link
                            to="/customerQAReport"
                            style={{ ...isActive("/customerQAReport") }}
                        >
                            <VscGraph
                                style={{
                                    marginRight: "10px",
                                    fontSize: "20px",
                                    color: "#107393",
                                }}
                            />
                            Customer QA Report
                        </Link>
                    ) : (
                        ""
                    )}
                </div>

                {userRoles.includes("Admin") ||
                    userRoles.includes("Server Database Monitoring") ? (
                    <div className="row mt-1">
                        <Link
                            to="/dbSiteReports"
                            className="ms-1"
                            style={{ ...isActive("/dbSiteReports") }}
                        >
                            <VscGraph
                                style={{
                                    marginRight: "10px",
                                    fontSize: "20px",
                                    color: "#107393",
                                }}
                            />
                            Server/DB Site Reports
                        </Link>
                    </div>
                ) : (
                    ""
                )}

                {userRoles.includes("Admin") ||
                    userRoles.includes("Server Database Monitoring") ? (
                    <div className="row mt-1">
                        <Link
                            to="/siteReports"
                            className="ms-1"
                            style={{ ...isActive("/siteReports") }}
                        >
                            <VscGraph
                                style={{
                                    marginRight: "10px",
                                    fontSize: "20px",
                                    color: "#107393",
                                }}
                            />
                            Server Site Reports
                        </Link>
                    </div>
                ) : (
                    ""
                )}
                <div className="row">
                    {userRoles.includes("Admin") || userRoles.includes("CBSL Admin") ? (
                        <Link
                            to="/addRemarks"
                            className="ms-1"
                            style={{ ...isActive("/addRemarks") }}
                        >
                            <VscGraph
                                style={{
                                    marginRight: "10px",
                                    fontSize: "20px",
                                    color: "#107393",
                                }}
                            />
                            Add Remarks
                        </Link>
                    ) : (
                        ""
                    )}
                </div>

                <div className="row">
                    {userRoles.includes("Admin") || userRoles.includes("CBSL Admin") ? (
                        <Link
                            to="/MIS_Form"
                            className="ms-1"
                            style={{ ...isActive("/MIS_Form") }}
                        >
                            <MdAdd
                                style={{
                                    marginRight: "10px",
                                    fontSize: "20px",
                                    color: "#107393",
                                }}
                            />
                            Add Manpower
                        </Link>
                    ) : (
                        ""
                    )}
                </div>

                {userRoles.includes("Admin") ||
                    userRoles.includes("Management") ||
                    userRoles.includes("CBSL Admin") ? (
                    <Link
                        to="/clientreport"
                        className="ms-1"
                        style={{ ...isActive("/clientreport") }}
                    >
                        <MdReport
                            style={{
                                marginRight: "10px",
                                fontSize: "20px",
                                color: "#107393",
                            }}
                        />
                        Client View
                    </Link>
                ) : (
                    ""
                )}

                <div className="row mt-1" onClick={handleActiveTab}>
                    {userRoles.includes("Admin") ? (
                        <a
                            className="ms-1"
                            style={{
                                color: "black",
                                textDecoration: "none",
                                cursor: "pointer",
                            }}
                            onClick={handleMasterDropdown}
                        >
                            <FaUserAlt
                                style={{
                                    marginRight: "10px",
                                    fontSize: "20px",
                                    color: "#107393",
                                    cursor: "pointer",
                                }}
                                onClick={handleMasterDropdown}
                            />
                            Masters
                            <IoIosArrowDown
                                style={{ marginLeft: "73px" }}
                                onClick={handleMasterDropdown}
                            />
                        </a>
                    ) : (
                        ""
                    )}
                </div>

                {showMasterDropdown && userRoles.includes("Admin") ? (
                    <>
                        <hr />
                        <Link
                            to="/groupManager"
                            className="ms-1"
                            style={{
                                color: "black",
                                textDecoration: "none",
                                cursor: "pointer",
                            }}
                        >
                            <FaUsers
                                style={{
                                    marginRight: "10px",
                                    fontSize: "20px",
                                    color: "#107393",
                                }}
                            />
                            Group Manager
                            <br />
                        </Link>
                        <Link
                            to="/userRole"
                            className="ms-1"
                            style={{
                                color: "black",
                                textDecoration: "none",
                                marginTop: "20px",
                                cursor: "pointer",
                            }}
                        >
                            <RiUserFill
                                style={{
                                    marginRight: "10px",
                                    fontSize: "20px",
                                    color: "#107393",
                                }}
                            />
                            User Role
                            <br />
                        </Link>
                        <Link
                            to="/User_Form"
                            className="ms-1"
                            style={{
                                color: "black",
                                textDecoration: "none",
                                marginTop: "20px",
                                cursor: "pointer",
                            }}
                        >
                            <HiMiniUserPlus
                                style={{
                                    marginRight: "10px",
                                    fontSize: "20px",
                                    color: "#107393",
                                }}
                            />
                            Add User
                            <br />
                        </Link>
                        <Link
                            to="/User_List"
                            className="ms-1"
                            style={{
                                color: "black",
                                textDecoration: "none",
                                cursor: "pointer",
                            }}
                        >
                            <HiMiniUserGroup
                                style={{
                                    marginRight: "10px",
                                    fontSize: "20px",
                                    color: "#107393",
                                }}
                            />
                            User List
                            <br />
                        </Link>
                        <hr />
                    </>
                ) : (
                    ""
                )}
            </div>
        </div>
    );

    return (
        <>
            <div className="d-none d-xl-block d-lg-block d-md-none d-sm-none">
                <nav
                    className="navbar navbar-expand-lg"
                    style={{ backgroundColor: "#4BC0C0" }}
                >
                    <div className="container-fluid">
                        <span className="btn" onClick={handleSideBar}>
                            <IoMenuOutline
                                style={{
                                    color: "white",
                                    fontSize: "30px",
                                    marginLeft: "200px",
                                }}
                            />
                        </span>
                        <div
                            className="collapse navbar-collapse"
                            id="navbarSupportedContent"
                        >
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
                            <form className="d-flex">
                                <button
                                    onClick={handleLogout}
                                    className="btn logout-btn"
                                    style={{ color: "white", marginTop: "4px" }}
                                >
                                    <IoLogOut
                                        style={{
                                            color: "white",
                                            fontSize: "30px",
                                            marginRight: "10px",
                                        }}
                                    />
                                    LOGOUT
                                </button>
                                <p
                                    className="ms-2"
                                    style={{ color: "white", marginTop: "10px" }}
                                >
                                    Welcome: {userLog ? userLog.first_name : "Guest"}
                                </p>
                            </form>
                        </div>
                    </div>
                </nav>

                {showSideBar ? (
                    <div className="row">
                        <div className="col-1">
                            <div className="shrink-sidebar">
                                <div className="row shrink-header-image">
                                    <img
                                        src="logo.png"
                                        className="ms-15"
                                        style={{
                                            width: "65px",
                                            height: "auto",
                                            objectFit: "contain",
                                        }}
                                        alt="Logo"
                                    />
                                </div>
                                <div
                                    style={{
                                        height: "100vh",
                                        overflowY: "auto",
                                        marginLeft: "12px",
                                    }}
                                >





                                    {manualFile ? (
                                        <div className="row" onClick={() => window.open(manualFile, "_blank")}>
                                            <NavLink
                                                to="#"
                                                className="ms-4 mt-3"
                                                style={activeLink}
                                            >
                                                <PiFilePdfDuotone
                                                    style={{ marginRight: "10px", fontSize: "20px", color: "#107393" }}
                                                />
                                            </NavLink>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                    <div className="row">
                                        {(userRoles.includes("Admin") ||
                                            userRoles.includes("Server Monitoring") ||
                                            userRoles.includes("Management") ||
                                            userRoles.includes("CBSL Admin") ||
                                            userRoles.includes("All District Head") ||
                                            userRoles.includes("Cbsl User")) && (
                                                <NavLink to="/dashboard" className="ms-4 mt-3" end style={activeLink}>
                                                    <FaHome style={{ fontSize: "20px" }} />
                                                </NavLink>
                                            )}
                                    </div>
                                    <div className="row mt-1">
                                        {(userRoles.includes("Admin") || userRoles.includes("Cbsl User")) && (
                                            <NavLink to="/uploadDatabase" className="ms-4 mt-3" style={activeLink}>
                                                <MdUpload style={{ fontSize: "20px" }} />
                                            </NavLink>
                                        )}
                                    </div>
                                    <div className="row">
                                        {(userRoles.includes("Admin") ||
                                            userRoles.includes("Management") ||
                                            userRoles.includes("CBSL Admin") ||
                                            userRoles.includes("All District Head") ||
                                            userRoles.includes("Cbsl User")) && (
                                                <NavLink to="/report" className="ms-4 mt-3" style={activeLink}>
                                                    <VscGraph style={{ fontSize: "20px" }} />
                                                </NavLink>
                                            )}
                                    </div>
                                    <div className="row">
                                        {(userRoles.includes("Admin") ||
                                            userRoles.includes("Management") ||
                                            userRoles.includes("CBSL Admin")) && (
                                                <NavLink to="/file" className="ms-4 mt-3" style={activeLink}>
                                                    <BsCloudyFill style={{ fontSize: "20px" }} />
                                                </NavLink>
                                            )}
                                    </div>
                                    {userRoles.includes("Management") ? (
                                        <div className="row">
                                            <NavLink to="/developmentPage" className="ms-4 mt-3" style={activeLink}>
                                                <VscGraph style={{ fontSize: "20px" }} />
                                            </NavLink>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                    <div className="row">
                                        {(userRoles.includes("Admin") ||
                                            userRoles.includes("Management") ||
                                            userRoles.includes("CBSL Admin")) && (
                                                <NavLink to="/cumulativeReport" className="ms-4 mt-3" style={activeLink}>
                                                    <VscGraph style={{ fontSize: "20px" }} />
                                                </NavLink>
                                            )}
                                    </div>
                                    <div className="row">
                                        {(userRoles.includes("Admin") ||
                                            userRoles.includes("Management") ||
                                            userRoles.includes("CBSL Admin")) && (
                                                <NavLink to="/customerQAReport" className="ms-4 mt-3" style={activeLink}>
                                                    <VscGraph style={{ fontSize: "20px" }} />
                                                </NavLink>
                                            )}
                                    </div>
                                    {(userRoles.includes("Admin") ||
                                        userRoles.includes("Server Database Monitoring")) && (
                                            <div className="row mt-1">
                                                <NavLink to="/dbSiteReports" className="ms-4 mt-3" style={activeLink}>
                                                    <VscGraph style={{ fontSize: "20px" }} />
                                                </NavLink>
                                            </div>
                                        )}
                                    {(userRoles.includes("Admin") ||
                                        userRoles.includes("Server Database Monitoring")) && (
                                            <div className="row mt-1">
                                                <NavLink to="/siteReports" className="ms-4 mt-3" style={activeLink}>
                                                    <VscGraph style={{ fontSize: "20px" }} />
                                                </NavLink>
                                            </div>
                                        )}
                                    {userRoles.includes("Admin") || userRoles.includes("CBSL Admin") ? (
                                        <div className="row">
                                            <NavLink to="/addRemarks" className="ms-4 mt-3" style={activeLink}>
                                                <VscGraph style={{ fontSize: "20px" }} />
                                            </NavLink>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                    <div className="row">
                                        {userRoles.includes("Admin") ||
                                            (userRoles.includes("CBSL Admin") && (
                                                <NavLink to="/MIS_Form" className="ms-4 mt-3" style={activeLink}>
                                                    <MdAdd style={{ fontSize: "20px" }} />
                                                </NavLink>
                                            ))}
                                    </div>
                                    {userRoles.includes("Admin") || userRoles.includes("Management") ? (
                                        <div className="row">
                                            <NavLink to="/clientreport" className="ms-4 mt-3" style={activeLink}>
                                                <MdReport style={{ fontSize: "20px", marginRight: "10px" }} />
                                            </NavLink>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                    <div className="row mt-1" onClick={handleMasterDropdown}>
                                        {userRoles.includes("Admin") && (
                                            <div
                                                className="ms-4 mt-3"
                                                style={{
                                                    color: "black",
                                                    textDecoration: "none",
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                                onClick={handleMasterDropdown}
                                            >
                                                <FaUserAlt
                                                    style={{
                                                        fontSize: "20px",
                                                        color: "#107393",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={handleMasterDropdown}
                                                />
                                                {showSideBar && <span style={{ marginLeft: "10px" }}></span>}
                                                {showSideBar && <IoIosArrowDown style={{ marginLeft: "auto" }} />}
                                            </div>
                                        )}
                                    </div>

                                    {showMasterDropdown && userRoles.includes("Admin") && (
                                        <>
                                            <hr />
                                            <NavLink to="/groupManager" className="ms-4 mt-3" style={activeLink} end>
                                                <FaUsers style={{ fontSize: "20px", color: "inherit" }} />
                                            </NavLink>
                                            <NavLink to="/userRole" className="ms-4 mt-3" style={activeLink} end>
                                                <RiUserFill style={{ fontSize: "20px", color: "inherit" }} />
                                            </NavLink>
                                            <NavLink to="/User_Form" className="ms-4 mt-3" style={activeLink} end>
                                                <HiMiniUserPlus style={{ fontSize: "20px", color: "inherit" }} />
                                            </NavLink>
                                            <NavLink to="/User_List" className="ms-4 mt-3" style={activeLink} end>
                                                <HiMiniUserGroup style={{ fontSize: "20px", color: "inherit" }} />
                                            </NavLink>
                                            <hr />
                                        </>
                                    )}

                                </div>
                            </div>
                        </div>
                        <div className="col-11"></div>
                    </div>
                ) : (
                    <div className="row" style={{ marginLeft: "0" }}>
                        <ExpandedSideBar />
                        <div
                            className="col-10"
                            style={{ paddingRight: "0px", paddingLeft: "0px" }}
                        ></div>
                    </div>
                )}
            </div>

            <div className="d-block d-xl-none d-lg-none d-md-block d-sm-block">
                <nav
                    className="navbar navbar-expand-lg"
                    style={{ backgroundColor: "#4BC0C0" }}
                >
                    <div className="container-fluid">
                        <span className="btn" onClick={handleMobileSideBar}>
                            <IoMenuOutline style={{ color: "white", fontSize: "30px" }} />
                        </span>
                        <form className="d-flex">
                            <button
                                onClick={handleLogout}
                                className="btn logout-btn"
                                style={{ color: "white", marginTop: "4px" }}
                            >
                                <IoLogOut
                                    style={{
                                        color: "white",
                                        fontSize: "30px",
                                        marginRight: "10px",
                                    }}
                                />
                                LOGOUT
                            </button>
                            <p className="ms-2" style={{ color: "white", marginTop: "10px" }}>
                                Welcome: {userLog ? userLog.first_name : "Guest"}
                            </p>
                        </form>
                    </div>
                </nav>
                {showMobileSideBar && <ExpandedSideBar />}
            </div>
        </>
    );
};

export default Header;
