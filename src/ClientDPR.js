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
            <div className={`container-fluid ${isLoading ? 'blur' : ''}`}>
                <div className="row">
                    <div className="col-lg-2 col-md-0 "></div>
                    <div className="col-lg-10 col-md-12 col-sm-12">
                        <div className="row mt-2 me-1">
                            <div className="card" style={{ padding: "5px", backgroundColor: "#4BC0C0" }}>
                                <h6 className="" style={{ color: "white" }}>Dashboard / Client Report</h6>
                            </div>
                        </div>
                        <div className="row mt-3 ms-2 me-2 search-report-card" style={{ height: '500px', overflowX: "auto" }}>
                            
                            <div className='row'>
                                <div className='col-11'><h4 style={{ textAlign: "center" }}>Telangana District Court</h4></div>
                                <div className='col-1'>
                                    <button
                                        className='btn text-end ms-4'
                                        style={{ backgroundColor: '#4BC0C0' }}
                                        onClick={() => exportDistrictCourtData()}
                                    >
                                        <IoDownload style={{ color: 'white' }} />
                                    </button>
                                </div>
                            </div>
                            <table className="table table-hover table-bordered table-responsive data-table" style={{marginTop:'-70px'}}>
                                <thead style={{ color: "#4bc0c0", fontWeight: '300', textAlign: 'center' }}>
                                    <tr>
                                        <th rowSpan="2" style={{ whiteSpace: 'nowrap', verticalAlign: 'middle', width: '150px' }}>
                                            Location
                                        </th>
                                        <th colSpan="2" style={{ verticalAlign: 'middle', width: '150px' }}>
                                            Scanned Images({formattedYesterdayDate})
                                        </th>
                                        <th colSpan="2" style={{ verticalAlign: 'middle', width: '150px' }}>
                                            Cumulative Scanned Images
                                        </th>
                                        <th rowSpan="2" style={{ whiteSpace: 'nowrap', verticalAlign: 'middle', width: '150px' }}>Remarks</th>
                                    </tr>
                                    <tr style={{ color: "black", fontWeight: '300' }}>
                                        <th>Files</th>
                                        <th>Images</th>
                                        <th>Files</th>
                                        <th>Images</th>
                                    </tr>
                                </thead>
                                <tbody className="scrollable" style={{ color: "#4bc0c0", height: "80px" }}>
                                    {tableData && tableData.map((elem, index) => (
                                        <tr key={index} style={{ backgroundColor: "white" }}>
                                            <td style={{ whiteSpace: 'nowrap', textAlign: 'left' }}>{elem.LocationName}</td>
                                            <td>{isNaN(parseInt(elem.ScannedFilesYesterday)) ? "0" : parseInt(elem.ScannedFilesYesterday).toLocaleString()}</td>
                                            <td>{isNaN(parseInt(elem.ScannedImagesYesterday)) ? "0" : parseInt(elem.ScannedImagesYesterday).toLocaleString()}</td>
                                            <td>{isNaN(parseInt(elem.TotalScannedFiles)) ? "0" : parseInt(elem.TotalScannedFiles).toLocaleString()}</td>
                                            <td>{isNaN(parseInt(elem.TotalScannedImages)) ? "0" : parseInt(elem.TotalScannedImages).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="row mt-2">
                            <div className="card">
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
            </div>
        </>
    )
}

export default ClientDPR