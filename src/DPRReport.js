import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import axios from "axios";
import { MdFileDownload } from "react-icons/md";
import { API_URL } from "./Api";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

const DPRReport = () => {
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState();
  const [target, setTarget] = useState();
  const [targettill, setTargetTill] = useState();
  const [report, setReport] = useState();
  
 
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
    const fetchCumulativeData = async () => {
        try {
          let apiUrl = `${API_URL}/cumulativereportTable`;
          setIsLoading(true);
          const response = await axios.get(apiUrl);
          console.log("API Response:", response.data); // Log the API response
          setSummary(response.data);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching report data:", error);
          setError("Error fetching report data. Please try again.");
          setIsLoading(false);
        }
      };
      const fetchTargetData = async () => {
        try {
          let apiUrl = `${API_URL}/targettable`;
          setIsLoading(true);
          const response = await axios.get(apiUrl);
          console.log("API Response:", response.data); // Log the API response
          setTarget(response.data);
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
    fetchCumulativeData();
    fetchTargetData();
    fetchTargettillData();

  }, []);

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
              <div className="card" style={{ padding: "5px", backgroundColor: "#4BC0C0" }}>
                <h6 className="" style={{ color: "white" }}>Dashboard / DPR Report</h6>
              </div>
            </div>
            <div className="row mt-3 me-1">
              <div className="table-card">
                <div className="row" style={{ padding: "5px", backgroundColor: "#4BC0C0", paddingTop: "15px" }}>
                  <div className="col-10">
                    <h6 className="" style={{ color: "white" }}>DPR REPORT</h6>
                  </div>
                </div>
                <div className="row mt-3 ms-2 me-2" style={{ overflowX: "auto" }}>
                  <table className="table table-hover table-bordered table-responsive data-table">
                    <thead style={{ color: "#4bc0c0", fontWeight: '300', textAlign: 'center' }}>
                      <tr>
                        <th rowSpan="2" style={{ whiteSpace: 'nowrap', verticalAlign: 'middle', width: '150px' }}>
                          Site Name
                        </th>
                        <th colSpan="2" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Collection of Records
                        </th>
                        <th colSpan="2" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Scanning 
                        </th>
                        <th colSpan="2" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Image QC
                        </th>
                        <th colSpan="2" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Flagging
                        </th>
                        <th colSpan="2" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Indexing
                        </th>
                        <th colSpan="2" style={{ verticalAlign: 'middle', width: '150px' }}>
                          CBSL QA
                        </th>
                        <th colSpan="2" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Submitted For
                        </th>
                        <th colSpan="2" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Customer QA
                        </th>
                        <th colSpan="2" style={{ verticalAlign: 'middle', width: '150px' }}>
                          DMS Uploaded
                        </th>
                        <th colSpan="2" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Inventory Out
                        </th>
                      </tr>
                      <tr style={{ color: "black", fontWeight: '300' }}>
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
                      {report && report.map((elem, index) => (
                        <tr key={index} style={{ backgroundColor: "white" }}>
                          <td style={{ whiteSpace: 'nowrap' }}>{elem.LocationName}</td>
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
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="row mt-3 me-1">
              <div className="table-card">
                <div className="row" style={{ padding: "5px", backgroundColor: "#4BC0C0", paddingTop: "15px" }}>
                  <div className="col-10">
                    <h6 className="" style={{ color: "white" }}>CUMULATIVE REPORT</h6>
                  </div>
                </div>
                <div className="row mt-3 ms-2 me-2" style={{ overflowX: "auto" }}>
                  <table className="table table-hover table-bordered table-responsive data-table">
                    <thead style={{ color: "#4bc0c0", fontWeight: '300', textAlign: 'center' }}>
                      <tr>
                        <th rowSpan="2" style={{ whiteSpace: 'nowrap', verticalAlign: 'middle', width: '150px' }}>
                          Location
                        </th>
                        <th colSpan="2" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Scanner
                        </th>
                        <th colSpan="2" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Collection 
                        </th>
                        <th colSpan="2" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Scanning(ADF)
                        </th>
                        <th colSpan="2" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Image QC
                        </th>
                        <th colSpan="2" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Document Classification(Flagging)
                        </th>
                        <th colSpan="2" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Indexing(Data Entry)
                        </th>
                        <th colSpan="2" style={{ verticalAlign: 'middle', width: '150px' }}>
                          CBSL QA
                        </th>
                        <th colSpan="2" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Ready For Customer QA
                        </th>
                        <th colSpan="2" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Customer QA Done
                        </th>
                        <th colSpan="2" style={{ verticalAlign: 'middle', width: '150px' }}>
                          DMS Upload
                        </th>
                        <th colSpan="2" style={{ verticalAlign: 'middle', width: '150px' }}>
                          Inventory Out
                        </th>
                      </tr>
                      <tr style={{ color: "black", fontWeight: '300' }}>
                      <th>A3</th>
                      <th>A4</th>
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
                      {summary && summary.map((elem, index) => (
                        <tr key={index} style={{ backgroundColor: "white" }}>
                          <td style={{ whiteSpace: 'nowrap' }}>{elem.LocationName}</td>
                          <td>{isNaN(parseInt(elem.Scaning_Target_A3)) ? "0" : parseInt(elem.Scaning_Target_A3).toLocaleString()}</td>
                          <td>{isNaN(parseInt(elem.Scaning_Target_A4)) ? "0" : parseInt(elem.Scaning_Target_A4).toLocaleString()}</td>
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
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="row mt-3 me-1">
              <div className="table-card">
                <div className="row" style={{ padding: "5px", backgroundColor: "#4BC0C0", paddingTop: "15px" }}>
                  <div className="col-10">
                    <h6 className="" style={{ color: "white" }}>Production Report(14-Nov)</h6>
                  </div>
                </div>
                <div className="row mt-3 ms-2 me-2" style={{ overflowX: "auto" }}>
  <table className="table table-hover table-bordered table-responsive data-table">
    <thead style={{ color: "#4bc0c0", fontWeight: '300', textAlign: 'center' }}>
      <tr>
        <th rowSpan="2" style={{ whiteSpace: 'nowrap', verticalAlign: 'middle', width: '150px' }}>
          Site Name
        </th>
        <th rowSpan="2" style={{ whiteSpace: 'nowrap', verticalAlign: 'middle', width: '150px' }}>
          Total Manpower
        </th>
        <th rowSpan="2" style={{ whiteSpace: 'nowrap', verticalAlign: 'middle', width: '150px' }}>
          MP
        </th>
        <th rowSpan="2" style={{ verticalAlign: 'middle', width: '150px' }}>
          Collection/Barcode Of Records
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
        <th>Images</th>
        <th>MP</th>
        <th>Files</th>
        <th>MP</th>
        <th>Files</th>
      </tr>
    </thead>
    

                    <tbody className="scrollable" style={{ color: "#4bc0c0", height: "80px" }}>
                      {summary && summary.map((elem, index) => (
                        <tr key={index} style={{ backgroundColor: "white" }}>
                          <td style={{ whiteSpace: 'nowrap' }}>{elem.LocationName}</td>
                          <td>{isNaN(parseInt(elem.Scaning_Target_A3)) ? "0" : parseInt(elem.Scaning_Target_A3).toLocaleString()}</td>
                          <td>{isNaN(parseInt(elem.Scaning_Target_A4)) ? "0" : parseInt(elem.Scaning_Target_A4).toLocaleString()}</td>
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
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="row mt-3 me-1">
              <div className="table-card">
                <div className="row" style={{ padding: "5px", backgroundColor: "#4BC0C0", paddingTop: "15px" }}>
                  <div className="col-10">
                    <h6 className="" style={{ color: "white" }}>Target Achieved(14-Nov)</h6>
                  </div>
                </div>
                <div className="row mt-3 ms-2 me-2" style={{ overflowX: "auto" }}>
                  <table className="table table-hover table-bordered table-responsive data-table">
                    <thead style={{ color: "#4bc0c0", fontWeight: '300', textAlign: 'center' }}>
                      <tr>
                        <th rowSpan="2" style={{ whiteSpace: 'nowrap', verticalAlign: 'middle', width: '150px' }}>
                          Location Name
                        </th>
                        <th rowSpan="2" style={{ whiteSpace: 'nowrap', verticalAlign: 'middle', width: '150px' }}>
                        Scanning Target Set by Ops Team
                        </th>
                        <th rowSpan="2" style={{ whiteSpace: 'nowrap', verticalAlign: 'middle', width: '150px' }}>
                        QC Target Set by Ops team (90% of Scanning)
                        </th>
                        <th rowSpan="2" style={{ whiteSpace: 'nowrap', verticalAlign: 'middle', width: '150px' }}>
                        Post QC target set by Ops team
                        </th>
                        <th colSpan="7" style={{ verticalAlign: 'middle', width: '150px' }}>
                        Production of 13 Nov
                        </th>
                        
                      </tr>
                      <tr style={{ color: "black", fontWeight: '300' }}>
                      
                        <th>Scanning</th>
                        <th>Image QC</th>
                        <th>Flagging </th>
                        <th>Indexing</th>
                        <th>CBSL QA</th>
                        <th>Client QC</th>
                        <th>DMS Upload</th>
                      </tr>
                    </thead>
                    <tbody className="scrollable" style={{ color: "#4bc0c0", height: "80px" }}>
                      {summary && summary.map((elem, index) => (
                        <tr key={index} style={{ backgroundColor: "white" }}>
                          <td style={{ whiteSpace: 'nowrap' }}>{elem.LocationName}</td>
                          <td>{isNaN(parseInt(elem.Scaning_Target_A3)) ? "0" : parseInt(elem.Scaning_Target_A3).toLocaleString()}</td>
                          <td>{isNaN(parseInt(elem.QC_Target)) ? "0" : parseInt(elem.QC_Target).toLocaleString()}</td>
                          <td>{isNaN(parseInt(elem.Post_QC_Target)) ? "0" : parseInt(elem.Post_QC_Target).toLocaleString()}</td>
                          <td>{isNaN(parseInt(elem.ScannedImages)) ? "0" : parseInt(elem.ScannedImages).toLocaleString()}</td>
                          <td>{isNaN(parseInt(elem.QCImages)) ? "0" : parseInt(elem.QCImages).toLocaleString()}</td>
                          <td>{isNaN(parseInt(elem.FlaggingImages)) ? "0" : parseInt(elem.FlaggingImages).toLocaleString()}</td>                    
                          <td>{isNaN(parseInt(elem.IndexingImages)) ? "0" : parseInt(elem.IndexingImages).toLocaleString()}</td>                      
                          <td>{isNaN(parseInt(elem.CBSL_QAImages)) ? "0" : parseInt(elem.CBSL_QAImages).toLocaleString()}</td>                                                   
                         <td>{isNaN(parseInt(elem.Client_QA_AcceptedImages)) ? "0" : parseInt(elem.Client_QA_AcceptedImages).toLocaleString()}</td>                         
                          <td>{isNaN(parseInt(elem.DMS_UploadImages)) ? "0" : parseInt(elem.DMS_UploadImages).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="row mt-3 me-1">
              <div className="table-card">
                <div className="row" style={{ padding: "5px", backgroundColor: "#4BC0C0", paddingTop: "15px" }}>
                  <div className="col-10">
                    <h6 className="" style={{ color: "white" }}>Target Achieved(till now)</h6>
                  </div>
                </div>
                <div className="row mt-3 ms-2 me-2" style={{ overflowX: "auto" }}>
                  <table className="table table-hover table-bordered table-responsive data-table">
                    <thead style={{ color: "#4bc0c0", fontWeight: '300', textAlign: 'center' }}>
                      <tr>
                        <th rowSpan="2" style={{ whiteSpace: 'nowrap', verticalAlign: 'middle', width: '150px' }}>
                          Location Name
                        </th>
                        <th rowSpan="2" style={{ whiteSpace: 'nowrap', verticalAlign: 'middle', width: '150px' }}>
                        Expected work order volume
                        </th>
                        <th colSpan="6" style={{ verticalAlign: 'middle', width: '150px' }}>
                        Production till now
                        </th>
                        
                      </tr>
                      <tr style={{ color: "black", fontWeight: '300' }}>
                      
                        <th>Scanning</th>
                        <th>Achieved % as per scanning</th>
                        <th>QC </th>
                        <th>Achieved % as per Qc</th>
                        <th>Submitted for customer QA</th>
                        <th>Achieved % as per Submitted for customer QA</th>
                      </tr>
                    </thead>
                    <tbody className="scrollable" style={{ color: "#4bc0c0", height: "80px" }}>
                      {targettill && targettill.map((elem, index) => (
                        <tr key={index} style={{ backgroundColor: "white" }}>
                          <td style={{ whiteSpace: 'nowrap' }}>{elem.LocationName}</td>
                          <td>{isNaN(parseInt(elem.Workdone)) ? "0" : parseInt(elem.Workdone).toLocaleString()}</td>
                          <td>{isNaN(parseInt(elem.ScannedImages)) ? "0" : parseInt(elem.ScannedImages).toLocaleString()}</td>
                          <td>{isNaN(parseInt(elem.percentagescanning)) ? "0" : parseInt(elem.percentagescanning).toLocaleString()}</td>                    
                          <td>{isNaN(parseInt(elem.QCImages)) ? "0" : parseInt(elem.QCImages).toLocaleString()}</td>
                          <td>{isNaN(parseInt(elem.percentagqc)) ? "0" : parseInt(elem.percentagqc).toLocaleString()}</td>                                     
                         <td>{isNaN(parseInt(elem.Client_QA_AcceptedImages)) ? "0" : parseInt(elem.Client_QA_AcceptedImages).toLocaleString()}</td>     
                         <td>{isNaN(parseInt(elem.customerqa)) ? "0" : parseInt(elem.customerqa).toLocaleString()}</td>                                                                       
                        </tr>
                      ))}
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
