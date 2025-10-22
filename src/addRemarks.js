import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { API_URL } from './Api';
import { MdFileDownload } from 'react-icons/md';
import { format, sub } from "date-fns";
import Header from './Components/Header';


const AddRemarks = ({ showSideBar }) => {
    const [tableData, setTableData] = useState();
    const [report, setReport] = useState();
    const [selectedLocation, setSelectedLocation] = useState();
    const [yesterdayReport, setYesterdayReport] = useState();
    const [isAddDailyModalOpen, setIsAddDailyModalOpen] = useState(false);
    const [isViewDailyModalOpen, setIsViewDailyModalOpen] = useState(false);
    const [isAddCumulativeModalOpen, setIsAddCumulativeModalOpen] = useState(false);
    const [isViewCumulativeModalOpen, setIsViewCumulativeModalOpen] = useState(false);
    const [dailyRemarks, setDailyRemarks] = useState('');
    const [cumulativeRemarks, setCumulativeRemarks] = useState('');
    const [dailySpecialRequests, setDailySpecialRequests] = useState('');
    const [cumulativeSpecialRequests, setCumulativeSpecialRequests] = useState('');
    const [specialRequests, setSpecialRequests] = useState('');
    const [remarks, setRemarks] = useState('');
    const currentDate = new Date();
    const yesterdayDate = sub(currentDate, { days: 1 });
    const formattedYesterdayDate = format(yesterdayDate, "dd-MM-yyyy");
    const formattedYesterdayDateforRemarks = format(yesterdayDate, "yyyy-MM-dd");
    const formattedDateforRemarks = format(currentDate, "yyyy-MM-dd");
    const [isLoading, setIsLoading] = useState(false);
    const fetchReportData = () => {
  return axios.get(`${API_URL}/Table`)
    .then(response => setReport(response.data))
    .catch(error => console.error(error));
};

const fetchTableData = () => {
  return axios.get(`${API_URL}/tabularData`)
    .then(response => setTableData(response.data))
    .catch(error => console.error(error));
};

const fetchYesterdayReportData = () => {
  const params = {};
  return axios.get(`${API_URL}/yesterday-table`, { params })
    .then(response => setYesterdayReport(response.data.data))
    .catch(error => console.error(error));
};

    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            try {
                await Promise.all([
                    fetchTableData(),
                    fetchYesterdayReportData(),
                    fetchReportData(),
                ]);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, []);


    const Loader = () => (
        <div className="loader-overlay">
            <div className="loader"></div>
        </div>
    );
    const handleAddDailyClick = (selectedLocation) => {
        setSelectedLocation(selectedLocation);
        setIsAddDailyModalOpen(true);
    };

    const handleViewDailyClick = (dailyRemarks, dailySpecialRequests) => {
        setDailyRemarks(dailyRemarks)
        setDailySpecialRequests(dailySpecialRequests)
        setIsViewDailyModalOpen(true);
    };
    const handleAddCumulativeClick = (selectedLocation) => {
        setSelectedLocation(selectedLocation);
        setIsAddCumulativeModalOpen(true);
    };

    const handleViewCumulativeClick = (cumulativeRemarks, cumulativeSpecialRequests) => {
        setCumulativeRemarks(cumulativeRemarks);
        setCumulativeSpecialRequests(cumulativeSpecialRequests)
        setIsViewCumulativeModalOpen(!isViewCumulativeModalOpen);
    };

    const handleAddDailyRemarks = async () => {
        try {
            await axios.post(`${API_URL}/api/daily-remarks`, {
                locationname: selectedLocation,
                date: formattedYesterdayDateforRemarks,
                remarks: dailyRemarks,
                special_requests: specialRequests,
            });
            alert('Data inserted successfully!');
            setIsAddDailyModalOpen(false);

        } catch (error) {
            console.error('Error inserting data:', error);
            alert('Failed to insert data');
        }
    };
    const handleAddCumulativeRemarks = async () => {
        try {
            await axios.post(`${API_URL}/api/cumulative-remarks`, {
                locationname: selectedLocation,
                date: formattedDateforRemarks,
                remarks: cumulativeRemarks,
                special_requests: specialRequests,
            });
            alert('Data inserted successfully!');
            setIsAddCumulativeModalOpen(false);

        } catch (error) {
            console.error('Error inserting data:', error);
            alert('Failed to insert data');
        }
    };


    return (
        <>
            {isLoading && <Loader />}
            <div className={`container-fluid mb-5 ${isLoading ? 'blur' : ''}`}>
                <div className="row">
                    <div className={`${showSideBar ? 'col-lg-1 col-md-0' : 'col-lg-2 col-md-0'} d-none d-lg-block`}></div>
                    <div className={`${showSideBar ? 'col-lg-11 col-md-12' : 'col-lg-10 col-md-12 '} col-sm-12`}>
                        <div className="row mt-2">
                            <div>
                                <div className="table-card" style={{ marginBottom: '25px' }}>
                                    <div
                                        className="d-flex justify-content-between align-items-center"
                                        style={{
                                            padding: "10px 10px 0px",
                                            backgroundColor: "#4BC0C0",
                                        }}
                                    >

                                        <h6 className="text-center" style={{ color: "white" }}>
                                            PROJECT UPDATE REPORT OF  {formattedYesterdayDate} FOR SCANNING AND DIGITIZATION OF CASE
                                            RECORDS FOR DISTRICT COURT OF TELANGANA
                                        </h6>

                                    </div>
                                    <div
                                        className="row mt-2 ms-2 me-2"
                                        style={{ overflowX: "auto", overflowY: 'auto' }}
                                    >
                                        <table className="table table-hover table-bordered table-responsive data-table">
                                            <thead
                                                style={{ color: "#4BC0C0", fontWeight: '300', textAlign: 'center' }}
                                            >
                                                <tr>
                                                    <th rowSpan="2" style={{ whiteSpace: 'nowrap', verticalAlign: 'middle' }}>Location</th>
                                                    <th colSpan="2" style={{ verticalAlign: 'middle' }}>Scanned</th>
                                                    <th colSpan="2" style={{ verticalAlign: 'middle' }}>QC</th>
                                                    <th colSpan="2" style={{ verticalAlign: 'middle' }}>Offered for QA</th>
                                                    <th colSpan="2" style={{ verticalAlign: 'middle' }}>Client QA Done</th>
                                                    <th rowSpan="2" style={{ whiteSpace: 'nowrap', verticalAlign: 'middle' }}>Remarks</th>
                                                </tr>
                                                <tr
                                                    style={{ color: "#4BC0C0", fontWeight: '300' }}
                                                >
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
                                            <tbody
                                                style={{ color: "gray" }}
                                            >
                                                {Array.isArray(yesterdayReport) &&
                                                    yesterdayReport.map((elem, index) => (
                                                        <tr key={index} style={{ backgroundColor: "white" }}>
                                                            <td style={{ whiteSpace: 'nowrap', textAlign: 'left' }}>{elem.locationname}</td>
                                                            <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.ScannedFiles)) ? "0" : parseInt(elem.ScannedFiles).toLocaleString()}</td>
                                                            <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.ScannedImages)) ? "0" : parseInt(elem.ScannedImages).toLocaleString()}</td>
                                                            <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.QCFiles)) ? "0" : parseInt(elem.QCFiles).toLocaleString()}</td>
                                                            <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.QCImages)) ? "0" : parseInt(elem.QCImages).toLocaleString()}</td>
                                                            <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.CBSLQAFiles)) ? "0" : parseInt(elem.CBSLQAFiles).toLocaleString()}</td>
                                                            <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.CBSLQAImages)) ? "0" : parseInt(elem.CBSLQAImages).toLocaleString()}</td>
                                                            <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.ApprovedFiles)) ? "0" : parseInt(elem.ApprovedFiles).toLocaleString()}</td>
                                                            <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.ApprovedImages)) ? "0" : parseInt(elem.ApprovedImages).toLocaleString()}</td>
                                                            <td className='text-center'>
                                                                <button className='btn' style={{ backgroundColor: '#4BC0C0' }} onClick={() => handleAddDailyClick(elem.locationname)}>Add </button>
                                                                <button className='btn ms-1' style={{ backgroundColor: '#4BC0C0' }} onClick={() => handleViewDailyClick(elem.Remarks, elem.SpecialRequests)}> View</button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                                {Array.isArray(yesterdayReport) && (
                                                    <tr style={{ backgroundColor: "#f0f0f0", fontWeight: "bold", textAlign: 'end' }}>
                                                        <td>Total: </td>
                                                        <td>{yesterdayReport.reduce((acc, elem) => acc + (isNaN(parseInt(elem.ScannedFiles)) ? 0 : parseInt(elem.ScannedFiles)), 0).toLocaleString()}</td>
                                                        <td>{yesterdayReport.reduce((acc, elem) => acc + (isNaN(parseInt(elem.ScannedImages)) ? 0 : parseInt(elem.ScannedImages)), 0).toLocaleString()}</td>
                                                        <td>{yesterdayReport.reduce((acc, elem) => acc + (isNaN(parseInt(elem.QCFiles)) ? 0 : parseInt(elem.QCFiles)), 0).toLocaleString()}</td>
                                                        <td>{yesterdayReport.reduce((acc, elem) => acc + (isNaN(parseInt(elem.QCImages)) ? 0 : parseInt(elem.QCImages)), 0).toLocaleString()}</td>
                                                        <td>{yesterdayReport.reduce((acc, elem) => acc + (isNaN(parseInt(elem.CBSLQAFiles)) ? 0 : parseInt(elem.CBSLQAFiles)), 0).toLocaleString()}</td>
                                                        <td>{yesterdayReport.reduce((acc, elem) => acc + (isNaN(parseInt(elem.CBSLQAImages)) ? 0 : parseInt(elem.CBSLQAImages)), 0).toLocaleString()}</td>
                                                        <td>{yesterdayReport.reduce((acc, elem) => acc + (isNaN(parseInt(elem.ApprovedFiles)) ? 0 : parseInt(elem.ApprovedFiles)), 0).toLocaleString()}</td>
                                                        <td>{yesterdayReport.reduce((acc, elem) => acc + (isNaN(parseInt(elem.ApprovedImages)) ? 0 : parseInt(elem.ApprovedImages)), 0).toLocaleString()}</td>
                                                        <td></td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div>
                                <div className="table-card" style={{ marginBottom: '25px' }}>
                                    <div
                                        className="d-flex justify-content-between align-items-center"
                                        style={{
                                            padding: "10px 10px 0px",
                                            backgroundColor: "#4BC0C0",
                                        }}
                                    >
                                        <h6 className="text-center" style={{ color: "white" }}>
                                            PROJECT UPDATE CUMULATIVE REPORT FOR SCANNING AND DIGITIZATION OF CASE
                                            RECORDS FOR DISTRICT COURT OF TELANGANA
                                        </h6>

                                    </div>
                                    <div
                                        className="row mt-2 ms-2 me-2"
                                        style={{ overflowX: "auto", overflowY: 'auto' }}
                                    >
                                        <table className="table table-hover table-bordered table-responsive data-table">
                                            <thead
                                                style={{ color: "#4BC0C0", fontWeight: '300', textAlign: 'center' }}
                                            >
                                                <tr>
                                                    <th rowSpan="2" style={{ whiteSpace: 'nowrap', verticalAlign: 'middle' }}>Location</th>
                                                    <th colSpan="2" style={{ verticalAlign: 'middle' }}>Scanned</th>
                                                    <th colSpan="2" style={{ verticalAlign: 'middle' }}>QC</th>
                                                    <th colSpan="2" style={{ verticalAlign: 'middle' }}>Offered for QA</th>
                                                    <th colSpan="2" style={{ verticalAlign: 'middle' }}>Client QA Done</th>
                                                    <th rowSpan="2" style={{ whiteSpace: 'nowrap', verticalAlign: 'middle' }}>Remarks</th>
                                                </tr>
                                                <tr
                                                    style={{ color: "#4BC0C0", fontWeight: '300' }}
                                                >
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
                                            <tbody
                                                style={{ color: "gray" }}
                                            >
                                                {report &&
                                                    report.map((elem, index) => (
                                                        <tr key={index} style={{ backgroundColor: "white" }}>
                                                            <td style={{ whiteSpace: 'nowrap', textAlign: 'left' }}>{elem.LocationName}</td>
                                                            <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.ScannedFiles)) ? "0" : parseInt(elem.ScannedFiles).toLocaleString()}</td>
                                                            <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.ScannedImages)) ? "0" : parseInt(elem.ScannedImages).toLocaleString()}</td>
                                                            <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.QCFiles)) ? "0" : parseInt(elem.QCFiles).toLocaleString()}</td>
                                                            <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.QCImages)) ? "0" : parseInt(elem.QCImages).toLocaleString()}</td>
                                                            <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.CBSLQAFiles)) ? "0" : parseInt(elem.CBSLQAFiles).toLocaleString()}</td>
                                                            <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.CBSLQAImages)) ? "0" : parseInt(elem.CBSLQAImages).toLocaleString()}</td>
                                                            <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.ApprovedFiles)) ? "0" : parseInt(elem.ApprovedFiles).toLocaleString()}</td>
                                                            <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.ApprovedImages)) ? "0" : parseInt(elem.ApprovedImages).toLocaleString()}</td>
                                                            <td className='text-center'>
                                                                <button className='btn' style={{ backgroundColor: '#4BC0C0' }} onClick={() => handleAddCumulativeClick(elem.LocationName)}>Add</button>
                                                                <button className='btn ms-1' style={{ backgroundColor: '#4BC0C0' }} onClick={() => handleViewCumulativeClick(elem.Remarks, elem.SpecialRequests)}>View</button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                                {report && (
                                                    <tr style={{ backgroundColor: "#f0f0f0", fontWeight: "bold", textAlign: 'end' }}>
                                                        <td>Total: </td>
                                                        <td>{report.reduce((acc, elem) => acc + (isNaN(parseInt(elem.ScannedFiles)) ? 0 : parseInt(elem.ScannedFiles)), 0).toLocaleString()}</td>
                                                        <td>{report.reduce((acc, elem) => acc + (isNaN(parseInt(elem.ScannedImages)) ? 0 : parseInt(elem.ScannedImages)), 0).toLocaleString()}</td>
                                                        <td>{report.reduce((acc, elem) => acc + (isNaN(parseInt(elem.QCFiles)) ? 0 : parseInt(elem.QCFiles)), 0).toLocaleString()}</td>
                                                        <td>{report.reduce((acc, elem) => acc + (isNaN(parseInt(elem.QCImages)) ? 0 : parseInt(elem.QCImages)), 0).toLocaleString()}</td>
                                                        <td>{report.reduce((acc, elem) => acc + (isNaN(parseInt(elem.CBSLQAFiles)) ? 0 : parseInt(elem.CBSLQAFiles)), 0).toLocaleString()}</td>
                                                        <td>{report.reduce((acc, elem) => acc + (isNaN(parseInt(elem.CBSLQAImages)) ? 0 : parseInt(elem.CBSLQAImages)), 0).toLocaleString()}</td>
                                                        <td>{report.reduce((acc, elem) => acc + (isNaN(parseInt(elem.ApprovedFiles)) ? 0 : parseInt(elem.ApprovedFiles)), 0).toLocaleString()}</td>
                                                        <td>{report.reduce((acc, elem) => acc + (isNaN(parseInt(elem.ApprovedImages)) ? 0 : parseInt(elem.ApprovedImages)), 0).toLocaleString()}</td>
                                                        <td></td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isAddDailyModalOpen && (
                <AddDailyRemarksModal
                    locationName={selectedLocation}
                    remarks={dailyRemarks}
                    setRemarks={setDailyRemarks}
                    specialRequests={specialRequests}
                    setSpecialRequests={setSpecialRequests}
                    onSave={handleAddDailyRemarks}
                    onClose={() => setIsAddDailyModalOpen(false)}
                />
            )}
            {isAddCumulativeModalOpen && (
                <AddCumulativeRemarksModal
                    locationName={selectedLocation}
                    remarks={cumulativeRemarks}
                    setRemarks={setCumulativeRemarks}
                    specialRequests={specialRequests}
                    setSpecialRequests={setSpecialRequests}
                    onSave={handleAddCumulativeRemarks}
                    onClose={() => setIsAddCumulativeModalOpen(false)}
                />
            )}

            {isViewDailyModalOpen && (
                <ViewDailyRemarksModal
                    remarks={dailyRemarks}
                    special_requests={dailySpecialRequests}
                    onClose={() => setIsViewDailyModalOpen(false)}
                />
            )}
            {isViewCumulativeModalOpen && (
                <ViewCumulativeRemarksModal
                    remarks={cumulativeRemarks}
                    special_requests={cumulativeSpecialRequests}
                    onClose={() => setIsViewCumulativeModalOpen(false)}
                />
            )}
        </>
    )
}

const AddDailyRemarksModal = ({ remarks, setRemarks, specialRequests, setSpecialRequests, onSave, onClose }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Add Remarks</h2>
                <label>Remarks:</label>
                <textarea
                    placeholder="Remarks"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                />
                <label className='mt-2'>Special Requests:</label>
                <textarea
                    placeholder="Special Requests"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                />
                <div className='mt-2 d-flex justify-content-between align-items-end'>
                    <button className='btn add-btn ms-0' onClick={onSave}>Save</button>
                    <button className='btn add-btn' onClick={onClose} style={{ backgroundColor: 'red' }}>Close</button>
                </div>
            </div>
        </div>
    );
};
const AddCumulativeRemarksModal = ({ remarks, setRemarks, specialRequests, setSpecialRequests, onSave, onClose }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Add Remarks</h2>
                <label>Remarks:</label>
                <textarea
                    placeholder="Remarks"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                />
                <label className='mt-2'>Special Requests:</label>
                <textarea
                    placeholder="Special Requests"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                />
                <div className='mt-2 d-flex justify-content-between align-items-end'>
                    <button className='btn add-btn ms-0' onClick={onSave}>Save</button>
                    <button className='btn add-btn' onClick={onClose} style={{ backgroundColor: 'red' }}>Close</button>
                </div>
            </div>
        </div>
    );
};

// Modal component for viewing remarks
const ViewDailyRemarksModal = ({ remarks, onClose, special_requests }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <h2>View Remarks</h2>
                <p><b>Remarks:</b> {remarks}</p>
                <p><b>Special Requests:</b> {special_requests}</p>
                <button className='btn add-btn ms-0' style={{ backgroundColor: 'red' }} onClick={onClose}>Close</button>
            </div>
        </div>
    );
};
const ViewCumulativeRemarksModal = ({ remarks, onClose, special_requests }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <h2>View Remarks</h2>
                <p>Remarks: {remarks}</p>
                <p>Special Requests: {special_requests}</p>
                <button className='btn add-btn ms-0' style={{ backgroundColor: 'red' }} onClick={onClose}>Close</button>
            </div>
        </div>
    );
};


export default AddRemarks