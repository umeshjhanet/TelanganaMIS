import React, { useEffect, useState } from 'react'
import Header from './Components/Header'
import axios from 'axios';
import { API_URL } from './Api';
import Chart from 'react-apexcharts';
import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import { format, sub } from "date-fns";
import { MdDownload } from 'react-icons/md';
import { IoDownload } from 'react-icons/io5';

const ClientDPR = () => {
    const [isLoading, setIsLoading] = useState('false');
    const [tableData, setTableData] = useState();
    const [error, setError] = useState('false');
    const currentDate = new Date();
    const yesterdayDate = sub(currentDate, { days: 1 });
    const formattedCurrentDate = format(currentDate, "dd-MM-yyyy");
    const formattedYesterdayDate = format(yesterdayDate, "dd-MM-yyyy");
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
        const fetchTableData = async () => {
            try {
                let apiUrl = `${API_URL}/clientreporttable`;
                setIsLoading(true);
                const response = await axios.get(apiUrl);
                console.log("API Response:", response.data); // Log the API response
                setTableData(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching report data:", error);
                setError("Error fetching report data. Please try again.");
                setIsLoading(false);
            }
        };
        const fetchGraphData = () => {
            axios
                .get(`${API_URL}/clientreportgraph`)
                .then((response) => {
                    const apiData = response.data;

                    // Format ScanDate to remove time and use only the date
                    const labels = apiData.map((item) =>
                        new Date(item["ScanDate"]).toISOString().split('T')[0]
                    );
                    const data = apiData.map((item) => item["ScannedImages"]);

                    console.log("Labels (dates only):", labels);
                    console.log("Images:", data);

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
        fetchTableData();
        fetchGraphData();
    }, []);

    const formatChartData = (data, colors) => ({
        options: {
            chart: {
                toolbar: {
                    show: false,
                },
                stacked: false,
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: -15,
                colors: ["transparent"],
            },
            legend: {
                show: true,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: "30%",
                    borderRadius: 2,
                },
            },
            colors: colors,
            xaxis: {
                categories: data.labels,
            },
            responsive: [
                {
                    breakpoint: 1024,
                    options: {
                        plotOptions: {
                            bar: {
                                columnWidth: "30%",
                                borderRadius: 7,
                            },
                        },
                    },
                },
            ],
        },
        series: [
            {
                name: data.datasets[0].label,
                data: data.datasets[0].data,
            },
        ],
    });
    const exportDistrictCourtData = () => {
        const headers = [
            "Location",
            `Scanned Files (${formattedYesterdayDate})`,
            `Scanned Images (${formattedYesterdayDate})`,
            "Cumulative Scanned Files",
            "Cumulative Scanned Images",
            "Remarks",
        ];
    
        // Prepare rows
        const rows = tableData.map(elem => [
            elem.LocationName || "N/A",
            isNaN(parseInt(elem.ScannedFilesYesterday))
                ? "0"
                : parseInt(elem.ScannedFilesYesterday).toLocaleString(),
            isNaN(parseInt(elem.ScannedImagesYesterday))
                ? "0"
                : parseInt(elem.ScannedImagesYesterday).toLocaleString(),
            isNaN(parseInt(elem.TotalScannedFiles))
                ? "0"
                : parseInt(elem.TotalScannedFiles).toLocaleString(),
            isNaN(parseInt(elem.TotalScannedImages))
                ? "0"
                : parseInt(elem.TotalScannedImages).toLocaleString(),
            elem.Remarks || "N/A",
        ]);
    
        // Compute totals
        const totalRow = [
            "Total",
            tableData.reduce((acc, elem) => acc + (parseInt(elem.ScannedFilesYesterday) || 0), 0).toLocaleString(),
            tableData.reduce((acc, elem) => acc + (parseInt(elem.ScannedImagesYesterday) || 0), 0).toLocaleString(),
            tableData.reduce((acc, elem) => acc + (parseInt(elem.TotalScannedFiles) || 0), 0).toLocaleString(),
            tableData.reduce((acc, elem) => acc + (parseInt(elem.TotalScannedImages) || 0), 0).toLocaleString(),
            "N/A", // Remarks column for total row
        ];
    
        // Append total row to rows
        rows.push(totalRow);
    
        // Trigger download
        downloadCSV(headers, rows, "Telangana_District_Court_Data.csv");
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

    const Loader = () => (
        <div className="loader-overlay">
            <div className="loader"></div>
        </div>
    );
    return (
        <>
            {isLoading && <Loader />}
            <Header />
            <div className={`container-fluid mb-4 ${isLoading ? 'blur' : ''}`}>
                <div className="row">
                    <div className="col-lg-2 col-md-0 "></div>
                    <div className="col-lg-10 col-md-12 col-sm-12">
                        <div className="row mt-2 me-1">
                            <h4 className="text-center">Client Report</h4>
                        </div>
                        <div className='row mt-1 me-1'>
                            <div className='table-card' style={{ marginBottom: "0px" }}>
                                <div className='row' style={{ padding: "5px", backgroundColor: "#4BC0C0", paddingTop: "15px" }}>
                                    <div className='col-10'><h6 style={{ color: 'white' }}>Telangana District Court</h6></div>
                                    <div className='col-2'>
                                        <button
                                            className="btn btn-light" style={{ marginTop: '-10px' }}
                                            onClick={() => exportDistrictCourtData()}
                                        >
                                            Export to CSV
                                        </button>
                                    </div>
                                </div>
                                <div className="row ms-2 me-2" style={{ height: '500px', overflowX: "auto" }}>
                                    <table className="table table-hover table-bordered table-responsive data-table">
                                        <thead style={{ color: "#4bc0c0", fontWeight: '300', textAlign: 'center' }}>
                                            <tr>
                                                <th rowSpan="2" style={{ whiteSpace: 'nowrap', verticalAlign: 'middle', width: '150px' }}>
                                                    Location
                                                </th>
                                                <th colSpan="2" style={{ verticalAlign: 'middle', width: '150px' }}>
                                                    Scanned Images ({formattedYesterdayDate})
                                                </th>
                                                <th colSpan="2" style={{ verticalAlign: 'middle', width: '150px' }}>
                                                    Cumulative Scanned Images
                                                </th>
                                                <th rowSpan="2" style={{ whiteSpace: 'nowrap', verticalAlign: 'middle', width: '150px' }}>Remarks</th>
                                            </tr>
                                            <tr style={{ color: "#4BC0C0", fontWeight: '300' }}>
                                                <th>Files</th>
                                                <th>Images</th>
                                                <th>Files</th>
                                                <th>Images</th>
                                            </tr>
                                        </thead>
                                        <tbody className="scrollable" style={{ height: "80px" }}>
                                            {tableData && tableData.map((elem, index) => (
                                                <tr key={index} style={{ backgroundColor: "white" }}>
                                                    <td style={{ whiteSpace: 'nowrap', textAlign: 'left' }}>{elem.LocationName}</td>
                                                    <td>{isNaN(parseInt(elem.ScannedFilesYesterday)) ? "0" : parseInt(elem.ScannedFilesYesterday).toLocaleString()}</td>
                                                    <td>{isNaN(parseInt(elem.ScannedImagesYesterday)) ? "0" : parseInt(elem.ScannedImagesYesterday).toLocaleString()}</td>
                                                    <td>{isNaN(parseInt(elem.TotalScannedFiles)) ? "0" : parseInt(elem.TotalScannedFiles).toLocaleString()}</td>
                                                    <td>{isNaN(parseInt(elem.TotalScannedImages)) ? "0" : parseInt(elem.TotalScannedImages).toLocaleString()}</td>
                                                    <td></td>
                                                </tr>
                                            ))}
                                            {/* Total Row */}
                                            <tr style={{ backgroundColor: "#f1f1f1", fontWeight: 'bold' }}>
                                                <td style={{ whiteSpace: 'nowrap', textAlign: 'left' }}>Total</td>
                                                <td>
                                                    {tableData
                                                        ? tableData.reduce((acc, elem) => acc + (parseInt(elem.ScannedFilesYesterday) || 0), 0).toLocaleString()
                                                        : "0"}
                                                </td>
                                                <td>
                                                    {tableData
                                                        ? tableData.reduce((acc, elem) => acc + (parseInt(elem.ScannedImagesYesterday) || 0), 0).toLocaleString()
                                                        : "0"}
                                                </td>
                                                <td>
                                                    {tableData
                                                        ? tableData.reduce((acc, elem) => acc + (parseInt(elem.TotalScannedFiles) || 0), 0).toLocaleString()
                                                        : "0"}
                                                </td>
                                                <td>
                                                    {tableData
                                                        ? tableData.reduce((acc, elem) => acc + (parseInt(elem.TotalScannedImages) || 0), 0).toLocaleString()
                                                        : "0"}
                                                </td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </div>
                            </div>
                        </div>
                        <div className="row mt-2 me-1">

                            <Card>
                                <CardBody>
                                    <CardTitle tag="h5">SCANNED REPORT OF LAST 15 DAYS </CardTitle>
                                    <Chart
                                        options={formatChartData(monthImage, ["#4BC0C0"]).options}
                                        series={formatChartData(monthImage, ["#4BC0C0"]).series}
                                        type="bar"
                                        height="379"
                                    />
                                </CardBody>
                            </Card>


                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ClientDPR