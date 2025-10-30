import React, { useEffect, useState, useRef } from 'react'
import Header from '../Components/Header'
import { MdFileDownload } from 'react-icons/md'
import axios from 'axios';
import { API_URL } from '../Api';
import DatePicker from "react-datepicker";
import { format, sub } from "date-fns";
import Papa from "papaparse";
import SearchBar from '../Components/SearchBar';

const CumulativeReport = ({ showSideBar }) => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const currentDate = new Date();
    const yesterdayDate = sub(currentDate, { days: 1 });
    const previousDate = sub(currentDate, { days: 2 });
    const formattedCurrentDate = format(currentDate, "dd-MM-yyyy");
    const formattedYesterdayDate = format(yesterdayDate, "dd-MM-yyyy");
    const formattedPreviousDate = format(previousDate, "dd-MM-yyyy");
    const [cumulative, setCumulative] = useState([]);
    const [detailedReport, setDetailedReport] = useState([]);
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [selectedProcesses, setSelectedProcesses] = useState([]);
    const [showLocation, setShowLocation] = useState(false);
    const [showProcess, setShowProcess] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [target, setTarget] = useState();
    const [showTable, setShowTable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const dropdownRef = useRef(null);
    const [locations, setLocations] = useState();
    const [error, setError] = useState();
    const [processes, setProcesses] = useState([]);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowLocation(false);
            }
        };

    document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [dropdownRef]);
    const fetchLocation = async () => {
        try {
            let apiUrl = `${API_URL}/locations`;
            setIsLoading(true);
            const response = await axios.get(apiUrl);

            // Extract just the LocationName values
            const locationNames = response.data.map(item => item.LocationName);

            setLocations(locationNames);
            setIsLoading(false);

        } catch (error) {
            console.error("Error fetching locations:", error);
            setError("Error fetching locations. Please try again.");
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchLocation();
    }, [])

    const fetchCumulative = async () => {
        try {
            const params = {};
            if (selectedDate) {
                params.date = selectedDate;
            }
            const response = await axios.get(`${API_URL}/manpowerData`, { params });
            const result = response.data.result;

            setCumulative(result);

            // Extract and set processes separately
            const processNames = result.map(item => item.process);
            setProcesses(processNames);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
   
    const fetchDetailed = async (params = {}) => {
        try {

            const response = await axios.get(`${API_URL}/api/daily-summary`, { params });
            setDetailedReport(response.data);
        } catch (error) {
            console.error("Error fetching detailed report", error);
        }
    };
    useEffect(() => {
        const fetchTarget = async () => {
            try {
                const response = await axios.get(`${API_URL}/mptarget`);
                setTarget(response.data);
            } catch {
                console.error("Error fetching target data");
            }
        };
        const fetchData = async () => {
            setIsLoading(true);  // ✅ Set loading before fetching
            await Promise.all([fetchCumulative(), fetchTarget()]); // ✅ Wait for both requests
            setIsLoading(false); // ✅ Only set false after both complete
        };
        fetchData();
        fetchDetailed();
    }, []);
    const handleTable = () => {
        setShowTable(!showTable);
    }
    const Loader = () => (
        <div className="loader-overlay">
            <div className="loader"></div>
        </div>
    );
    const handleDateChange = (date) => {
        if (date) {
            // Format to YYYY-MM-DD (removing time)
            const formattedDate = format(date, "yyyy-MM-dd");
            setSelectedDate(formattedDate); // Store as a string to avoid timezone issues
        }
    };
    const handleDateFilter = async () => {
        if (!selectedDate) {
            alert("Please select a date");
            return;
        }

    setIsLoading(true);
    try {
      await fetchCumulative(); // assuming this returns a Promise
      await fetchDetailed({ date: selectedDate });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const exportToCSV = () => {
    const headers = [
      "Process Steps",
      "Manpower",
      "Files",
      "Images",
      "Manpower Target",
      "Average",
      "Differences B/W Target & Achieved",
    ];

    const data = [];

    if (Array.isArray(cumulative)) {
      cumulative.forEach((elem) => {
        const process = elem.process;
        const present = parseFloat(elem.Present) || 0;
        const files = parseFloat(elem.files) || 0;
        const images = parseFloat(elem.images) || 0;

        const targetObj = target.find((t) => t.process_name === process);
        const targetValue = targetObj ? parseFloat(targetObj.target) : "-";

        // Calculate average
        let average = "-";
        if (present > 0) {
          average =
            images > 0
              ? (images / present).toFixed(2)
              : (files / present).toFixed(2);
        }

        // Calculate difference
        let difference = "-";
        if (targetValue !== "-" && average !== "-") {
          const diff = (parseFloat(average) / parseFloat(targetValue)) * 100;
          difference = isNaN(diff) ? "-" : `${diff.toFixed(2)}%`;
        }

        data.push([
          process,
          present || 0,
          files || 0,
          images || 0,
          targetValue !== "-" ? targetValue : "-",
          average !== "-" ? average : "-",
          difference,
        ]);
      });

      // Total Row
      const totalManpower = cumulative.reduce(
        (sum, elem) => sum + (parseFloat(elem.Present) || 0),
        0
      );
      const totalFiles = cumulative.reduce(
        (sum, elem) => sum + (parseFloat(elem.files) || 0),
        0
      );
      const totalImages = cumulative.reduce(
        (sum, elem) => sum + (parseFloat(elem.images) || 0),
        0
      );
      const totalTarget = cumulative.reduce((sum, elem) => {
        const t = target.find((x) => x.process_name === elem.process);
        return sum + (t ? parseFloat(t.target) || 0 : 0);
      }, 0);

      data.push([
        "Total",
        totalManpower,
        totalFiles,
        totalImages,
        totalTarget || "-",
        "-",
        "-",
      ]);
    }

    // 🔹 Convert to CSV and trigger download
    const csvData = Papa.unparse([headers, ...data]);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "table_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ✅ Function to calculate total manpower
  const getTotalManpower = () => {
    return cumulative?.manpowerData
      ? Object.values(cumulative.manpowerData).reduce(
          (sum, val) => sum + (parseInt(val) || 0),
          0
        )
      : "-";
  };
  // ✅ Function to calculate total files
  const getTotalFiles = () => {
    const scannedFiles = cumulative?.scannedData
      ? [
          cumulative.scannedData.total_inventoryfiles,
          cumulative.scannedData.total_scanfiles,
          cumulative.scannedData.total_qcfiles,
          cumulative.scannedData.total_flaggingfiles,
          cumulative.scannedData.total_indexfiles,
          cumulative.scannedData.total_cbslqafiles,
        ]
      : [];

    const barcodingFiles = cumulative?.barcodingData
      ? [
          cumulative.barcodingData.total_barcodingfiles,
          cumulative.barcodingData.preparefiles,
          cumulative.barcodingData.refillingfiles,
          cumulative.barcodingData.invoutfiles,
        ]
      : [];

    return (
      [...scannedFiles, ...barcodingFiles].reduce(
        (sum, val) => sum + (parseInt(val) || 0),
        0
      ) || "-"
    );
  };
  // ✅ Function to calculate total images
  const getTotalImages = () => {
    const scannedImages = cumulative?.scannedData
      ? [
          cumulative.scannedData.total_scanimages,
          cumulative.scannedData.total_qcimages,
          cumulative.scannedData.total_flaggingimages,
          cumulative.scannedData.total_indeximages,
          cumulative.scannedData.total_cbslqaimages,
        ]
      : [];

    const barcodingImages = cumulative?.barcodingData
      ? [
          cumulative.barcodingData.prepareimages,
          cumulative.barcodingData.refillingimages,
        ]
      : [];

    return (
      [...scannedImages, ...barcodingImages].reduce(
        (sum, val) => sum + (parseInt(val) || 0),
        0
      ) || "-"
    );
  };
  const processOptions = [
    "Inventory",
    "Scanning",
    "QC",
    "Flagging",
    "Indexing",
    "CBSL QA",
    "Support Personnel",
    "Unidentified",
  ];
  const processStructure = {
    Inventory: [
      "MP",
      "Files",
      "Images",
      "Manpower Target",
      "Average",
      "Difference %",
    ],
    Scanning: [
      "MP",
      "Files",
      "Images",
      "Manpower Target",
      "Average",
      "Difference %",
    ],
    QC: ["MP", "Files", "Images", "Manpower Target", "Average", "Difference %"],
    Flagging: [
      "MP",
      "Files",
      "Images",
      "Manpower Target",
      "Average",
      "Difference %",
    ],
    Indexing: [
      "MP",
      "Files",
      "Images",
      "Manpower Target",
      "Average",
      "Difference %",
    ],
    CBSL_QA: [
      "MP",
      "Files",
      "Images",
      "Manpower Target",
      "Average",
      "Difference %",
    ],
    SupportPersonnel: [
      "MP",
      "Files",
      "Images",
      "Manpower Target",
      "Average",
      "Difference %",
    ],
    Unidentified: [
      "MP",
      "Files",
      "Images",
      "Manpower Target",
      "Average",
      "Difference %",
    ],
  };
  const allProcesses = Object.keys(processStructure);
  const processesToRender =
    selectedProcesses.length === 0 ? allProcesses : selectedProcesses;
  const processConfig = {
    Inventory: {
      present: "Inventory_Present",
      files: "Inventory_Files",
      images: null,
      target: 200,
    },
    Scanning: {
      present: "Scanning_Present",
      files: "Scanning_Files",
      images: "Scanning_Images",
      target: 10500,
    },
    QC: {
      present: "QC_Present",
      files: "QC_Files",
      images: "QC_Images",
      target: 9000,
    },
    Flagging: {
      present: "Flagging_Present",
      files: "Flagging_Files",
      images: "Flagging_Images",
      target: 8000,
    },
    Indexing: {
      present: "Indexing_Present",
      files: "Indexing_Files",
      images: "Indexing_Images",
      target: 7000,
    },
    CBSL_QA: {
      present: "CBSLQA_Present",
      files: "CBSLQA_Files",
      images: "CBSLQA_Images",
      target: 15000,
    },
    SupportPersonnel: {
      present: "SupportPersonnel_Present",
      files: null,
      images: null,
      target: null,
    },
    Unidentified: {
      present: "Unidentified_Present",
      files: null,
      images: null,
      target: null,
    },
  };
  const exportLocationToCSV = () => {
    if (!Array.isArray(detailedReport) || detailedReport.length === 0) {
      alert("No data available to export.");
      return;
    }

    const headers = [
      "Sr.No",
      "Location",
      "Inv MP",
      "Inv Files",
      "-",
      "Target",
      "Average",
      "Differences B/W Target & Average",
      "Scan MP",
      "Scan Files",
      "Scan Images",
      "Target",
      "Average",
      "Differences B/W Target & Achieved",
      "QC MP",
      "QC Files",
      "QC Images",
      "Target",
      "Achieved",
      "Differences B/W Target & Achieved",
      "Flag MP",
      "Flag Files",
      "Flag Images",
      "Target",
      "Achieved",
      "Differences B/W Target & Achieved",
      "Index MP",
      "Index Files",
      "Index Images",
      "Target",
      "Achieved",
      "Differences B/W Target & Achieved",
      "CBSLQA MP",
      "CBSLQA Files",
      "CBSLQA Images",
      "Target",
      "Achieved",
      "Differences B/W Target & Achieved",
      "Support Personnel MP",
      "-",
      "-",
      "-",
      "-",
      "-",
      "Unidentified MP",
      "-",
      "-",
      "-",
      "-",
      "-",
    ];

    const standardValues = {
      Inventory: 200,
      Scanning: 10500,
      QC: 9000,
      Flagging: 8000,
      Indexing: 7000,
      CBSLQA: 15000,
    };

    let csvRows = [];
    csvRows.push(headers.join(","));

    // Totals
    let totals = {
      Inventory_Present: 0,
      Inventory_Files: 0,
      Scanning_Present: 0,
      Scanning_Files: 0,
      Scanning_Images: 0,
      QC_Present: 0,
      QC_Files: 0,
      QC_Images: 0,
      Flagging_Present: 0,
      Flagging_Files: 0,
      Flagging_Images: 0,
      Indexing_Present: 0,
      Indexing_Files: 0,
      Indexing_Images: 0,
      CBSLQA_Present: 0,
      CBSLQA_Files: 0,
      CBSLQA_Images: 0,
      SupportPersonnel_Present: 0,
      Unidentified_Present: 0,
    };

    detailedReport.forEach((elem, index) => {
      // Update totals
      Object.keys(totals).forEach((key) => {
        totals[key] += Number(elem[key] || 0);
      });

      const row = [
        index + 1,
        elem.locationname,
        elem.Inventory_Present,
        elem.Inventory_Files,
        "-",
        standardValues.Inventory,
        elem.Inventory_Present
          ? (elem.Inventory_Files / elem.Inventory_Present).toFixed(2)
          : "-",
        elem.Inventory_Present
          ? (
              (elem.Inventory_Files /
                elem.Inventory_Present /
                standardValues.Inventory) *
              100
            ).toFixed(2)
          : "-",

        elem.Scanning_Present,
        elem.Scanning_Files,
        elem.Scanning_Images,
        standardValues.Scanning,
        elem.Scanning_Present
          ? (elem.Scanning_Images / elem.Scanning_Present).toFixed(2)
          : "-",
        elem.Scanning_Present
          ? (
              (elem.Scanning_Images /
                elem.Scanning_Present /
                standardValues.Scanning) *
              100
            ).toFixed(2)
          : "-",

        elem.QC_Present,
        elem.QC_Files,
        elem.QC_Images,
        standardValues.QC,
        elem.QC_Present ? (elem.QC_Images / elem.QC_Present).toFixed(2) : "-",
        elem.QC_Present
          ? (
              (elem.QC_Images / elem.QC_Present / standardValues.QC) *
              100
            ).toFixed(2)
          : "-",

        elem.Flagging_Present,
        elem.Flagging_Files,
        elem.Flagging_Images,
        standardValues.Flagging,
        elem.Flagging_Present
          ? (elem.Flagging_Images / elem.Flagging_Present).toFixed(2)
          : "-",
        elem.Flagging_Present
          ? (
              (elem.Flagging_Images /
                elem.Flagging_Present /
                standardValues.Flagging) *
              100
            ).toFixed(2)
          : "-",

        elem.Indexing_Present,
        elem.Indexing_Files,
        elem.Indexing_Images,
        standardValues.Indexing,
        elem.Indexing_Present
          ? (elem.Indexing_Images / elem.Indexing_Present).toFixed(2)
          : "-",
        elem.Indexing_Present
          ? (
              (elem.Indexing_Images /
                elem.Indexing_Present /
                standardValues.Indexing) *
              100
            ).toFixed(2)
          : "-",

        elem.CBSLQA_Present,
        elem.CBSLQA_Files,
        elem.CBSLQA_Images,
        standardValues.CBSLQA,
        elem.CBSLQA_Present
          ? (elem.CBSLQA_Images / elem.CBSLQA_Present).toFixed(2)
          : "-",
        elem.CBSLQA_Present
          ? (
              (elem.CBSLQA_Images /
                elem.CBSLQA_Present /
                standardValues.CBSLQA) *
              100
            ).toFixed(2)
          : "-",

        elem.SupportPersonnel_Present,
        "-",
        "-",
        "-",
        "-",
        "-",
        elem.Unidentified_Present,
        "-",
        "-",
        "-",
        "-",
        "-",
      ];

      csvRows.push(row.join(","));
    });

    // Add Total row
    const totalRow = [
      "Total",
      "-",
      totals.Inventory_Present,
      totals.Inventory_Files,
      "-",
      standardValues.Inventory,
      totals.Inventory_Present
        ? (totals.Inventory_Files / totals.Inventory_Present).toFixed(2)
        : "-",
      totals.Inventory_Present
        ? (
            (totals.Inventory_Files /
              totals.Inventory_Present /
              standardValues.Inventory) *
            100
          ).toFixed(2)
        : "-",

      totals.Scanning_Present,
      totals.Scanning_Files,
      totals.Scanning_Images,
      standardValues.Scanning,
      totals.Scanning_Present
        ? (totals.Scanning_Images / totals.Scanning_Present).toFixed(2)
        : "-",
      totals.Scanning_Present
        ? (
            (totals.Scanning_Images /
              totals.Scanning_Present /
              standardValues.Scanning) *
            100
          ).toFixed(2)
        : "-",

      totals.QC_Present,
      totals.QC_Files,
      totals.QC_Images,
      standardValues.QC,
      totals.QC_Present
        ? (totals.QC_Images / totals.QC_Present).toFixed(2)
        : "-",
      totals.QC_Present
        ? (
            (totals.QC_Images / totals.QC_Present / standardValues.QC) *
            100
          ).toFixed(2)
        : "-",

      totals.Flagging_Present,
      totals.Flagging_Files,
      totals.Flagging_Images,
      standardValues.Flagging,
      totals.Flagging_Present
        ? (totals.Flagging_Images / totals.Flagging_Present).toFixed(2)
        : "-",
      totals.Flagging_Present
        ? (
            (totals.Flagging_Images /
              totals.Flagging_Present /
              standardValues.Flagging) *
            100
          ).toFixed(2)
        : "-",

      totals.Indexing_Present,
      totals.Indexing_Files,
      totals.Indexing_Images,
      standardValues.Indexing,
      totals.Indexing_Present
        ? (totals.Indexing_Images / totals.Indexing_Present).toFixed(2)
        : "-",
      totals.Indexing_Present
        ? (
            (totals.Indexing_Images /
              totals.Indexing_Present /
              standardValues.Indexing) *
            100
          ).toFixed(2)
        : "-",

      totals.CBSLQA_Present,
      totals.CBSLQA_Files,
      totals.CBSLQA_Images,
      standardValues.CBSLQA,
      totals.CBSLQA_Present
        ? (totals.CBSLQA_Images / totals.CBSLQA_Present).toFixed(2)
        : "-",
      totals.CBSLQA_Present
        ? (
            (totals.CBSLQA_Images /
              totals.CBSLQA_Present /
              standardValues.CBSLQA) *
            100
          ).toFixed(2)
        : "-",

      totals.SupportPersonnel_Present,
      "-",
      "-",
      "-",
      "-",
      "-",
      totals.Unidentified_Present,
      "-",
      "-",
      "-",
      "-",
      "-",
    ];
    csvRows.push(totalRow.join(","));

        // Create CSV and trigger download
        const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "Detailed_report.csv");
        document.body.appendChild(link); // Required for Firefox
        link.click();
        document.body.removeChild(link);
    };
    const handleLocation = (locationName) => {
        if (!selectedLocations.includes(locationName)) {
            setSelectedLocations([...selectedLocations, locationName]);
            setSearchInput("");
        }
        setShowLocation(false); // Close the dropdown when a location is selected
    };
    const removeLocation = (locationName) => {
        setSelectedLocations(
            selectedLocations.filter((loc) => loc !== locationName)
        );
    };
    const handleLocationFilter = async () => {
        setIsLoading(true);
        try {
            if (selectedLocations.length > 0 || selectedProcesses.length > 0) {
                await fetchDetailed({
                    date: selectedDate,
                    locations: selectedLocations.length > 0 ? selectedLocations.join(",") : undefined,
                    processes: selectedProcesses.length > 0 ? selectedProcesses.join(",") : undefined,
                });
            } else {

                await fetchDetailed();
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };
    const handleProcess = (processName) => {
        if (!selectedProcesses.includes(processName)) {
            setSelectedProcesses([...selectedProcesses, processName]);
        }
        setShowProcess(false);
    };
    const removeProcess = (processName) => {
        setSelectedProcesses(selectedProcesses.filter(p => p !== processName));
    };
    return (
        <>
            {isLoading && <Loader />}

            <div className={`container-fluid`}>
                <div className="row">
                    <div className={`${showSideBar ? 'col-lg-1 col-md-0' : 'col-lg-2 col-md-0'} d-none d-lg-block`}></div>
                    <div className={`${showSideBar ? 'col-lg-11 col-md-12' : 'col-lg-10 col-md-12 '} col-sm-12`}>
                        <div className="row mt-3 me-1">
                            <div className="table-card">
                                <div className='row search-report-card'>
                                    <div className="col-2">
                                        <DatePicker
                                            className="date-field"
                                            selected={selectedDate}
                                            onChange={handleDateChange}
                                            dateFormat="dd-MM-yyyy"
                                            placeholderText="Select Date"
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            popperProps={{
                                                modifiers: [
                                                    {
                                                        name: "preventOverflow",
                                                        options: {
                                                            rootBoundary: "viewport",
                                                            tether: false,
                                                            altAxis: true,
                                                        },
                                                    },
                                                ],
                                            }}
                                            popperClassName="compact-picker"
                                        />
                                    </div>
                                    <div className="col-3 mt-1">
                                        <button className="btn add-btn" style={{ marginTop: '-5px' }} onClick={handleDateFilter}>Submit</button>
                                    </div>
                                </div>
                                <div className='row '>
                                    <div className='col-md-8 d-md-block d-none col-11'>
                                        <h5 className="mt-2">
                                            Telangana - Process & Manpower Detailed Summary: <span style={{ color: '#AC1754' }}>{!selectedDate ? formattedYesterdayDate : new Date(selectedDate).toLocaleDateString('en-GB')}</span>
                                        </h5>
                                    </div>
                                    <div className='col-md-2 col-5'>
                                        <button className='btn add-btn p-2 w-100' style={{ marginLeft: '0px', fontSize: '12px', backgroundColor: "#4bc0c0", color: "#000" }} onClick={handleTable}>{showTable ? 'Hide Detailed Report' : 'Show Detailed Report'}</button>
                                    </div>
                                    <div className='col-md-2 col-5'>
                                        <button className='p-2 btn add-btn w-100' onClick={exportToCSV} style={{ marginLeft: '0px', fontSize: '12px', backgroundColor: "#4bc0c0", color: "#000", border: "0px" }}><MdFileDownload /> Export CSV</button>
                                    </div>
                                    <div className='col-md-8 d-md-none d-block col-12'>
                                        <h5 className="mt-2">
                                            Telangana - Process & Manpower Detailed Summary: <span style={{ color: '#AC1754' }}>{!selectedDate ? formattedYesterdayDate : new Date(selectedDate).toLocaleDateString('en-GB')}</span>
                                        </h5>
                                    </div>
                                </div>
                                <div
                                    className="row mt-3 ms-2 me-2"
                                    style={{ overflowX: "auto", maxHeight: '500px' }}
                                >
                                    <table className="table table-hover table-bordered table-responsive date-table" style={{ zIndex: '0' }}>
                                        <thead style={{ backgroundColor: '#FF8989' }}>
                                            <tr>
                                                <th>Process Steps</th>
                                                <th>MP</th>
                                                <th>Files</th>
                                                <th>Images</th>
                                                <th>Manpower Target</th>
                                                <th>Average</th>
                                                <th>Differences B/W Target & Achieved</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(cumulative) && cumulative.map((elem, index) => {
                                                const targetObj = target.find(t => t.process_name === elem.process);
                                                const targetValue = targetObj ? parseFloat(targetObj.target) : 0;

                          const files = parseFloat(elem.files) || 0;
                          const images = parseFloat(elem.images) || 0;
                          const present = parseFloat(elem.Present) || 0;

                          const average =
                            present > 0
                              ? images > 0
                                ? images / present
                                : files / present
                              : 0;

                          const difference =
                            targetValue > 0 && average > 0
                              ? (average / targetValue) * 100
                              : "-";

                          // Color coding style logic
                          let differenceStyle = {};
                          if (difference !== "-") {
                            const diffValue = parseFloat(difference);
                            if (diffValue <= 90)
                              differenceStyle = {
                                backgroundColor: "red",
                                color: "white",
                              };
                            else if (diffValue > 90 && diffValue < 99) {
                              differenceStyle = { backgroundColor: "yellow" };
                            } else if (diffValue >= 100)
                              differenceStyle = {
                                backgroundColor: "green",
                                color: "white",
                              };
                          }

                                                return (
                                                    <tr key={index}>
                                                        <td style={{ textAlign: "left" }}>{elem.process}</td>
                                                        <td>{present}</td>
                                                        <td>{files}</td>
                                                        <td>{images}</td>
                                                        <td>{targetValue || "-"}</td>
                                                        <td>{average ? average.toFixed(2) : "-"}</td>
                                                        <td style={differenceStyle}>
                                                            {difference !== "-" ? `${difference.toFixed(2)}%` : "-"}
                                                        </td>
                                                    </tr>
                                                );
                                            })}

                                            {/* Total Row */}
                                            <tr style={{ backgroundColor: "#f2f2f2", fontWeight: "bold" }}>
                                                <td>Total</td>
                                                <td>
                                                    {cumulative.reduce((sum, elem) => sum + (parseFloat(elem.Present) || 0), 0)}
                                                </td>
                                                <td>
                                                    {cumulative.reduce((sum, elem) => sum + (parseFloat(elem.files) || 0), 0)}
                                                </td>
                                                <td>
                                                    {cumulative.reduce((sum, elem) => sum + (parseFloat(elem.images) || 0), 0)}
                                                </td>
                                                <td>
                                                    {
                                                        cumulative.reduce((sum, elem) => {
                                                            const t = target.find(x => x.process_name === elem.process);
                                                            return sum + (t ? parseFloat(t.target) || 0 : 0);
                                                        }, 0)
                                                    }
                                                </td>
                                                <td>-</td>
                                                <td>-</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {showTable && (
                                <div className="row  me-1">
                                    <div className="table-card" style={{ marginBottom: '0px' }}>
                                        <div className='row ms-1 mt-1'>
                                            <div className='col-10'>
                                                <h5 className="mt-2">
                                                    Telangana - Process & Manpower Location Wise Report: <span style={{ color: '#AC1754' }}>{!selectedDate ? formattedYesterdayDate : new Date(selectedDate).toLocaleDateString('en-GB')}</span>
                                                </h5>
                                            </div>
                                            <div className='col-2'>
                                                <button className='btn add-btn' onClick={exportLocationToCSV} style={{ marginLeft: '0px' }}><MdFileDownload /> Export CSV</button>
                                            </div>
                                        </div>
                                        <div className='row mt-3 ms-2 me-2'>
                                            <div className="col-lg-4 col-md-2 col-sm-12">

                                                <SearchBar
                                                    items={locations} // all available locations
                                                    selectedItems={selectedLocations} // current selections
                                                    onChange={(newSelected) =>
                                                        setSelectedLocations(newSelected)
                                                    } // update handler
                                                    placeholder="Search locations..."
                                                    showSelectAll={true}
                                                />
                                            </div>
                                            <div className="col-lg-4 col-md-2 col-sm-12" style={{ position: 'relative' }}>


                                                <SearchBar
                                                    items={processes} // all available locations
                                                    selectedItems={selectedProcesses} // current selections
                                                    onChange={(newSelected) =>
                                                        setSelectedProcesses(newSelected)
                                                    } // update handler
                                                    placeholder="Search processes..."
                                                    showSelectAll={true}
                                                    Name="Process"
                                                />
                                            </div>
                                            <div className='col-lg-4 col-md-2 col-sm-12'>
                                                <button className='btn add-btn' onClick={handleLocationFilter}>Submit</button>
                                            </div>
                                        </div>
                                        <div className="row mt-3 ms-2 me-2"
                                            style={{ overflowX: "auto", maxHeight: '500px' }}>
                                            <table className="table table-hover table-bordered table-responsive date-table">
                                                <thead style={{ backgroundColor: '#4bc0c0', color: 'white' }}>
                                                    <tr style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                                        <th rowSpan={3} style={{ textAlign: 'center', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>Sr. No.</th>
                                                        <th rowSpan={3} style={{ textAlign: 'center', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>Location Name</th>
                                                        <th colSpan={processesToRender.length * 6}>Processes</th>
                                                    </tr>
                                                    <tr style={{ textAlign: 'center', verticalAlign: 'middle', backgroundColor: '#4bc0c0', color: 'white' }}>
                                                        {processesToRender.map((process, index) => (
                                                            <th key={index} colSpan={6}>{process}</th>
                                                        ))}
                                                    </tr>
                                                    <tr style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                                        {processesToRender.map((process) =>
                                                            processStructure[process]?.map((subHeader, i) => (
                                                                <th key={`${process}-${i}`}>{subHeader}</th>
                                                            ))
                                                        )}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Array.isArray(detailedReport) && detailedReport.length > 0 ? (
                                                        <>
                                                            {detailedReport.map((elem, index) => (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td style={{ textAlign: 'left' }}>{elem.locationname}</td>
                                                                    {processesToRender.map((processKey, pIndex) => {
                                                                        const config = processConfig[processKey];
                                                                        if (!config) return null;

                                      const present = Number(
                                        elem?.[config.present] || 0
                                      );
                                      const files = config.files
                                        ? Number(elem?.[config.files] || 0)
                                        : "-";
                                      const images = config.images
                                        ? Number(elem?.[config.images] || 0)
                                        : "-";
                                      const target = config.target;

                                      let avg = null;
                                      if (processKey === "Inventory") {
                                        // For Inventory, average = files / present
                                        avg =
                                          files !== "-" && present !== 0
                                            ? files / present
                                            : null;
                                      } else {
                                        // For others, average = images / present
                                        avg =
                                          images !== "-" && present !== 0
                                            ? images / present
                                            : null;
                                      }

                                      const diffPercent =
                                        avg !== null && target
                                          ? (avg / target) * 100
                                          : null;

                                      // Determine color based on diffPercent
                                      let bgColor = "";
                                      if (diffPercent !== null) {
                                        if (diffPercent < 90)
                                          bgColor = "#ffcccc"; // light red
                                        else if (diffPercent < 100)
                                          bgColor = "#fff3cd"; // light yellow
                                        else bgColor = "#d4edda"; // light green
                                      }

                                      return (
                                        <React.Fragment key={pIndex}>
                                          <td
                                            style={{ backgroundColor: bgColor }}
                                          >
                                            {present || "-"}
                                          </td>
                                          <td
                                            style={{ backgroundColor: bgColor }}
                                          >
                                            {files !== "-" ? files : "-"}
                                          </td>
                                          <td
                                            style={{ backgroundColor: bgColor }}
                                          >
                                            {images !== "-" ? images : "-"}
                                          </td>
                                          <td
                                            style={{ backgroundColor: bgColor }}
                                          >
                                            {target || "-"}
                                          </td>
                                          <td
                                            style={{ backgroundColor: bgColor }}
                                          >
                                            {avg !== null
                                              ? avg.toFixed(2)
                                              : "-"}
                                          </td>
                                          <td
                                            style={{ backgroundColor: bgColor }}
                                          >
                                            {diffPercent !== null
                                              ? diffPercent.toFixed(2)
                                              : "-"}
                                          </td>
                                        </React.Fragment>
                                      );
                                    }
                                  )}
                                </tr>
                              ))}

                              {/* TOTAL ROW */}
                              <tr
                                style={{
                                  fontWeight: "bold",
                                  backgroundColor: "#f0f0f0",
                                }}
                              >
                                <td colSpan={2}>Total</td>
                                {processesToRender.map((processKey, pIndex) => {
                                  const config = processConfig[processKey];
                                  if (!config) return null;

                                  const totalPresent = detailedReport.reduce(
                                    (a, b) =>
                                      a + Number(b[config.present] || 0),
                                    0
                                  );
                                  const totalFiles = config.files
                                    ? detailedReport.reduce(
                                        (a, b) =>
                                          a + Number(b[config.files] || 0),
                                        0
                                      )
                                    : "-";
                                  const totalImages = config.images
                                    ? detailedReport.reduce(
                                        (a, b) =>
                                          a + Number(b[config.images] || 0),
                                        0
                                      )
                                    : "-";

                                  return (
                                    <React.Fragment key={pIndex}>
                                      <td>{totalPresent || "-"}</td>
                                      <td>
                                        {totalFiles !== "-" ? totalFiles : "-"}
                                      </td>
                                      <td>
                                        {totalImages !== "-"
                                          ? totalImages
                                          : "-"}
                                      </td>
                                      <td colSpan={3}></td>
                                    </React.Fragment>
                                  );
                                })}
                              </tr>
                            </>
                          ) : (
                            <tr>
                              <td colSpan="50">No data available</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CumulativeReport;
