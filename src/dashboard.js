import React from "react";
import Header from "./Components/Header";
import "./App.css";
import Footer from "./Components/Footer";
import DistrictHeadDashboard from "./DistrictHeadDashboard";
import AllUserDashboard from "./AllUserDashboard";
import LocationWiseDashboard from "./LocationWiseDashboard";
import CbslAdminDashboard from "./CbslAdminDashboard";
import ExclusiveDashboard from "./exclusiveDashboard";


const Dashboard = () => {
  const userLog = JSON.parse(localStorage.getItem("user"));
  console.log("User's Info", userLog);
  const isDistrictHeadUser = userLog && userLog.user_roles.includes("All District Head");
  const iscbslAdmin = userLog && userLog.user_roles.includes("CBSL Admin");
  const isExternalClient = userLog && userLog.user_roles.includes("Client");
  const isEmptyLocations = userLog.locations.length === 1 && userLog.locations[0].id === null && userLog.locations[0].name === null;
  const exclusiveUser = userLog && (userLog.user_id === 99 || userLog.user_id === 209);
  return (
    <>
      <Header />
      {userLog ? (
        isDistrictHeadUser ? (
          <DistrictHeadDashboard />
        ) :
          exclusiveUser ? (
            <ExclusiveDashboard />
          ) :
            isEmptyLocations ? (
              <AllUserDashboard />
            ) :
              iscbslAdmin ? (
                <CbslAdminDashboard />
              ) :
                (
                  <LocationWiseDashboard location={userLog.locations} />
                )
      ) : (
        <AllUserDashboard />
      )}
      <Footer />
    </>
  );
  
}

export default Dashboard;

