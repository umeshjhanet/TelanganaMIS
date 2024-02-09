import React, {useState, useEffect} from 'react'
import { IoMenuOutline } from "react-icons/io5";
import { IoLogOut } from "react-icons/io5";
import { FaHome } from "react-icons/fa";
import { VscGraph } from "react-icons/vsc";
import { IoIosArrowDown } from "react-icons/io";
import { BsFillCloudArrowUpFill } from "react-icons/bs";
import { BsCloudyFill } from "react-icons/bs";
import Dashboard from '../dashboard';
import Header from './Header';


const SideBar = ({sidebar}) => {

    const [showSideBar,setShowSideBar] = useState(false);
    const [showReportDropdown, setShowReportDropdown] = useState(false);
    const [activeTab, setActiveTab] = useState(false);

    const handleReportDropdown = () => {
        setShowReportDropdown(!showReportDropdown);
    }
    const handleActiveTab = () => {
      setActiveTab(!activeTab);
    }
   

  return (
    <>
    {/* <Header/> */}
     <div className='container-fluid'>
    <div className='row' >
      {showSideBar ? (
         <>
        <div className='col-1' style={{paddingRight:'0px',paddingLeft:'0px'}}>
      <>
       <div className='shrink-sidebar'>
        <div className='row' style={{boxShadow:'0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02)',height:'66px',width:'250px'}}>
        <img src='ezeefile.png' style={{height:'60px', width:'60px',display:'flex', justifyContent:'center',alignItems:'center'}}/>   
        </div>
          <p className='ms-4 mt-5'><FaHome style={{marginRight:'10px'}}/></p>
          <p className='ms-4 '><VscGraph style={{marginRight:'10px'}}/></p>   
      </div>
      </>
      </div>
       {/* <div className='col-11' style={{paddingRight:'0px',paddingLeft:'0px'}}>
       <Dashboard/>
       </div> */}
       </> 
     ) : ( 
      <>
      <div className='col-2' style={{paddingRight:'0px',paddingLeft:'0px'}}>
  <div className='sidebar'>
        <div className='row' style={{boxShadow:'0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02)',height:'66px',width:'250px'}}>
        <img src='ezeefile.png' style={{height:'60px', width:'60px',display:'flex', justifyContent:'center',alignItems:'center'}}/>   
        </div>
        <div className='row' onClick={handleActiveTab} >
        <a href='/' className='ms-4 mt-5' style={{color:'black',textDecoration:'none'}}><FaHome style={{marginRight:'10px'}} />Dashboard</a>
        </div>
        <div className='row' onClick={handleActiveTab}>
        <a className='ms-4' style={{color:'black',textDecoration:'none'}}><VscGraph style={{marginRight:'10px'}}/>MIS Report <IoIosArrowDown style={{marginLeft:'50px'}} onClick={handleReportDropdown}/></a>
        </div>
          {showReportDropdown && (
              <>
              <a href='/r' className='ms-4' style={{color:'black',textDecoration:'none',marginTop:'20px'}}><BsFillCloudArrowUpFill style={{marginRight:'10px'}}/>Location Wise Report</a>
              <a href='/report' className='ms-4' style={{color:'black',textDecoration:'none'}}><BsCloudyFill style={{marginRight:'10px'}}/>Last Upload File</a>
              </>
          )}
          
      </div>
      </div>
       {/* <div className='col-10' style={{paddingRight:'0px',paddingLeft:'0px'}}>
       <Dashboard/>
       </div> */}
       </>
      )} 
      </div>
  </div>
    </>
   
  )
}

export default SideBar