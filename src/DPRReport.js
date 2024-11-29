import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import axios from "axios";
import { MdFileDownload } from "react-icons/md";
import { API_URL } from "./Api";
import 'jspdf-autotable';
import { saveAs } from "file-saver";
import { format, sub } from "date-fns";

const DPRReport = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [yesterdayReport, setYesterdayReport] = useState([]);
  const [targettill, setTargetTill] = useState([]);
  const [report, setReport] = useState([]);
  const currentDate = new Date();
  const yesterdayDate = sub(currentDate, { days: 1 });
  const formattedCurrentDate = format(currentDate, "dd-MM-yyyy");
  const formattedYesterdayDate = format(yesterdayDate, "dd-MM-yyyy");


  useEffect(() => {
    const fetchReportData = async () => {
      try {
        let apiUrl = `${API_URL}/dprreportTable`;
        setIsLoading(true);
        const response = await axios.get(apiUrl);
        console.log("API Response:", response.data); // Log the API response
        setReport(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching report data:", error);
        setError("Error fetching report data. Please try again.");
        setIsLoading(false);
      }
    };
    const fetchYesterdayData = async () => {
      try {
        let apiUrl = `${API_URL}/yesterdaypr`;
        setIsLoading(true);
        const response = await axios.get(apiUrl);
        console.log("API Response:", response.data); // Log the API response
        setYesterdayReport(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching report data:", error);
        setError("Error fetching report data. Please try again.");
        setIsLoading(false);
      }
    };
    const fetchTargettillData = async () => {
      try {
        let apiUrl = `${API_URL}/targettabletillnow`;
        setIsLoading(true);
        const response = await axios.get(apiUrl);
        console.log("API Response:", response.data); // Log the API response
        setTargetTill(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching report data:", error);
        setError("Error fetching report data. Please try again.");
        setIsLoading(false);
      }
    };

    fetchReportData();
    fetchYesterdayData();
    fetchTargettillData();
  }, []);

  const handleExportCSV = () => {
    if (!report || report.length === 0) {
      alert("No data to export");
      return;
    }
  
    // Define the header row
    const headers = [
      "Site Name",
      "Collection Files",
      "Collection Images",
      "Scanning Files",
      "Scanning Images",
      "Image QC Files",
      "Image QC Images",
      "Flagging Files",
      "Flagging Images",
      "Indexing Files",
      "Indexing Images",
      "CBSL QA Files",
      "CBSL QA Images",
      "Submitted For Files",
      "Submitted For Images",
      "Customer QA Files",
      "Customer QA Images",
      "DMS Uploaded Files",
      "DMS Uploaded Images",
      "Inventory Out Files",
      "Inventory Out Images",
    ];
  
    // Generate rows
    const rows = report.map((elem) => [
      elem.LocationName,
      elem.CollectionFiles || 0,
      elem.CollectionImages || 0,
      elem.ScannedFiles || 0,
      elem.ScannedImages || 0,
      elem.QCFiles || 0,
      elem.QCImages || 0,
      elem.FlaggingFiles || 0,
      elem.FlaggingImages || 0,
      elem.IndexingFiles || 0,
      elem.IndexingImages || 0,
      elem.CBSL_QAFiles || 0,
      elem.CBSL_QAImages || 0,
      elem.SubmittedForFiles || 0,
      elem.SubmittedForImages || 0,
      elem.Client_QA_AcceptedFiles || 0,
      elem.Client_QA_AcceptedImages || 0,
      elem.DMS_UploadFiles || 0,
      elem.DMS_UploadImages || 0,
      elem.InventoryOutFiles || 0,
      elem.InventoryOutImages || 0,
    ]);
  
    // Calculate the total row
    const totalRow = [
      "Total", // Label for the total row
      ...headers.slice(1).map((_, index) => {
        return rows.reduce((sum, row) => sum + (parseFloat(row[index + 1]) || 0), 0);
      }),
    ];
  
    // Convert to CSV string
    const csvContent = [headers, ...rows, totalRow]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
  
    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "Cumulative_Production_Report.csv");
  };
  const handleExportYesterdayCSV = () => {
    if (!yesterdayReport || yesterdayReport.length === 0) {
      alert("No data to export");
      return;
    }
  
    // Define the header row
    const headers = [
      "Location Name",
      "Total ManPower",
      "Scaning Target A3",
      "QC Target",
      "Post QC Target",
      "Scanner Count A3",
      "Scanner Count A4",
      "Scaning_Target_A3",
      "Collection Files",
      "Collection MP",
      "Scanning Files",
      "Scanning Images",
      "Scanning MP",
      "QC Files",
      "QC Images",
      "QC MP",
      "Flagging Files",
      "Flagging Images",
      "Flagging MP",
      "Indexing Files",
      "Indexing Images",
      "Indexing MP",
      "CBSL QA Files",
      "CBSL QA Images",
      "CBSL QA MP",
      "Ready For Customer QA Files",
      "Ready For Customer QA Images",
      "Ready For Customer QA MP",
      "Customer QA Done Files",
      "Customer QA Done Images",
      "Customer QA Done MP",
      "DMS Uploaded Files",
      "DMS Uploaded Images",
      "DMS Uploaded MP",
      "Re-Filing Binding Files",
      "Re-Filing Binding MP",
      "Inventory Out Files",
      "Inventory Out MP",
    ];
  
    // Generate rows
    const rows = yesterdayReport.map((elem) => [
      elem.LocationName,
      parseFloat(elem.TotalManPower) || 0,
      parseFloat(elem.Scaning_Target_A3) || 0,
      parseFloat(elem.QC_Target) || 0,
      parseFloat(elem.Post_QC_Target) || 0,
      parseFloat(elem.Scaning_Capacity_A3) || 0,
      parseFloat(elem.Scaning_Capacity_A4) || 0,
      parseFloat(elem.CollectionFiles) || 0,
      parseFloat(elem.Coll__Index_MP) || 0,
      parseFloat(elem.ScannedFiles) || 0,
      parseFloat(elem.ScannedImages) || 0,
      parseFloat(elem.Scanning_MP) || 0,
      parseFloat(elem.QCFiles) || 0,
      parseFloat(elem.QCImages) || 0,
      parseFloat(elem.QC_MP) || 0,
      parseFloat(elem.FlaggingFiles) || 0,
      parseFloat(elem.FlaggingImages) || 0,
      parseFloat(elem.Flagging_MP) || 0,
      parseFloat(elem.IndexingFiles) || 0,
      parseFloat(elem.IndexingImages) || 0,
      parseFloat(elem.Indexing_MP) || 0,
      parseFloat(elem.CBSL_QAFiles) || 0,
      parseFloat(elem.CBSL_QAImages) || 0,
      parseFloat(elem.CBSL_QA_MP) || 0,
      parseFloat(elem.SubmittedForFiles) || 0,
      parseFloat(elem.SubmittedForImages) || 0,
      parseFloat(elem.SubmittedFor_MP) || 0,
      parseFloat(elem.Client_QA_AcceptedFiles) || 0,
      parseFloat(elem.Client_QA_AcceptedImages) || 0,
      parseFloat(elem.Client_QA_Accepted_MP) || 0,
      parseFloat(elem.DMS_UploadFiles) || 0,
      parseFloat(elem.DMS_UploadImages) || 0,
      parseFloat(elem.DMS_Upload_MP) || 0,
      parseFloat(elem.Refilling_Files_TF) || 0,
      parseFloat(elem.Refilling_MP) || 0,
      parseFloat(elem.Inv_Out_Files) || 0,
      parseFloat(elem.InventoryOut_MP) || 0,
    ]);
  
    // Calculate totals
    const totalRow = [
      "Total", // Label for the total row
      ...headers.slice(1).map((_, index) => {
        // Sum up all the values in each column, ensuring each value is parsed as a float
        return rows.reduce((sum, row) => sum + (parseFloat(row[index + 1]) || 0), 0);
      }),
    ];
  
    // Convert to CSV string
    const csvContent = [headers, ...rows, totalRow]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
  
    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `Production_Report-${formattedYesterdayDate}.csv`);
  };  
  const exportTargetAchievedData = () => {
    // Ensure targettill is defined and is an array
    if (!Array.isArray(targettill)) {
      console.error("targettill is undefined or not an array:", targettill);
      return;
    }
  
    const headers = [
      "Location Name",
      "Expected Work Order Volume",
      "Scanning",
      "Achieved % as per Scanning",
      "QC",
      "Achieved % as per QC",
      "Submitted for Customer QA",
      "Achieved % as per Submitted for Customer QA",
    ];
  
    const rows = targettill.map(elem => {
      const expectedVolume = parseInt(elem.ExpectedVolume) || 0;
      const scannedImages = parseInt(elem.ScannedImages) || 0;
      const qcImages = parseInt(elem.QCImages) || 0;
      const clientQAImages = parseInt(elem.Client_QA_AcceptedImages) || 0;
  
      const scanningPercentage = expectedVolume
        ? ((scannedImages / expectedVolume) * 100).toFixed(2)
        : "0.00";
      const qcPercentage = expectedVolume
        ? ((qcImages / expectedVolume) * 100).toFixed(2)
        : "0.00";
      const clientQAPercentage = expectedVolume
        ? ((clientQAImages / expectedVolume) * 100).toFixed(2)
        : "0.00";
  
      return [
        elem.LocationName || "N/A",
        isNaN(expectedVolume) ? "0" : expectedVolume.toLocaleString(),
        isNaN(scannedImages) ? "0" : scannedImages.toLocaleString(),
        `${scanningPercentage}%`,
        isNaN(qcImages) ? "0" : qcImages.toLocaleString(),
        `${qcPercentage}%`,
        isNaN(clientQAImages) ? "0" : clientQAImages.toLocaleString(),
        `${clientQAPercentage}%`,
      ];
    });
  
    // Calculate totals for each column
    const totalExpectedVolume = targettill.reduce(
      (acc, elem) => acc + (parseInt(elem.ExpectedVolume) || 0),
      0
    );
    const totalScannedImages = targettill.reduce(
      (acc, elem) => acc + (parseInt(elem.ScannedImages) || 0),
      0
    );
    const totalQcImages = targettill.reduce(
      (acc, elem) => acc + (parseInt(elem.QCImages) || 0),
      0
    );
    const totalClientQAImages = targettill.reduce(
      (acc, elem) => acc + (parseInt(elem.Client_QA_AcceptedImages) || 0),
      0
    );
  
    // Add totals row
    rows.push([
      "Total",
      totalExpectedVolume.toLocaleString(),
      totalScannedImages.toLocaleString(),
      "--", // Placeholder for percentage
      totalQcImages.toLocaleString(),
      "--", // Placeholder for percentage
      totalClientQAImages.toLocaleString(),
      "--", // Placeholder for percentage
    ]);
  
    // Download CSV
    downloadCSV(headers, rows, "Target_Achieved_Data.csv");
  };
  const downloadCSV = (headers, rows, filename) => {
    const csvContent = [
      headers.join(","), // Convert headers to CSV
      ...rows.map(row => row.map(item => `"${item}"`).join(",")), // Convert rows to CSV
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const calculateTotal = (data, key) => {
    return data
      ? data.reduce((total, item) => {
        const value = parseInt(item[key]) || 0;
        return total + value;
      }, 0).toLocaleString()
      : "0";
  };
  const Loader = () => (
    <div className="loader-overlay">
      <div className="loader"></div>
    </div>
  );

  return (
    <>
      {isLoading && <Loader />}
      <Header />
      <div className={`container-fluid ${isLoading ? 'blur' : ''}`}>
        <div className="row">
          <div className="col-lg-2 col-md-0 "></div>
          <div className="col-lg-10 col-md-12 col-sm-12">
            <div className="row mt-2 me-1">
              <h4 className="text-center">DPR Report</h4>
            </div>
            <div className="row mt-2 me-1">
              <div className="table-card" style={{ marginBottom: "0px" }}>
                <div className="row" style={{ padding: "5px", backgroundColor: "#4BC0C0", paddingTop: "15px" }}>
                  <div className="col-10">
                    <h6 className="" style={{ color: "white" }}>Production Report ({formattedYesterdayDate})</h6>
                  </div>
                  <div className="col-2 text-end">
                    <button onClick={handleExportYesterdayCSV} className="btn btn-light" style={{ marginTop: '-10px' }}>
                      Export to CSV
                    </button>
                  </div>
                </div>
                <div className="row mt-3 ms-2 me-2" style={{ overflowX: "auto" }}>
                  <table className="table table-hover table-bordered table-responsive data-table">
                    <thead style={{ color: "#4bc0c0", fontWeight: '300', textAlign: 'center' }}>
                      <tr>
                        <th rowSpan="2" style={{ whiteSpace: 'nowrap', verticalAlign: 'middle', width: '150px' }}>
                          Site Name
                        </th>
                        <th rowSpan="2" style={{ verticalAlign: 'middle' }}>
                          Total Manpower
                        </th>
                        <th rowSpan="2" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Scanning Target Set by Ops Team
                        </th>
                        <th rowSpan="2" style={{ verticalAlign: 'middle', width: '150px' }}>
                          QC Target Set by Ops team (90% of Scanning)
                        </th>
                        <th rowSpan="2" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Post QC target set by Ops team
                        </th>
                        <th colSpan="2" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Scanner Availability Count
                        </th>
                        <th colSpan="2" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Collection Of Records
                        </th>
                        <th colSpan="3" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Scanning
                        </th>
                        <th colSpan="3" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Image QC
                        </th>
                        <th colSpan="3" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Flagging
                        </th>
                        <th colSpan="3" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Indexing
                        </th>
                        <th colSpan="3" style={{ verticalAlign: 'middle', width: '150px' }}>
                          CBSL QA
                        </th>
                        <th colSpan="3" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Ready For Customer QA
                        </th>
                        <th colSpan="3" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Customer QA Done
                        </th>
                        <th colSpan="3" style={{ verticalAlign: 'middle', width: '150px' }}>
                          DMS Uploaded
                        </th>
                        <th colSpan="2" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Re-Filing Binding
                        </th>
                        <th colSpan="2" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Inventory Out
                        </th>
                      </tr>
                      <tr style={{ color: "black", fontWeight: '300' }}>
                        <th>A3</th>
                        <th>A4</th>
                        <th>Files</th>
                        <th>MP</th>
                        <th>Files</th>
                        <th>Images</th>
                        <th>MP</th>
                        <th>Files</th>
                        <th>Images</th>
                        <th>MP</th>
                        <th>Files</th>
                        <th>Images</th>
                        <th>MP</th>
                        <th>Files</th>
                        <th>Images</th>
                        <th>MP</th>
                        <th>Files</th>
                        <th>Images</th>
                        <th>MP</th>
                        <th>Files</th>
                        <th>Images</th>
                        <th>MP</th>
                        <th>Files</th>
                        <th>Images</th>
                        <th>MP</th>
                        <th>Files</th>
                        <th>Images</th>
                        <th>MP</th>
                        <th>Files</th>
                        <th>MP</th>
                        <th>Files</th>
                        <th>MP</th>
                      </tr>
                    </thead>
                    <tbody className="scrollable" style={{ color: "#4bc0c0", height: "80px" }}>
                      {yesterdayReport && yesterdayReport.map((elem, index) => {
                        // Calculate total manpower for each row
                        const totalManpower = [
                          parseInt(elem.Scan_MP) || 0,
                          parseInt(elem.Image_QC_MP) || 0,
                          parseInt(elem.Flagging_MP) || 0,
                          parseInt(elem.Index_MP) || 0,
                          parseInt(elem.CBSL_QA_MP) || 0,
                          parseInt(elem.Ready_Cust_QA_MP) || 0,
                          parseInt(elem.Cust_QA_Done_MP) || 0,
                          parseInt(elem.DMS_Upload_MP) || 0,
                          parseInt(elem.Refilling_MP) || 0,
                          parseInt(elem.Inventory_MP) || 0,
                        ].reduce((sum, manpower) => sum + manpower, 0);

                        return (
                          <tr key={index} style={{ backgroundColor: "white" }}>
                            <td style={{ whiteSpace: 'nowrap', textAlign: 'left' }}>{elem.LocationName}</td>
                            <td>{totalManpower.toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.Scaning_Target_A3)) ? "0" : parseInt(elem.Scaning_Target_A3).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.QC_Target)) ? "0" : parseInt(elem.QC_Target).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.Post_QC_Target)) ? "0" : parseInt(elem.Post_QC_Target).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.Scaning_Capacity_A3)) ? "0" : parseInt(elem.Scaning_Capacity_A3).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.Scaning_Capacity_A4)) ? "0" : parseInt(elem.Scaning_Capacity_A4).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.ReceivedFiles)) ? "0" : parseInt(elem.ReceivedFiles).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.Coll_Index_MP)) ? "0" : parseInt(elem.Coll_Index_MP).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.ScannedFiles)) ? "0" : parseInt(elem.ScannedFiles).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.ScannedImages)) ? "0" : parseInt(elem.ScannedImages).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.Scan_MP)) ? "0" : parseInt(elem.Scan_MP).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.QCFiles)) ? "0" : parseInt(elem.QCFiles).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.QCImages)) ? "0" : parseInt(elem.QCImages).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.Image_QC_MP)) ? "0" : parseInt(elem.Image_QC_MP).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.FlaggingFiles)) ? "0" : parseInt(elem.FlaggingFiles).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.FlaggingImages)) ? "0" : parseInt(elem.FlaggingImages).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.Flagging_MP)) ? "0" : parseInt(elem.Flagging_MP).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.IndexingFiles)) ? "0" : parseInt(elem.IndexingFiles).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.IndexingImages)) ? "0" : parseInt(elem.IndexingImages).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.Index_MP)) ? "0" : parseInt(elem.Index_MP).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.CBSL_QAFiles)) ? "0" : parseInt(elem.CBSL_QAFiles).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.CBSL_QAImages)) ? "0" : parseInt(elem.CBSL_QAImages).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.CBSL_QA_MP)) ? "0" : parseInt(elem.CBSL_QA_MP).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.SubmittedForFiles)) ? "0" : parseInt(elem.SubmittedForFiles).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.SubmittedForImages)) ? "0" : parseInt(elem.SubmittedForImages).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.Ready_Cust_QA_MP)) ? "0" : parseInt(elem.Ready_Cust_QA_MP).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.Client_QA_AcceptedFiles)) ? "0" : parseInt(elem.Client_QA_AcceptedFiles).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.Client_QA_AcceptedImages)) ? "0" : parseInt(elem.Client_QA_AcceptedImages).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.Cust_QA_Done_MP)) ? "0" : parseInt(elem.Cust_QA_Done_MP).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.DMS_UploadFiles)) ? "0" : parseInt(elem.DMS_UploadFiles).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.DMS_UploadImages)) ? "0" : parseInt(elem.DMS_UploadImages).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.DMS_Upload_MP)) ? "0" : parseInt(elem.DMS_Upload_MP).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.Refilling_Files_TF)) ? "0" : parseInt(elem.Refilling_Files_TF).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.Refilling_MP)) ? "0" : parseInt(elem.Refilling_MP).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.Inv_Out_Files)) ? "0" : parseInt(elem.Inv_Out_Files).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.Inventory_MP)) ? "0" : parseInt(elem.Inventory_MP).toLocaleString()}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr style={{ color: "#4BC0C0", fontWeight: "bold", textAlign: 'right' }}>
                        <td style={{ textAlign: 'left' }}>Total</td>
                        <td>
                          {yesterdayReport.reduce((total, elem) => {
                            const manpower = [
                              parseInt(elem.Scan_MP) || 0,
                              parseInt(elem.Image_QC_MP) || 0,
                              parseInt(elem.Flagging_MP) || 0,
                              parseInt(elem.Index_MP) || 0,
                              parseInt(elem.CBSL_QA_MP) || 0,
                              parseInt(elem.Ready_Cust_QA_MP) || 0,
                              parseInt(elem.Cust_QA_Done_MP) || 0,
                              parseInt(elem.DMS_Upload_MP) || 0,
                              parseInt(elem.Refilling_MP) || 0,
                              parseInt(elem.Inventory_MP) || 0,
                            ].reduce((sum, manpower) => sum + manpower, 0);
                            return total + manpower;
                          }, 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.Scaning_Target_A3) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.QC_Target) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.Post_QC_Target) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.Scaning_Capacity_A3) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.Scaning_Capacity_A4) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.ReceivedFiles) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.Coll_MP) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.ScannedFiles) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.ScannedImages) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.Scan_MP) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.QCFiles) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.QCImages) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.Image_QC_MP) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.FlaggingFiles) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.FlaggingImages) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.Flagging_MP) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.IndexingFiles) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.IndexingImages) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.Index_MP) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.CBSL_QAFiles) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.CBSL_QAImages) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.CBSL_QA_MP) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.SubmittedForFiles) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.SubmittedForImages) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.Ready_Cust_QA_MP) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.Client_QA_AcceptedFiles) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.Client_QA_AcceptedImages) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.Cust_QA_Done_MP) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.DMS_UploadFiles) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.DMS_UploadImages) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.DMS_Upload_MP) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.Refilling_Files) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.Refilling_MP) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.InventoryOutFiles) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {yesterdayReport.reduce((sum, elem) => sum + (parseInt(elem.Inventory_MP) || 0), 0).toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
            <div className="row mt-2 me-1">
              <div className="table-card" style={{ marginBottom: "0px" }}>
                <div className="row" style={{ padding: "5px", backgroundColor: "#4BC0C0", paddingTop: "15px" }}>
                  <div className="col-10">
                    <h6 className="" style={{ color: "white" }}>Cumulative Production</h6>
                  </div>
                  <div className="col-2 text-end">
                    <button onClick={handleExportCSV} className="btn btn-light" style={{ marginTop: '-10px' }}>
                      Export to CSV
                    </button>
                  </div>
                </div>
                <div className="row mt-1 ms-2 me-2" style={{ overflowX: "auto" }}>
                  <table className="table table-hover table-bordered table-responsive data-table">
                    <thead style={{ color: "#4bc0c0", fontWeight: "300", textAlign: "center" }}>
                      <tr>
                        <th rowSpan="2" style={{ whiteSpace: "nowrap", verticalAlign: "middle", width: "150px" }}>
                          Site Name
                        </th>
                        <th colSpan="2" style={{ verticalAlign: "middle", width: "150px" }}>Collection of Records</th>
                        <th colSpan="2" style={{ verticalAlign: "middle", width: "150px" }}>Scanning</th>
                        <th colSpan="2" style={{ verticalAlign: "middle", width: "150px" }}>Image QC</th>
                        <th colSpan="2" style={{ verticalAlign: "middle", width: "150px" }}>Flagging</th>
                        <th colSpan="2" style={{ verticalAlign: "middle", width: "150px" }}>Indexing</th>
                        <th colSpan="2" style={{ verticalAlign: "middle", width: "150px" }}>CBSL QA</th>
                        <th colSpan="2" style={{ verticalAlign: "middle", width: "150px" }}>Submitted For</th>
                        <th colSpan="2" style={{ verticalAlign: "middle", width: "150px" }}>Customer QA</th>
                        <th colSpan="2" style={{ verticalAlign: "middle", width: "150px" }}>DMS Uploaded</th>
                        <th colSpan="2" style={{ verticalAlign: "middle", width: "150px" }}>Inventory Out</th>
                      </tr>
                      <tr style={{ color: "black", fontWeight: "300" }}>
                        <th>Files</th>
                        <th>Images</th>
                        <th>Files</th>
                        <th>Images</th>
                        <th>Files</th>
                        <th>Images</th>
                        <th>Files</th>
                        <th>Images</th>
                        <th>Files</th>
                        <th>Images</th>
                        <th>Files</th>
                        <th>Images</th>
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
                    <tbody className="scrollable" style={{ color: "#4bc0c0", height: "80px" }}>
                      {report &&
                        report.map((elem, index) => (
                          <tr key={index} style={{ backgroundColor: "white" }}>
                            <td style={{ whiteSpace: "nowrap", textAlign: "left" }}>{elem.LocationName}</td>
                            <td>{isNaN(parseInt(elem.CollectionFiles)) ? "0" : parseInt(elem.CollectionFiles).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.CollectionImages)) ? "0" : parseInt(elem.CollectionImages).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.ScannedFiles)) ? "0" : parseInt(elem.ScannedFiles).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.ScannedImages)) ? "0" : parseInt(elem.ScannedImages).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.QCFiles)) ? "0" : parseInt(elem.QCFiles).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.QCImages)) ? "0" : parseInt(elem.QCImages).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.FlaggingFiles)) ? "0" : parseInt(elem.FlaggingFiles).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.FlaggingImages)) ? "0" : parseInt(elem.FlaggingImages).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.IndexingFiles)) ? "0" : parseInt(elem.IndexingFiles).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.IndexingImages)) ? "0" : parseInt(elem.IndexingImages).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.CBSL_QAFiles)) ? "0" : parseInt(elem.CBSL_QAFiles).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.CBSL_QAImages)) ? "0" : parseInt(elem.CBSL_QAImages).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.SubmittedForFiles)) ? "0" : parseInt(elem.SubmittedForFiles).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.SubmittedForImages)) ? "0" : parseInt(elem.SubmittedForImages).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.Client_QA_AcceptedFiles)) ? "0" : parseInt(elem.Client_QA_AcceptedFiles).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.Client_QA_AcceptedImages)) ? "0" : parseInt(elem.Client_QA_AcceptedImages).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.DMS_UploadFiles)) ? "0" : parseInt(elem.DMS_UploadFiles).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.DMS_UploadImages)) ? "0" : parseInt(elem.DMS_UploadImages).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.InventoryOutFiles)) ? "0" : parseInt(elem.InventoryOutFiles).toLocaleString()}</td>
                            <td>{isNaN(parseInt(elem.InventoryOutImages)) ? "0" : parseInt(elem.InventoryOutImages).toLocaleString()}</td>
                          </tr>
                        ))}
                      <tr style={{ fontWeight: "bold", textAlign: 'right' }}>
                        <td style={{ textAlign: 'left' }}>Total</td>
                        <td>{calculateTotal(report, 'CollectionFiles')}</td>
                        <td>{calculateTotal(report, 'CollectionImages')}</td>
                        <td>{calculateTotal(report, 'ScannedFiles')}</td>
                        <td>{calculateTotal(report, 'ScannedImages')}</td>
                        <td>{calculateTotal(report, 'QCFiles')}</td>
                        <td>{calculateTotal(report, 'QCImages')}</td>
                        <td>{calculateTotal(report, 'FlaggingFiles')}</td>
                        <td>{calculateTotal(report, 'FlaggingImages')}</td>
                        <td>{calculateTotal(report, 'IndexingFiles')}</td>
                        <td>{calculateTotal(report, 'IndexingImages')}</td>
                        <td>{calculateTotal(report, 'CBSL_QAFiles')}</td>
                        <td>{calculateTotal(report, 'CBSL_QAImages')}</td>
                        <td>{calculateTotal(report, 'SubmittedForFiles')}</td>
                        <td>{calculateTotal(report, 'SubmittedForImages')}</td>
                        <td>{calculateTotal(report, 'Client_QA_AcceptedFiles')}</td>
                        <td>{calculateTotal(report, 'Client_QA_AcceptedImages')}</td>
                        <td>{calculateTotal(report, 'DMS_UploadFiles')}</td>
                        <td>{calculateTotal(report, 'DMS_UploadImages')}</td>
                        <td>{calculateTotal(report, 'InventoryOutFiles')}</td>
                        <td>{calculateTotal(report, 'InventoryOutImages')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="row mt-2 me-1">
              <div className="table-card" style={{ marginBottom: "0px" }}>
                <div className="row" style={{ padding: "5px", backgroundColor: "#4BC0C0", paddingTop: "15px" }}>
                  <div className="col-10">
                    <h6 className="" style={{ color: "white" }}>
                      Production Achieved till date ({formattedCurrentDate}) as per PO Volume
                    </h6>
                  </div>
                  <div className="col-2 text-end">
                    <button onClick={exportTargetAchievedData} className="btn btn-light" style={{ marginTop: '-10px' }}>
                      Export to CSV
                    </button>
                  </div>
                </div>
                <div className="row mt-1 ms-2 me-2" style={{ overflowX: "auto" }}>
                  <table className="table table-hover table-bordered table-responsive data-table">
                    <thead style={{ color: "#4bc0c0", fontWeight: '300', textAlign: 'center' }}>
                      <tr>
                        <th rowSpan="2" style={{ whiteSpace: 'nowrap', verticalAlign: 'middle', width: '150px' }}>
                          Location Name
                        </th>
                        <th rowSpan="2" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Expected work order volume
                        </th>
                        <th colSpan="6" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Cumulative Production
                        </th>
                      </tr>
                      <tr style={{ color: "black", fontWeight: '300' }}>
                        <th style={{ verticalAlign: 'middle' }}>Scanning</th>
                        <th style={{ verticalAlign: 'middle' }}>Achieved % as per scanning</th>
                        <th style={{ verticalAlign: 'middle' }}>QC </th>
                        <th style={{ verticalAlign: 'middle' }}>Achieved % as per Qc</th>
                        <th style={{ verticalAlign: 'middle' }}>Submitted for customer QA</th>
                        <th style={{ verticalAlign: 'middle' }}>Achieved % as per Submitted for customer QA</th>
                      </tr>
                    </thead>
                    <tbody className="scrollable" style={{ color: "#4bc0c0", height: "80px" }}>
                      {targettill &&
                        targettill.map((elem, index) => {
                          // Parse values and handle NaN
                          const expectedVolume = parseInt(elem.ExpectedVolume) || 0;
                          const scannedImages = parseInt(elem.ScannedImages) || 0;
                          const qcImages = parseInt(elem.QCImages) || 0;
                          const clientQAImages = parseInt(elem.Client_QA_AcceptedImages) || 0;

                          // Calculate percentages
                          const scanningPercentage = expectedVolume
                            ? ((scannedImages / expectedVolume) * 100).toFixed(2)
                            : "0.00";
                          const qcPercentage = expectedVolume
                            ? ((qcImages / expectedVolume) * 100).toFixed(2)
                            : "0.00";
                          const clientQAPercentage = expectedVolume
                            ? ((clientQAImages / expectedVolume) * 100).toFixed(2)
                            : "0.00";

                          return (
                            <tr key={index} style={{ backgroundColor: "white" }}>
                              <td style={{ whiteSpace: "nowrap", textAlign: 'left' }}>{elem.LocationName}</td>
                              <td>
                                {isNaN(expectedVolume) ? "0" : expectedVolume.toLocaleString()}
                              </td>
                              <td>
                                {isNaN(scannedImages) ? "0" : scannedImages.toLocaleString()}
                              </td>
                              <td>{scanningPercentage}%</td>
                              <td>
                                {isNaN(qcImages) ? "0" : qcImages.toLocaleString()}
                              </td>
                              <td>{qcPercentage}%</td>
                              <td>
                                {isNaN(clientQAImages) ? "0" : clientQAImages.toLocaleString()}
                              </td>
                              <td>{clientQAPercentage}%</td>
                            </tr>
                          );
                        })}

                      {/* Add totals row */}
                      <tr style={{ backgroundColor: "#f8f9fa", fontWeight: "bold" }}>
                        <td style={{ whiteSpace: "nowrap", textAlign: 'left' }}>Total</td>
                        <td>
                          {targettill.reduce((acc, elem) => acc + (parseInt(elem.ExpectedVolume) || 0), 0).toLocaleString()}
                        </td>
                        <td>
                          {targettill.reduce((acc, elem) => acc + (parseInt(elem.ScannedImages) || 0), 0).toLocaleString()}
                        </td>
                        <td></td>
                        <td>
                          {targettill.reduce((acc, elem) => acc + (parseInt(elem.QCImages) || 0), 0).toLocaleString()}
                        </td>
                        <td></td>
                        <td>
                          {targettill.reduce((acc, elem) => acc + (parseInt(elem.Client_QA_AcceptedImages) || 0), 0).toLocaleString()}
                        </td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DPRReport;
