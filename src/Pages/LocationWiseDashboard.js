import React, { useEffect, useState } from "react";
import { CCard, CCardBody } from "@coreui/react";
import axios from "axios";
import { format, sub } from "date-fns";
import { API_URL } from "../Api";
import Chart from "react-apexcharts";
import { Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";
import SearchBar from "../Components/SearchBar";
import SearchButton from "../Components/Button";
import BarGraph from "../Components/BarGraph";
import DonutGraph from "../Components/DonutGraph";

const LocationWiseDashboard = ({ showSideBar }) => {
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
        label: "Images",
        backgroundColor: "#66b3ff",
        data: [],
      },
    ],
  });
  const [allLocationImage, setAllLocationImage] = useState({
    labels: [],
    datasets: [
      {
        label: "Images",
        backgroundColor: "#f87979",
        data: [],
      },
    ],
  });
  const [monthImage, setMonthImage] = useState({
    labels: [],
    datasets: [
      {
        label: "Images",
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
          params: { locationNames: locationNames }
        })
        .then((response) => {
          const apiData = response.data;
          const labels = apiData.map((item) => item["scandate"]);
          const data = apiData.map((item) => item["Scanned No Of Images"]);
          setMonthImage({
            labels: labels.filter((label) => label !== "id"),
            datasets: [
              {
                ...monthImage.datasets[0],
                data: data,
              },
            ],
          });
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

          const labels = apiData.map(item => item["Location Name"]);
          const data = apiData.map(item => parseInt(item["Images"], 10)); // Convert images to integer

          setAllLocationYesImage({
            labels: labels,
            datasets: [{
              label: "Images",
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

          const labels = apiData.map(item => item["Location Name"]);
          const data = apiData.map(item => parseInt(item["Images"], 10)); // Convert images to integer

          setAllLocationImage({
            labels: labels,
            datasets: [{
              label: "Images",
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
      prevFilesSum += parseInt(elem.Prev_Files) || 0;
      prevImagesSum += parseInt(elem.Prev_Images) || 0;
      yesFilesSum += parseInt(elem.Yes_Files) || 0;
      yesImagesSum += parseInt(elem.Yes_Images) || 0;
      todayFilesSum += parseInt(elem.Today_Files) || 0;
      todayImagesSum += parseInt(elem.Today_Images) || 0;
      totalFilesSum += parseInt(elem.Total_Files) || 0;
      totalImagesSum += parseInt(elem.Total_Images) || 0;
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



  return (
    <div className="container-fluid">
      <div className="row">
        <div className={`${showSideBar ? 'col-lg-1 col-md-0' : 'col-lg-2 col-md-0'} d-none d-lg-block`}></div>
        <div className={`${showSideBar ? 'col-lg-11 col-md-12' : 'col-lg-10 col-md-12 '} col-sm-12`}>
          <div className="row mt-2">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h4> Telangana Dashboard</h4>
              <p style={{ fontSize: "12px", color: 'maroon', textAlign: "right" }}>
                Last Active Login: {userLog ? userLog.last_active_login : "Guest"}
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <BarGraph
                Heading={`SCANNED REPORT FOR (${formattedYesterdayDate})`}
                subTitle="All Location: Images"
                barFile={allLocationYesImage}
                color={["#088395"]}
                bar="bar"
                height={350}

              />
            </div>
            <div className="col-md-6 col-sm-12">
              <BarGraph
                Heading="Cumulative Scanned Till Date"
                subTitle="All Location: Images"
                barFile={allLocationImage}
                color={["#088395"]}
                bar="bar"
                height={350}
              />
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-12 col-sm-12">
              <BarGraph
                Heading="SCANNED REPORT OF LAST 30 DAYS"
                barFile={monthImage}
                color={["#4BC0C0"]}
                bar="bar"
                height={390}
              />
            </div>
          </div>


          <div
            className="row mt-5 ms-2 me-2"
            style={{ overflowX: "auto" }}
          >
            <table className="table table-hover table-bordered table-responsive data-table">
              <thead style={{ color: "#4BC0C0" }}>
                <tr>
                  <th rowSpan="2" style={{ verticalAlign: 'middle' }}>Sr. No.</th>
                  <th rowSpan="2" style={{ verticalAlign: 'middle' }}>Location</th>
                  <th colSpan="2">Scanned ({formattedPreviousDate})</th>
                  <th colSpan="2">
                    Scanned ({formattedYesterdayDate})
                  </th>
                  <th colSpan="2">Scanned ({formattedCurrentDate})</th>
                  <th colSpan="2">Cumulative till date</th>

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
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td style={{ textAlign: 'left' }}>{elem.LocationName}</td>
                        <td>{isNaN(parseInt(elem.Prev_Files)) ? 0 : parseInt(elem.Prev_Files).toLocaleString()}</td>
                        <td>{isNaN(parseInt(elem.Prev_Images)) ? 0 : parseInt(elem.Prev_Images).toLocaleString()}</td>
                        <td>{isNaN(parseInt(elem.Yes_Files)) ? 0 : parseInt(elem.Yes_Files).toLocaleString()}</td>
                        <td>{isNaN(parseInt(elem.Yes_Images)) ? 0 : parseInt(elem.Yes_Images).toLocaleString()}</td>
                        <td>{isNaN(parseInt(elem.Today_Files)) ? 0 : parseInt(elem.Today_Files).toLocaleString()}</td>
                        <td>{isNaN(parseInt(elem.Today_Images)) ? 0 : parseInt(elem.Today_Images).toLocaleString()}</td>
                        <td>{isNaN(parseInt(elem.Total_Files)) ? 0 : parseInt(elem.Total_Files).toLocaleString()}</td>
                        <td>{isNaN(parseInt(elem.Total_Images)) ? 0 : parseInt(elem.Total_Images).toLocaleString()}</td>

                      </tr>
                    );
                    //   }
                    return null;
                  })}

                <tr style={{ color: "black" }}>
                  <td colSpan="2">
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

                </tr>
              </tbody>

            </table>
          </div>
        </div>
        <div className="col-md-2"></div>
      </div>
    </div>
  );
};

export default LocationWiseDashboard;
