// import React from "react";
// import Header from "./Components/Header";
// import "./App.css";
// import Footer from "./Components/Footer";
// import DistrictHeadDashboard from "./DistrictHeadDashboard";
// import AllUserDashboard from "./AllUserDashboard";
// import LocationWiseDashboard from "./LocationWiseDashboard";
// import CbslAdminDashboard from "./CbslAdminDashboard";
// import ExclusiveDashboard from "./exclusiveDashboard";

// const Dashboard = () => {
//   const userLog = JSON.parse(localStorage.getItem("user"));
//   console.log("User's Info", userLog);
//   const isDistrictHeadUser = userLog && userLog.user_roles.includes("All District Head");
//   const iscbslAdmin = userLog && userLog.user_roles.includes("CBSL Admin");
//   const isExternalClient = userLog && userLog.user_roles.includes("Client");
//   const isEmptyLocations = userLog.locations.length === 1 && userLog.locations[0].id === null && userLog.locations[0].name === null;
//   const exclusiveUser = userLog && (userLog.user_id === 99 || userLog.user_id === 209);
//   return (
//     <>
//       <Header />
//       {userLog ? (
//         isDistrictHeadUser ? (
//           <DistrictHeadDashboard />
//         ) :
//           exclusiveUser ? (
//             <ExclusiveDashboard />
//           ) :
//             isEmptyLocations ? (
//               <AllUserDashboard />
//             ) :
//               iscbslAdmin ? (
//                 <CbslAdminDashboard />
//               ) :
//                 (
//                   <LocationWiseDashboard location={userLog.locations} />
//                 )
//       ) : (
//         <AllUserDashboard />
//       )}
//       <Footer />
//     </>
//   );

// }

// export default Dashboard;

import React from "react";
import Header from "./Components/Header";
import "./App.css";
import Footer from "./Components/Footer";
import DistrictHeadDashboard from "./DistrictHeadDashboard";
import AllUserDashboard from "./AllUserDashboard";
import LocationWiseDashboard from "./LocationWiseDashboard";
import CbslAdminDashboard from "./CbslAdminDashboard";
import ExclusiveDashboard from "./exclusiveDashboard";
import { jwtDecode } from "jwt-decode";

// const Dashboard = () => {
//   const userLog = JSON.parse(localStorage.getItem("user"));
//   console.log("User's Info", userLog);
//   const isDistrictHeadUser = userLog && userLog.user_roles.includes("All District Head");
//   const iscbslAdmin = userLog && userLog.user_roles.includes("CBSL Admin");
//   const isExternalClient = userLog && userLog.user_roles.includes("Client");
//   // const isEmptyLocations = userLog.locations.length === 1 && userLog.locations[0].id === null && userLog.locations[0].name === null ;
//   const exclusiveUser = userLog && (userLog.user_id === 99 || userLog.user_id === 209);
//   return (
//     <>
//       <Header />
//       {userLog ? (
//         isDistrictHeadUser ? (
//           <DistrictHeadDashboard />
//         ) :
//           exclusiveUser ? (
//             <ExclusiveDashboard />
//           ) :
//             // isEmptyLocations ? (
//             //   <AllUserDashboard />
//             // ) :
//               iscbslAdmin ? (
//                 <CbslAdminDashboard />
//               ) :
//                 (
//                   <LocationWiseDashboard location={userLog.locations} />
//                 )
//       ) : (
//         <AllUserDashboard />
//       )}
//       <Footer />
//     </>
//   );

// }
const Dashboard = () => {
  const userLog = JSON.parse(localStorage.getItem("user"));
  console.log("User's Info", userLog);

  const isDistrictHeadUser = userLog?.user_roles?.includes("All District Head");
  const isCbslAdmin = userLog?.user_roles?.includes("CBSL Admin");
  const isExternalClient = userLog?.user_roles?.includes("Client");
  const exclusiveUser = userLog && (userLog.user_id === 99 || userLog.user_id === 209);

  const isEmptyLocations =
    !userLog?.locations ||
    userLog.locations.length === 0 ||
    userLog.locations.every(
      (loc) =>
        loc === null ||
        (loc.id === null && loc.name === null)
    );

  const renderDashboard = () => {
    if (!userLog) return <AllUserDashboard />;
    if (isDistrictHeadUser) return <DistrictHeadDashboard />;
    if (isCbslAdmin) return <CbslAdminDashboard />;
    // if (isExternalClient) return <LocationWiseDashboard />;
    if(exclusiveUser) return <ExclusiveDashboard/>
    if (isEmptyLocations) return <AllUserDashboard />;

    return <LocationWiseDashboard location={userLog.locations} />;
  };

  return (
    <>
      <Header />
      {renderDashboard()}
      <Footer />
    </>
  );
};

export default Dashboard;

