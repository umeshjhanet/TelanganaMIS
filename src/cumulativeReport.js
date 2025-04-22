import React, { useEffect, useState } from 'react'
import Header from './Components/Header'
import { MdFileDownload } from 'react-icons/md'
import axios from 'axios';
import { API_URL } from './Api';
import DatePicker from "react-datepicker";
import { format, sub } from "date-fns";
import Papa from "papaparse";

const CumulativeReport = () => {
    const currentDate = new Date();
    const yesterdayDate = sub(currentDate, { days: 1 });
    const previousDate = sub(currentDate, { days: 2 });
    const formattedCurrentDate = format(currentDate, "dd-MM-yyyy");
    const formattedYesterdayDate = format(yesterdayDate, "dd-MM-yyyy");
    const formattedPreviousDate = format(previousDate, "dd-MM-yyyy");
    const [cumulative, setCumulative] = useState([]);
    const [target, setTarget] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const fetchCumulative = async () => {
        try {
            const params = {};
            if (selectedDate) {
                params.date = selectedDate;
            }
            const response = await axios.get(`${API_URL}/manpowerData`, { params });
            setCumulative(response.data.result); // Only set the array
        } catch {
            console.log("Error fetching cumulative data");
        }
    };
    useEffect(() => {
        const fetchTarget = async () => {
            try {
                const response = await axios.get(`${API_URL}/mptarget`);
                setTarget(response.data);
            } catch {
                console.log("Error fetching target data");
            }
        };
        const fetchData = async () => {
            setIsLoading(true);  // ✅ Set loading before fetching
            await Promise.all([fetchCumulative(), fetchTarget()]); // ✅ Wait for both requests
            setIsLoading(false); // ✅ Only set false after both complete
        };
        fetchData();
    }, []);

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
            "Differences B/W Target & Achieved"
        ];
    
        const data = [];
    
        if (Array.isArray(cumulative)) {
            cumulative.forEach(elem => {
                const process = elem.process;
                const present = parseFloat(elem.Present) || 0;
                const files = parseFloat(elem.files) || 0;
                const images = parseFloat(elem.images) || 0;
    
                const targetObj = target.find(t => t.process_name === process);
                const targetValue = targetObj ? parseFloat(targetObj.target) : "-";
    
                // Calculate average
                let average = "-";
                if (present > 0) {
                    average = images > 0 ? (images / present).toFixed(2) : (files / present).toFixed(2);
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
                    difference
                ]);
            });
    
            // Total Row
            const totalManpower = cumulative.reduce((sum, elem) => sum + (parseFloat(elem.Present) || 0), 0);
            const totalFiles = cumulative.reduce((sum, elem) => sum + (parseFloat(elem.files) || 0), 0);
            const totalImages = cumulative.reduce((sum, elem) => sum + (parseFloat(elem.images) || 0), 0);
            const totalTarget = cumulative.reduce((sum, elem) => {
                const t = target.find(x => x.process_name === elem.process);
                return sum + (t ? parseFloat(t.target) || 0 : 0);
            }, 0);
    
            data.push([
                "Total",
                totalManpower,
                totalFiles,
                totalImages,
                totalTarget || "-",
                "-",
                "-"
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
            ? Object.values(cumulative.manpowerData).reduce((sum, val) => sum + (parseInt(val) || 0), 0)
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
                cumulative.scannedData.total_cbslqafiles
            ]
            : [];

        const barcodingFiles = cumulative?.barcodingData
            ? [
                cumulative.barcodingData.total_barcodingfiles,
                cumulative.barcodingData.preparefiles,
                cumulative.barcodingData.refillingfiles,
                cumulative.barcodingData.invoutfiles
            ]
            : [];

        return [...scannedFiles, ...barcodingFiles]
            .reduce((sum, val) => sum + (parseInt(val) || 0), 0) || "-";
    };

    // ✅ Function to calculate total images
    const getTotalImages = () => {
        const scannedImages = cumulative?.scannedData
            ? [
                cumulative.scannedData.total_scanimages,
                cumulative.scannedData.total_qcimages,
                cumulative.scannedData.total_flaggingimages,
                cumulative.scannedData.total_indeximages,
                cumulative.scannedData.total_cbslqaimages
            ]
            : [];

        const barcodingImages = cumulative?.barcodingData
            ? [
                cumulative.barcodingData.prepareimages,
                cumulative.barcodingData.refillingimages
            ]
            : [];

        return [...scannedImages, ...barcodingImages]
            .reduce((sum, val) => sum + (parseInt(val) || 0), 0) || "-";
    };
    return (
        <>
            {isLoading && <Loader />}
            <Header />
            <div className={`container-fluid`}>
                <div className="row">
                    <div className="col-lg-2 col-md-2 "></div>
                    <div className="col-lg-10 col-md-10 col-sm-12">
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
                                        />
                                    </div>
                                    <div className="col-3 mt-1">
                                        <button className="btn add-btn" onClick={handleDateFilter}>Submit</button>
                                    </div>
                                </div>
                                <div className='row ms-1'>
                                    <div className='col-10'>
                                        <h5 className="mt-2">
                                            Telangana - Process & Manpower Detailed Summary: <span style={{ color: '#AC1754' }}>{!selectedDate ? formattedYesterdayDate : new Date(selectedDate).toLocaleDateString('en-GB')}</span>
                                        </h5>
                                    </div>
                                    <div className='col-2'>
                                        <button className='btn add-btn' onClick={exportToCSV} style={{ marginLeft: '0px' }}><MdFileDownload /> Export CSV</button>
                                    </div>
                                </div>
                                <div
                                    className="row mt-3 ms-2 me-2"
                                    style={{ overflowX: "auto", maxHeight: '500px' }}
                                >
                                    <table class="table table-hover table-bordered table-responsive date-table" style={{ zIndex: '0' }}>
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

                                                const average = present > 0
                                                    ? (images > 0 ? images / present : files / present)
                                                    : 0;

                                                const difference = (targetValue > 0 && average > 0)
                                                    ? (average / targetValue) * 100
                                                    : "-";

                                                // Color coding style logic
                                                let differenceStyle = {};
                                                if (difference !== "-") {
                                                    const diffValue = parseFloat(difference);
                                                    if (diffValue <= 90) differenceStyle = { backgroundColor: "red", color: "white" };
                                                    else if ((diffValue > 90 && diffValue < 99)) {
                                                        differenceStyle = { backgroundColor: "yellow" };
                                                    }
                                                    else if (diffValue >= 100) differenceStyle = { backgroundColor: "green", color: "white" };
                                                }

                                                return (
                                                    <tr key={index}>
                                                        <td>{elem.process}</td>
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
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default CumulativeReport

