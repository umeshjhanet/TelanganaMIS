import React, { useEffect, useState } from 'react';
import Header from './Components/Header';
import axios from 'axios';
import { API_URL } from './Api';

const DBSiteReports = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dbServer, setDBServer] = useState([]);
  const [filteredServers, setFilteredServers] = useState([]);
  const [showError, setShowError] = useState(false);
  const [selectedErrorLogs, setSelectedErrorLogs] = useState("");
  const [showServerError, setShowServerError] = useState(false);
  const [selectedServerErrorLogs, setSelectedServerErrorLogs] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [serversPerPage] = useState(10);

  useEffect(() => {
    const fetchServerStatus = () => {
      setIsLoading(true);
      axios
        .get(`${API_URL}/server_status`)
        .then((response) => {
          setDBServer(response.data);
          setFilteredServers(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setIsLoading(false);
        });
    };
    fetchServerStatus();
  }, []);

  useEffect(() => {
    const filteredData = dbServer.filter(server =>
      server.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredServers(filteredData);
  }, [searchQuery, dbServer]);

  const formatSize = (sizeInGB) => {
    const sizeNumber = parseFloat(sizeInGB);
    if (isNaN(sizeNumber)) {
      return "Unknown";
    }
    if (sizeNumber < 1) {
      const sizeInMB = sizeNumber * 1024;
      return `${sizeInMB.toFixed(2)} MB`;
    } else {
      return `${sizeNumber.toFixed(2)} GB`;
    }
  };

  const formatDateTo12Hour = (datetimeString) => {
    const date = new Date(datetimeString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 === 0 ? 12 : hours % 12;
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
    return `${day}-${month}-${year} ${hours12}:${minutesStr} ${period}`;
  };

  const handleShowError = (errorLogs) => {
    setSelectedErrorLogs(errorLogs);
    setShowError(true);
  };
  const handleShowServerError = (errorLogs) => {
    setSelectedServerErrorLogs(errorLogs);
    setShowServerError(true);
  };

  const handleCloseError = () => {
    setShowError(false);
    setSelectedErrorLogs("");
  };
  const handleCloseServerError = () => {
    setShowServerError(false);
    setSelectedServerErrorLogs("");
  };

  const Loader = () => (
    <div className="loader-overlay">
      <div className="loader"></div>
    </div>
  );

  const indexOfLastServer = currentPage * serversPerPage;
  const indexOfFirstServer = indexOfLastServer - serversPerPage;
  const currentServers = filteredServers.slice(indexOfFirstServer, indexOfLastServer);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      {isLoading && <Loader />}
      <Header />
      <div className={`container-fluid mb-5 ${isLoading ? 'blur' : ''}`}>
        <div className="row">
          <div className="col-lg-2 col-md-0"></div>
          <div className="col-lg-10 col-md-12">
            <div className="row mt-4 me-1">
              <div
                className="card"
                style={{ padding: "5px", backgroundColor: "#4bc0c0" }}
              >
                <h6 className="text-center" style={{ color: "white" }}>
                  Server / Database Site Reports
                </h6>
              </div>
            </div>
            <div className="row user-list-card mt-3 mb-5">
              <div className="row">
                <input
                  type='text'
                  style={{ width: '300px', height: '40px' }}
                  placeholder='Search by location name...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className='btn search-btn mb-1' style={{ color: 'white' }}>Search</button>
              </div>
              <div className='server-report'>
                <table className='server-reports table-bordered mt-1 mb-4'>
                  <thead>
                    <tr>
                      <th style={{ whiteSpace: 'nowrap', color: '#4bc0c0' }}>Sr.No</th>
                      <th style={{ whiteSpace: 'nowrap', color: '#4bc0c0' }}>Location Name</th>
                      <th style={{ whiteSpace: 'nowrap', color: '#4bc0c0' }}>Backup Path</th>
                      <th style={{ whiteSpace: 'nowrap', color: '#4bc0c0' }}>Backup Size</th>
                      <th style={{ whiteSpace: 'nowrap', color: '#4bc0c0' }}>Backup Date Time</th>
                      <th style={{ whiteSpace: 'nowrap', color: '#4bc0c0' }}>Free CPU</th>
                      <th style={{ whiteSpace: 'nowrap', color: '#4bc0c0' }}>Free Memory</th>
                      <th style={{ whiteSpace: 'nowrap', color: '#4bc0c0' }}>Error Logs</th>
                      <th style={{ whiteSpace: 'nowrap', color: '#4bc0c0' }}>Server Logs</th>
                      <th style={{ whiteSpace: 'nowrap', color: '#4bc0c0' }}>Server Status</th>
                      <th style={{ whiteSpace: 'nowrap', color: '#4bc0c0' }}>DB Connection</th>
                      <th style={{ whiteSpace: 'nowrap', color: '#4bc0c0' }}>Server IP</th>
                      <th style={{ whiteSpace: 'nowrap', color: '#4bc0c0' }}>Database Log</th>
                      <th style={{ whiteSpace: 'nowrap', color: '#4bc0c0' }}>Slow Query</th>
                      <th style={{ whiteSpace: 'nowrap', color: '#4bc0c0' }}>NA S File Path</th>
                      <th style={{ whiteSpace: 'nowrap', color: '#4bc0c0' }}>NA S File Size</th>
                      <th style={{ whiteSpace: 'nowrap', color: '#4bc0c0' }}>NA S Backup Time</th>
                      <th style={{ whiteSpace: 'nowrap', color: '#4bc0c0' }}>NA S File System</th>
                      <th style={{ whiteSpace: 'nowrap', color: '#4bc0c0' }}>NA S Storage Size</th>
                      <th style={{ whiteSpace: 'nowrap', color: '#4bc0c0' }}>NA S Storage Used</th>
                      <th style={{ whiteSpace: 'nowrap', color: '#4bc0c0' }}>NA S Storage Available</th>
                      <th style={{ whiteSpace: 'nowrap', color: '#4bc0c0' }}>NA S Storage Use Percentage</th>
                      <th style={{ whiteSpace: 'nowrap', color: '#4bc0c0' }}>NA S Mounted On</th>
                      <th style={{ whiteSpace: 'nowrap', color: '#4bc0c0' }}>NA S Latency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentServers.map((elem, index) => {
                      const freeMemory = () => (elem.freeram / elem.totalram) * 100;

                      return (
                        <tr key={index}>
                          <td>{indexOfFirstServer + index + 1}</td>
                          <td>{elem.location}</td>
                          <td style={{ whiteSpace: 'nowrap' }}>{elem.backuppath}</td>
                          <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                            <span
                              style={{
                                backgroundColor: '#4bc0c0',
                                color: 'white',
                                borderRadius: '25px',
                                padding: '2px',
                                fontSize: '12px',
                                fontWeight: 'bold'
                              }}>{formatSize(elem.backupsize)}</span>
                          </td>
                          <td style={{ whiteSpace: 'nowrap' }}>{formatDateTo12Hour(elem.backuptime)}</td>
                          <td style={{ textAlign: 'center' }}><span
                            style={{
                              backgroundColor: '#4bc0c0',
                              color: 'white',
                              borderRadius: '25px',
                              padding: '2px',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}>{elem.cpustatus}%</span></td>
                          <td style={{ textAlign: 'center' }}><span
                            style={{
                              backgroundColor: '#4bc0c0',
                              color: 'white',
                              borderRadius: '25px',
                              padding: '2px',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}>{freeMemory().toFixed(2)}%</span></td>
                          <td>
                            {elem.errorlogs && elem.errorlogs.trim() !== "" && (
                              <button onClick={() => handleShowError(elem.errorlogs)}
                                style={{
                                  backgroundColor: '#4bc0c0',
                                  height: '25px',
                                  width: '100px',
                                  padding: '0px',
                                  border: 'none',
                                  borderRadius: '8px',
                                  color: 'white'
                                }}>Show Error</button>
                            )}
                          </td>
                          <td>
                            {elem.systemLogs && elem.systemLogs.trim() !== "" && (
                              <button onClick={() => handleShowServerError(elem.systemLogs)}
                                style={{
                                  backgroundColor: '#4bc0c0',
                                  height: '25px',
                                  width: '100px',
                                  padding: '0px',
                                  border: 'none',
                                  borderRadius: '8px',
                                  color: 'white'
                                }}>Show Error</button>
                            )}
                          </td>
                          <td style={{ whiteSpace: 'nowrap' }}>{elem.innoDBStatus}</td>
                          <td style={{ whiteSpace: 'nowrap' }}>{elem.max_con}</td>
                          <td style={{ whiteSpace: 'nowrap' }}>{elem.bind_add}</td>
                          <td style={{ whiteSpace: 'nowrap' }}>{elem.general_log}</td>
                          <td style={{ whiteSpace: 'nowrap' }}>{elem.slowQuery}</td>
                          <td style={{ whiteSpace: 'nowrap' }}>{elem.ftpFilePath}</td>
                          <td style={{ whiteSpace: 'nowrap' }}>{formatSize(elem.ftpFileSizeInGB)}</td>
                          <td style={{ whiteSpace: 'nowrap' }}>{formatDateTo12Hour(elem.FTPBackupCreateTime)}</td>
                          <td style={{ whiteSpace: 'nowrap' }}>{elem.filesystems}</td>
                          <td style={{ whiteSpace: 'nowrap' }}>{elem.sizes}</td>
                          <td style={{ whiteSpace: 'nowrap' }}>{elem.used}</td>
                          <td style={{ whiteSpace: 'nowrap' }}>{elem.avail}</td>
                          <td style={{ whiteSpace: 'nowrap' }}>{elem.use_percentage}</td>
                          <td style={{ whiteSpace: 'nowrap' }}>{elem.mounted_on}</td>
                          <td style={{ whiteSpace: 'nowrap' }}>{elem.latencyFromNAS}</td>
                        </tr>
                      );
                    })}

                  </tbody>
                </table>
              </div>
              <div className="row">
                <ul className="pagination justify-content-center">
                  {filteredServers.length > serversPerPage &&
                    Array(Math.ceil(filteredServers.length / serversPerPage))
                      .fill()
                      .map((_, index) => (
                        <li
                          key={index}
                          className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => paginate(index + 1)}
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showError && (
        <div className="modal">
          <div className="modal-content">
            <h2>Database Error Logs</h2>
            <div className='' style={{ border: '1px solid gray', padding: '2px' }}>
              <p>{selectedErrorLogs}</p>
            </div>
            <div className='mt-2' style={{ textAlign: 'end' }}>
              <button onClick={handleCloseError} className="btn btn-success" style={{ width: '100px' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showServerError && (
        <div className="modal">
          <div className="modal-content">
            <h2>Server Error Logs</h2>
            <div className='' style={{ border: '1px solid gray', padding: '2px' }}>
              <p>{selectedServerErrorLogs}</p>
            </div>
            <div className='mt-2' style={{ textAlign: 'end' }}>
              <button onClick={handleCloseServerError} className="btn btn-success" style={{ width: '100px' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DBSiteReports;
