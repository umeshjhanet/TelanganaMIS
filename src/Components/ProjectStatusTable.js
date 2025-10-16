// File: ProjectStatusTable.js

import React from 'react';
import { MdFileDownload } from "react-icons/md";

const ProjectStatusTable = ({
  tableData = [],
  columnSums = {},
  formattedPreviousDate,
  formattedYesterdayDate,
  formattedCurrentDate,
  showFormatDropdown,
  handleExport,
  showConfirmation,
  exportTableFormat,
  handleTableDropdownChange,
  downloadAllFormatsSummary,
  handleCancelExport
}) => (
  
    <div className="table-card">
      {/* HEADER */}
      <div className="row" style={{ padding: "5px", backgroundColor: "#4BC0C0", paddingTop: "15px" }}>
        <div className="col-10">
          <h6 className="text-center" style={{ color: "white" }}>
            PROJECT UPDATE OF SCANNING AND DIGITIZATION OF CASE RECORDS FOR DISTRICT COURT OF TELANGANA
          </h6>
        </div>
        <div className="col-2">
          <h6 style={{ color: "white", cursor: "pointer" }} onClick={handleExport}>
            <MdFileDownload style={{ fontSize: "20px" }} />
            Export
          </h6>
        </div>
        {showFormatDropdown &&
          <div style={{ height: '0px', overflow: 'visible', display: 'flex', justifyContent: 'right' }}>
            <div className="export-dropdown-card">
              <p onClick={() => handleTableDropdownChange('csv')}>CSV</p>
              <p onClick={() => handleTableDropdownChange('excel')}>Excel</p>
              <p onClick={() => handleTableDropdownChange('pdf')}>PDF</p>
            </div>
          </div>
        }
        {showConfirmation &&
          <div className="confirmation-dialog">
            <div className="confirmation-content">
              <p className="fw-bold">Are you sure you want to export the {exportTableFormat.toUpperCase()} file?</p>
              <button className="btn btn-success mt-3 ms-5" onClick={downloadAllFormatsSummary}>Yes</button>
              <button className="btn btn-danger ms-3 mt-3" onClick={handleCancelExport}>No</button>
            </div>
          </div>
        }
      </div>
      {/* TABLE */}
      <div className="row mt-5 ms-2 me-2" style={{ overflowX: "auto" }}>
        <table className="table table-hover table-bordered table-responsive data-table">
          <thead style={{ color: "#4BC0C0" }}>
            <tr>
              <th rowSpan="2" style={{ verticalAlign: 'middle' }}>Sr. No.</th>
              <th rowSpan="2" style={{ verticalAlign: 'middle' }}>Location</th>
              <th colSpan="2">Scanned ({formattedPreviousDate})</th>
              <th colSpan="2">Scanned ({formattedYesterdayDate})</th>
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
            {tableData.map((elem, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td style={{ textAlign: 'left' }}>{elem.LocationName}</td>
                <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.Prev_Files)) ? 0 : parseInt(elem.Prev_Files).toLocaleString()}</td>
                <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.Prev_Images)) ? 0 : parseInt(elem.Prev_Images).toLocaleString()}</td>
                <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.Yes_Files)) ? 0 : parseInt(elem.Yes_Files).toLocaleString()}</td>
                <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.Yes_Images)) ? 0 : parseInt(elem.Yes_Images).toLocaleString()}</td>
                <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.Today_Files)) ? 0 : parseInt(elem.Today_Files).toLocaleString()}</td>
                <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.Today_Images)) ? 0 : parseInt(elem.Today_Images).toLocaleString()}</td>
                <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.Total_Files)) ? 0 : parseInt(elem.Total_Files).toLocaleString()}</td>
                <td style={{ textAlign: 'end' }}>{isNaN(parseInt(elem.Total_Images)) ? 0 : parseInt(elem.Total_Images).toLocaleString()}</td>
              </tr>
            ))}
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
);

export default ProjectStatusTable;
