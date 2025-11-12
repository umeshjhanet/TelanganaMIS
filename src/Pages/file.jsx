import React, { useState, useEffect, useRef } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { API_URL } from "../Api";
import axios from "axios";
import moment from "moment/moment";
import SearchBar from "../Components/SearchBar";

const File = ({ showSideBar }) => {
  const [showLocation, setShowLocation] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedSearchLocations, setSelectedSearchLocations] = useState([]);
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [error, setError] = useState();
  const [locationSearchInput, setLocationSearchInput] = useState();

  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        let apiUrl = `${API_URL}/locations`;
        setIsLoading(true);
        const response = await axios.post(apiUrl);

        // Extract LocationName and filter out "Banglore High Court Addon"
        const locationNames = response.data
          .map((item) => item.LocationName)
          .filter((name) => name !== "Banglore High Court Addon");

        setLocations(locationNames);
        setIsLoading(false);
        //updateTotalLocations(locationNames);
      } catch (error) {
        console.error("Error fetching locations:", error);
        setError("Error fetching locations. Please try again.");
        setIsLoading(false);
      }
    };

    const fetchTableData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post(`${API_URL}/api/uploadlog`);
        setTableData(response.data);
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    };

    fetchLocation();
    fetchTableData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLocation(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLocation = (locationName) => {
    if (!selectedLocations.includes(locationName)) {
      setSelectedLocations([...selectedLocations, locationName]);
      setSearchInput("");
    }
    setLocationSearchInput("");
    setShowLocation(false);
    setHighlightedIndex(-1);
  };
  const removeLocation = (locationName) => {
    setSelectedLocations(
      selectedLocations.filter((loc) => loc !== locationName)
    );
  };


  const handleSearchClick = () => {
    setSelectedSearchLocations([...selectedLocations]);
  };

  const handleRefreshClick = () => {
    setSelectedSearchLocations([]);
    setSelectedLocations([]);
    setSearchInput("");
    setFilteredLocations(locations);
    setHighlightedIndex(-1);
  };

  return (
    <>
      {isLoading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
      <div className="container-fluid">
        <div className={`container-fluid mb-5 ${isLoading ? "blur" : ""}`}>
          <div className="row">
            <div
              className={`${showSideBar ? "col-lg-1 col-md-0" : "col-lg-2 col-md-0"
                } d-none d-lg-block`}
            ></div>
            <div
              className={`${showSideBar ? "col-lg-11 col-md-12" : "col-lg-10 col-md-12 "
                } col-sm-12 col-12`}
            >
              <div className="row mt-4 me-1">
                <div
                  className="card"
                  style={{ padding: "5px", backgroundColor: "#4BC0C0" }}
                >
                  <h6 className="" style={{ color: "white" }}>
                    MIS Report/Last Upload File
                  </h6>
                </div>
              </div>
              <div className="row mt-2 me-1 search-file-card">
                <div className="col-md-4 col-sm-12">
                  <SearchBar
                    items={locations}
                    selectedItems={selectedLocations}
                    onChange={newSelected => setSelectedLocations(newSelected)}
                    placeholder="Search locations..."
                    showSelectAll={true}
                  />
                </div>

                <div className="col-md-2 col-sm-12">
                  <button className="btn search-btn" onClick={handleSearchClick}>
                    Search
                  </button>
                </div>
                <div className="col-md-2 col-sm-12">
                  <button
                    className="btn search-btn"
                    style={{ marginLeft: "2px" }}
                    onClick={handleRefreshClick}
                  >
                    Refresh
                  </button>
                </div>
                <table className="table-bordered table-hover user-tables mt-3">
                  <thead style={{ backgroundColor: "#4BC0C0", color: "white" }}>
                    <tr>
                      <th style={{ fontWeight: "500" }}>Sr.No.</th>
                      <th style={{ fontWeight: "500" }}>Location Name</th>
                      <th style={{ fontWeight: "500" }}>File Date</th>
                      <th style={{ fontWeight: "500" }}>Upload Date Time</th>
                      <th style={{ fontWeight: "500" }}>App Version</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData &&
                      tableData.map((elem, index) => {
                        if (
                          selectedSearchLocations.length === 0 ||
                          selectedSearchLocations.includes(elem.locationname)
                        ) {
                          return (
                            <tr key={index}>
                              <td style={{ textAlign: "left" }}>{index + 1}</td>
                              <td style={{ textAlign: "left" }}>
                                {elem.locationname}
                              </td>
                              <td style={{ textAlign: "left" }}>
                                {moment(elem.filedate, "YYYY-MM-DD").format(
                                  "DD-MM-YYYY"
                                )}
                              </td>
                              <td style={{ textAlign: "left" }}>
                                {moment(
                                  elem.uploaddate,
                                  "YYYY-MM-DD HH:mm:ss"
                                ).format("DD-MM-YYYY HH:mm:ss")}
                              </td>
                              <td style={{ textAlign: "left" }}>
                                {elem.appVersion}
                              </td>
                            </tr>
                          );
                        }
                        return null;
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default File;
