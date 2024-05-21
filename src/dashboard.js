import React, { useEffect, useState, useRef } from "react";
import { CCard, CCardBody, CCol, CCardHeader, CRow } from "@coreui/react";
import {
  CChartBar,
  CChartDoughnut,
  CChartLine,
  CChartPie,
  CChartPolarArea,
  CChartRadar,
} from "@coreui/react-chartjs";
import Header from "./Components/Header";
import axios, { all } from "axios";
import "./App.css";
import Footer from "./Footer";
import { BarChart } from "@mui/x-charts/BarChart";
import { format, sub } from "date-fns";
import { MdFileDownload } from "react-icons/md";
import DistrictHeadDashboard from "./DistrictHeadDashboard";
import AllUserDashboard from "./AllUserDashboard";
import LocationWiseDashboard from "./LocationWiseDashboard";
import CbslAdminDashboard from "./CbslAdminDashboard";

const Dashboard = () => {
  const userLog = JSON.parse(localStorage.getItem("user"));
  console.log("User's Info", userLog);
  const isDistrictHeadUser =
    userLog && userLog.user_roles.includes("All District Head");

    const iscbslAdmin =
    userLog && userLog.user_roles.includes("CBSL Admin");

  const isEmptyLocations = userLog.locations.length === 1 && 
                           userLog.locations[0].id === null && 
                           userLog.locations[0].name === null;

  return (
    <>
       <Header />
      {isDistrictHeadUser ? (
        <DistrictHeadDashboard />
      ) : isEmptyLocations ? (
        <AllUserDashboard />
      ) : iscbslAdmin ?(
        <CbslAdminDashboard/>
      ) : (
        <LocationWiseDashboard location={userLog.locations} />
      )
      }
      <Footer />
    </>
  )
}

export default Dashboard;

