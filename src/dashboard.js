

import React, { useState } from "react";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import DistrictHeadDashboard from "./DistrictHeadDashboard";
import AllUserDashboard from "./AllUserDashboard";
import LocationWiseDashboard from "./LocationWiseDashboard";
import CbslAdminDashboard from "./CbslAdminDashboard";
import ExclusiveDashboard from "./exclusiveDashboard";
import "./App.css";

const Dashboard = () => {
  const userLog = JSON.parse(localStorage.getItem("user"));
  const [showSideBar, setShowSideBar] = useState(false);

  // Role checks
  const isDistrictHeadUser = userLog?.user_roles?.includes("All District Head");
  const isAdmin = userLog?.user_roles?.includes("Super Admin");
  const isCbslAdmin = userLog?.user_roles?.includes("CBSL Admin");
  const isExternalClient = userLog?.user_roles?.includes("Client");
  const isHead = userLog?.user_roles?.includes("head") || userLog?.user_roles?.includes("Mis server Reports");
  const exclusiveUser = userLog && (userLog.user_id === 99 || userLog.user_id === 209);

  // Location check with null safety
  const isEmptyLocations =
    !userLog?.locations ||
    userLog.locations.length === 0 ||
    (userLog.locations.length === 1 && (userLog.locations[0]?.id === null && userLog.locations[0]?.name === null));

  // Dashboard renderer
  const renderDashboard = () => {
    if (!userLog) return <AllUserDashboard showSideBar={showSideBar} />;
    if (isDistrictHeadUser) return <DistrictHeadDashboard showSideBar={showSideBar} />;
    if (isCbslAdmin) return <CbslAdminDashboard showSideBar={showSideBar} />;
    if (exclusiveUser) return <ExclusiveDashboard />;
    if (isAdmin || isHead || isEmptyLocations) return <AllUserDashboard showSideBar={showSideBar} />;
    // if (isExternalClient) return <LocationWiseDashboard />;
    return <LocationWiseDashboard location={userLog.locations} showSideBar={showSideBar} />;
  };

  return (
    <>
      <Header showSideBar={showSideBar} setShowSideBar={setShowSideBar} />
      {renderDashboard()}
      <Footer />
    </>
  );
};

export default Dashboard;
