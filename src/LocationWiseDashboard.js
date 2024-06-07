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
import { API_URL } from "./Api";
import { useNavigate } from 'react-router-dom';
import queryString from 'query-string';

const LocationWiseDashboard = () => {
  const currentDate = new Date();
  const yesterdayDate = sub(currentDate, { days: 1 });
  const previousDate = sub(currentDate, { days: 2 });
  const formattedCurrentDate = format(currentDate, "dd-MM-yyyy");
  const formattedYesterdayDate = format(yesterdayDate, "dd-MM-yyyy");
  const formattedPreviousDate = format(previousDate, "dd-MM-yyyy");
  const userLog = JSON.parse(localStorage.getItem("user"));
  const [tableData, setTableData] = useState([]);
  const [allLocationYesImage, setAllLocationYesImage] = useState({
    labels: [],
    datasets: [
      {
        label: "No. of Images",
        backgroundColor: "#66b3ff",
        data: [],
      },
    ],
  });
  const [allLocationImage, setAllLocationImage] = useState({
    labels: [],
    datasets: [
      {
        label: "No. of Images",
        backgroundColor: "#f87979",
        data: [],
      },
    ],
  });
  const [monthImage, setMonthImage] = useState({
    labels: [],
    datasets: [
      {
        label: "No. of Images",
        backgroundColor: "#02B2AF",
        data: [],
      },
    ],
  });

  useEffect(() => {
    const fetchMonthImageGraphData = () => {
      const locationNames = userLog.locations.map(location => `${location.name}`);

      axios
        .get(`${API_URL}/graphmonth`, {
          params: { locationName: locationNames }
        })
        .then((response) => {
          const apiData = response.data;
          const labels = apiData.map((item) => item["scandate"]);
          const data = apiData.map((item) => item["Scanned No Of Images"]);
          console.log("lables", labels);
          console.log("images", data);
          setMonthImage({
            labels: labels.filter((label) => label !== "id"),
            datasets: [
              {
                ...monthImage.datasets[0],
                data: data,
              },
            ],
          });
          console.log("Monthly  data fetch", monthImage);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

    const fetchAllYesGraphImageData = () => {
      const locationNames = userLog.locations.map(location => `${location.name}`);
      const apiUrl = `${API_URL}/graph9`;
    
      axios.get(apiUrl, { params: { locationname: locationNames } })
        .then((response) => {
          const apiData = response.data;
    
          if (!apiData || apiData.length === 0) {
            console.error("No data received from the API");
            return;
          }
    
          // Assuming apiData is an array of objects with "Location Name" and "Images" properties
          const labels = apiData.map(item => item["Location Name"]);
          const data = apiData.map(item => parseInt(item["Images"], 10)); // Convert images to integer
    
          console.log("Labels:", labels);
          console.log("Data:", data);
    
          setAllLocationYesImage({
            labels: labels,
            datasets: [{
              label: "No. of Images",
              data: data,
              backgroundColor: "#4BC0C0",
            }],
          });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };
    

    const fetchAllGraphImageData = () => {
      const locationNames = userLog.locations.map(location => `${location.name}`);
      const apiUrl = `${API_URL}/graph10`;
    
      axios.get(apiUrl, { params: { locationname: locationNames } })
        .then((response) => {
          const apiData = response.data;
    
          if (!apiData || apiData.length === 0) {
            console.error("No data received from the API");
            return;
          }
    
          // Assuming apiData is an array of objects with "Location Name" and "Images" properties
          const labels = apiData.map(item => item["Location Name"]);
          const data = apiData.map(item => parseInt(item["Images"], 10)); // Convert images to integer
    
          console.log("Labels:", labels);
          console.log("Data:", data);
    
          setAllLocationImage({
            labels: labels,
            datasets: [{
              label: "No. of Images",
              data: data,
              backgroundColor: "#4BC0C0",
            }],
          });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };
    
    


    const fetchTableData = () => {
      const locationNames = userLog.locations.map(location => `${location.name}`);

      axios
        .get(`${API_URL}/customtabularData`, {
          params: { locationname: locationNames }
        })
        .then((response) => {
          setTableData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

    fetchAllGraphImageData();
    fetchAllYesGraphImageData();
    fetchTableData();
    fetchMonthImageGraphData();
  }, []);



  const calculateColumnSum = () => {
    let prevFilesSum = 0;
    let prevImagesSum = 0;
    let yesFilesSum = 0;
    let yesImagesSum = 0;
    let todayFilesSum = 0;
    let todayImagesSum = 0;
    let totalFilesSum = 0;
    let totalImagesSum = 0;

    tableData.forEach((elem) => {
      //   if (
      //     selectedLocations.length === 0 ||
      //     selectedLocations.includes(elem.LocationName)
      //   ) {
      prevFilesSum += parseInt(elem.Prev_Files) || 0;
      prevImagesSum += parseInt(elem.Prev_Images) || 0;
      yesFilesSum += parseInt(elem.Yes_Files) || 0;
      yesImagesSum += parseInt(elem.Yes_Images) || 0;
      todayFilesSum += parseInt(elem.Today_Files) || 0;
      todayImagesSum += parseInt(elem.Today_Images) || 0;
      totalFilesSum += parseInt(elem.Total_Files) || 0;
      totalImagesSum += parseInt(elem.Total_Images) || 0;
      //   }
    });

    return {
      prevFilesSum,
      prevImagesSum,
      yesFilesSum,
      yesImagesSum,
      todayFilesSum,
      todayImagesSum,
      totalFilesSum,
      totalImagesSum,
    };
  };
  const columnSums = calculateColumnSum();
  console.log("Location Name", userLog.locations[0].name)
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-2 col-md-0 "></div>
        <div className="col-lg-10 col-md-12">
          <div className="row mt-2">
            <div
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <h4> Telangana Dashboard Welcomes You</h4>
              <p
                style={{
                  fontSize: "12px",
                  color: 'maroon',
                  textAlign: "right",
                }}
              >
                Last Active Login:{" "}
                {userLog ? userLog.last_active_login : "Guest"}
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <CCard>
                <h4 className="ms-1">
                  SCANNED REPORT FOR ({formattedYesterdayDate})
                </h4>
                <h5 className="ms-1">All Location: Images</h5>
                <CCardBody>
                  <CChartBar
                    data={allLocationYesImage}
                    labels="months"
                  ></CChartBar>
                </CCardBody>
              </CCard>
            </div>
            <div className="col-md-6 col-sm-12">
              <CCard>
                <h4 className="ms-1">CUMULATIVE SCANNED TILL DATE</h4>
                <h5 className="ms-1">All Location: Images</h5>
                <CCardBody>
                  <CChartBar
                    data={allLocationImage}
                    labels="months"
                  ></CChartBar>
                </CCardBody>
              </CCard>
            </div>
          </div>
          <div className="row mt-2">
            <div className="card">
              <h4 className="ms-1">SCANNING REPORT OF LAST 30 DAYS</h4>
              <h5 className="ms-1">All Location: Images</h5>
              <CCard>
                <CCardBody>
                  <CChartBar data={monthImage} labels="months" />
                </CCardBody>
              </CCard>
              {/* <div>
                                {scannedData && (
                                    <BarChart
                                        className="scanned-chart"
                                        xAxis={scannedData.xAxis}
                                        series={scannedData.series}
                                        width={scannedData.width}
                                        height={scannedData.height}
                                    />
                                )}
                            </div> */}
            </div>
          </div>
          <div
            className="row mt-5 ms-2 me-2"
            style={{ overflowX: "auto" }}
          >
            <table class="table table-hover table-bordered table-responsive data-table">
              <thead style={{ color: "#4BC0C0" }}>
                <tr>
                  <th rowspan="2">Sr. No.</th>
                  <th rowspan="2">Location</th>
                  <th colspan="2">Scanned ({formattedPreviousDate})</th>
                  <th colspan="2">
                    Scanned ({formattedYesterdayDate})
                  </th>
                  <th colspan="2">Scanned ({formattedCurrentDate})</th>
                  <th colspan="2">Cumulative till date</th>
                  <th rowspan="2">Remarks</th>
                </tr>
                <tr>
                  <th>Files</th>
                  <th>Images</th>
                  <th>Files</th>
                  <th>Images</th>
                  <th>Files</th>
                  <th>Images</th>
                  <th>Files</th>
                  <th>Images</th>
                </tr>
              </thead>

              <tbody style={{ color: "gray" }}>
                {tableData &&
                  tableData.map((elem, index) => {
                    //   if (
                    //     selectedLocations.length === 0 ||
                    //     selectedLocations.includes(elem.LocationName)
                    //   ) {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{elem.LocationName}</td>
                        <td>{isNaN(parseInt(elem.Prev_Files)) ? 0 : parseInt(elem.Prev_Files).toLocaleString()}</td>
                        <td>{isNaN(parseInt(elem.Prev_Images)) ? 0 : parseInt(elem.Prev_Images).toLocaleString()}</td>
                        <td>{isNaN(parseInt(elem.Yes_Files)) ? 0 : parseInt(elem.Yes_Files).toLocaleString()}</td>
                        <td>{isNaN(parseInt(elem.Yes_Images)) ? 0 : parseInt(elem.Yes_Images).toLocaleString()}</td>
                        <td>{isNaN(parseInt(elem.Today_Files)) ? 0 : parseInt(elem.Today_Files).toLocaleString()}</td>
                        <td>{isNaN(parseInt(elem.Today_Images)) ? 0 : parseInt(elem.Today_Images).toLocaleString()}</td>
                        <td>{isNaN(parseInt(elem.Total_Files)) ? 0 : parseInt(elem.Total_Files).toLocaleString()}</td>
                        <td>{isNaN(parseInt(elem.Total_Images)) ? 0 : parseInt(elem.Total_Images).toLocaleString()}</td>
                        <td></td>
                      </tr>
                    );
                    //   }
                    return null;
                  })}

                <tr style={{ color: "black" }}>
                  <td colspan="2">
                    <strong>Total</strong>
                  </td>

                  <td>
                    <strong>{isNaN(parseInt(columnSums.prevFilesSum)) ? 0 : parseInt(columnSums.prevFilesSum).toLocaleString()}</strong>
                  </td>
                  <td>
                    <strong>{isNaN(parseInt(columnSums.prevImagesSum)) ? 0 : parseInt(columnSums.prevImagesSum).toLocaleString()}</strong>
                  </td>
                  <td>
                    <strong>{isNaN(parseInt(columnSums.yesFilesSum)) ? 0 : parseInt(columnSums.yesFilesSum).toLocaleString()}</strong>
                  </td>
                  <td>
                    <strong>{isNaN(parseInt(columnSums.yesImagesSum)) ? 0 : parseInt(columnSums.yesImagesSum).toLocaleString()}</strong>
                  </td>
                  <td>
                    <strong>{isNaN(parseInt(columnSums.todayFilesSum)) ? 0 : parseInt(columnSums.todayFilesSum).toLocaleString()}</strong>
                  </td>
                  <td>
                    <strong>{isNaN(parseInt(columnSums.todayImagesSum)) ? 0 : parseInt(columnSums.todayImagesSum).toLocaleString()}</strong>
                  </td>
                  <td>
                    <strong>{isNaN(parseInt(columnSums.totalFilesSum)) ? 0 : parseInt(columnSums.totalFilesSum).toLocaleString()}</strong>
                  </td>
                  <td>
                    <strong>{isNaN(parseInt(columnSums.totalImagesSum)) ? 0 : parseInt(columnSums.totalImagesSum).toLocaleString()}</strong>
                  </td>
                  <td></td>
                </tr>
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LocationWiseDashboard