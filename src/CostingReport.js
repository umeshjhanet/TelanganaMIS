import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Components/Header';
import { API_URL } from './Api';
import { toast, ToastContainer } from 'react-toastify';

const CostingReport = () => {
    const [salaries, setSalaries] = useState({});
    const [dataMapping, setDataMapping] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showEditable, setShowEditable] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch salaries
                const salaryResponse = await axios.get(`${API_URL}/getSalaries`);
                const salaryData = salaryResponse.data.reduce((acc, row) => {
                    acc[row.head] = row.salary;
                    return acc;
                }, {});

                // Fetch production and manpower data
                const productionResponse = await axios.get(`${API_URL}/fetch-images`);
                const manpowerResponse = await axios.get(`${API_URL}/manpowerused`);

                const production = productionResponse.data;
                const manpower = manpowerResponse.data[0]; // Assuming the first object is used

                // Combine data
                setSalaries(salaryData);
                setDataMapping({
                    'Document Collection & Return': {
                        production: production.data[0]?.inventoryimages,
                        manpower: manpower.Inventory_MP
                    },
                    'Barcoding': {
                        production: production.data[1]?.Barc_TI,
                        manpower: manpower.Barc_MP
                    },
                    'Page Numbering': {
                        production: null,
                        manpower: manpower.Page_No_MP
                    },
                    'Document Preparation': {
                        production: production.data[1]?.Prepare_TI,
                        manpower: manpower.Prepare_MP
                    },
                    'Scanning (6 ADF Scanners Require)': {
                        production: production.data[0]?.scanimages,
                        manpower: manpower.Scan_MP
                    },
                    'Image QC': {
                        production: production.data[0]?.qcimages,
                        manpower: manpower.Image_QC_MP
                    },
                    'Re-scanning / File Cover scanning': {
                        production: production.data[0]?.reScanImages,
                        manpower: manpower.Cover_Page_MP
                    },
                    'Flagging': {
                        production: production.data[0]?.flaggingimages,
                        manpower: manpower.Doc_MP
                    },
                    'Indexing': {
                        production: production.data[0]?.indeximages,
                        manpower: manpower.Index_MP
                    },
                    'CBSL QA': {
                        production: production.data[0]?.cbslqaimages,
                        manpower: manpower.CBSL_QA_MP
                    },
                    'Re-binding': {
                        production: production.data[1]?.Refilling_Files_TI,
                        manpower: manpower.Refilling_Files_MP
                    },
                    'Supervisor': {
                        production: null,
                        manpower: null
                    },
                    'Site Manager': {
                        production: null,
                        manpower: null
                    },
                    'Support Staff(IT & Admin cum HR)': {
                        production: null,
                        manpower: null
                    },
                    'Support Staff(Involve in Client help)': {
                        production: null,
                        manpower: null
                    },
                    'Govt Retired Staff': {
                        production: null,
                        manpower: null
                    },
                    'Security Guard': {
                        production: null,
                        manpower: null
                    },
                    'Project Manager': {
                        production: null,
                        manpower: null
                    },

                });
            } catch (err) {
                setError("Error in fetching data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSalaryChange = (head, value) => {
        setSalaries(prev => ({ ...prev, [head]: value }));
    };

    const saveSalary = async (head) => {
        try {
            const salary = salaries[head];
            await axios.post(`${API_URL}/addSalary`, { head, salary });
            toast.success("Salary saved successfully");
        } catch (err) {
            console.error("Error saving salary:", err);
            toast.error("Failed to save salary");
        }
    };
    const handleEditButton = () => {
        setShowEditable(!showEditable);
    }
   
        const handleDownloadCSV = () => {
            // Initialize totals
            let totalSalary = 0;
            let totalManpower = 0;
            let totalExpense = 0;
            let totalCostPerImage = 0;
            let validCostCount = 0;
    
            // Prepare CSV headers
            const csvRows = [['Head', 'Salary', 'Production', 'Manpower Used', 'Expense', 'Cost per Image']];
    
            // Generate rows and calculate totals
            Object.entries(dataMapping).forEach(([head, { production, manpower }]) => {
                const salary = parseFloat(salaries[head] || 0);
                const manpowerValue = parseFloat(manpower || 0);
                const expense = salary * manpowerValue; // 5th column
                const costPerImage = production ? (expense / production).toFixed(2) : 'N/A'; // 6th column
    
                // Accumulate totals
                totalSalary += salary;
                totalManpower += manpowerValue || 0;
                totalExpense += expense;
                if (production) {
                    totalCostPerImage += expense / production;
                    validCostCount++;
                }
    
                // Add row to CSV
                csvRows.push([
                    head,
                    salary.toFixed(2) || 'N/A',
                    production || 'N/A',
                    manpower || 'N/A',
                    expense.toFixed(2) || 'N/A',
                    costPerImage,
                ]);
            });
    
            // Add totals row
            csvRows.push([
                'Total',
                totalSalary.toFixed(2),
                'N/A',
                totalManpower,
                totalExpense.toFixed(2),
                validCostCount ? (totalCostPerImage / validCostCount).toFixed(2) : 'N/A',
            ]);
    
            // Convert rows to CSV string
            const csvContent = csvRows.map((row) => row.join(',')).join('\n');
    
            // Create a blob and trigger download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'report.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <>
            <ToastContainer />
            <Header />
            <div className="container-fluid mt-2 mb-4">
                <div className="row">
                    <div className="col-2"></div>
                    <div className="col-10">
                        <h4 className='text-center'>Process Wise Costing Report</h4>
                        {showEditable ?
                            <>
                                <div className='search-report-card' style={{ height: 'auto' }}>
                                    <div className='row'>
                                        <div className='col-10'></div>
                                        <div className='col-2'>
                                        <button className='btn add-btn mb-2 ms-4' style={{ width: 'auto' }} onClick={handleEditButton}>Hide Edit</button>
                                        </div>
                                    </div>
                                    <table className="table table-hover table-bordered table-responsive data-table">
                                        <thead style={{ color: '#4BC0C0' }}>
                                            <tr>
                                                <th>Head</th>
                                                <th>Salary</th>
                                                <th>Production</th>
                                                <th>Manpower Used</th>
                                                <th>Expense</th>
                                                <th>Cost per Image</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(() => {
                                                // Initialize totals
                                                let totalSalary = 0;
                                                let totalManpower = 0;
                                                let totalExpense = 0;
                                                let totalCostPerImage = 0;
                                                let validCostCount = 0;

                                                const rows = Object.entries(dataMapping).map(([head, { production, manpower }]) => {
                                                    const salary = parseFloat(salaries[head] || 0);
                                                    const expense = salary * (manpower || 0); // 5th column
                                                    const costPerImage = production ? (expense / production).toFixed(2) : 'N/A'; // 6th column
                                                    const manpowerValue = parseFloat(manpower || 0);
                                                    // Accumulate totals
                                                    totalSalary += salary;
                                                    totalManpower += manpowerValue || 0;
                                                    totalExpense += expense;
                                                    if (production) {
                                                        totalCostPerImage += expense / production;
                                                        validCostCount++;
                                                    }

                                                    return (
                                                        <tr key={head}>
                                                            <td style={{ textAlign: "left" }}>{head}</td>
                                                            <td style={{ textAlign: 'left' }}>
                                                                <input
                                                                    type="number"
                                                                    value={salaries[head] || ''}
                                                                    onChange={(e) => handleSalaryChange(head, e.target.value)}
                                                                    style={{ width: "100px" }}
                                                                />
                                                                <button
                                                                    className="btn btn-primary btn-sm ms-2"
                                                                    onClick={() => saveSalary(head)}
                                                                >
                                                                    Save
                                                                </button>
                                                            </td>
                                                            <td>{production || 'N/A'}</td>
                                                            <td>{manpower || 'N/A'}</td>
                                                            <td>{expense.toFixed(2) || 'N/A'}</td>
                                                            <td>{costPerImage}</td>
                                                        </tr>
                                                    );
                                                });

                                                // Add totals row
                                                rows.push(
                                                    <tr key="totals" style={{ fontWeight: "bold", backgroundColor: "#f9f9f9" }}>
                                                        <td>Total</td>
                                                        <td>{totalSalary.toFixed(2)}</td>
                                                        <td></td>
                                                        <td>{totalManpower}</td>
                                                        <td>{totalExpense.toFixed(2)}</td>
                                                        <td>{validCostCount ? (totalCostPerImage / validCostCount).toFixed(2) : 'N/A'}</td>
                                                    </tr>
                                                );

                                                return rows;
                                            })()}
                                        </tbody>

                                    </table>
                                </div>
                            </> :
                            <>
                                <div className='search-report-card' style={{ height: 'auto' }}>
                                    <div className='row'>
                                        <div className='col-10'></div>
                                        <div className='col-1'>
                                        <button className='btn add-btn' style={{ width: 'auto' }} onClick={handleDownloadCSV}>Export</button>
                                        </div>
                                        <div className='col-1'>
                                        <button className='btn add-btn mb-2 ms-1 me-0' style={{ width: 'auto' }} onClick={handleEditButton}>Edit</button>   
                                        </div>
                                    </div>
                                    <table className="table table-hover table-bordered table-responsive data-table">
                                        <thead style={{ color: '#4BC0C0' }}>
                                            <tr>
                                                <th>Head</th>
                                                <th>Salary</th>
                                                <th>Production</th>
                                                <th>Manpower Used</th>
                                                <th>Expense</th>
                                                <th>Cost per Image</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(() => {
                                                // Initialize totals
                                                let totalSalary = 0;
                                                let totalManpower = 0;
                                                let totalExpense = 0;
                                                let totalCostPerImage = 0;
                                                let validCostCount = 0;

                                                const rows = Object.entries(dataMapping).map(([head, { production, manpower }]) => {
                                                    const salary = parseFloat(salaries[head] || 0);
                                                    const expense = salary * (manpower || 0); // 5th column
                                                    const costPerImage = production ? (expense / production).toFixed(2) : 'N/A'; // 6th column
                                                    const manpowerValue = parseFloat(manpower || 0);
                                                    // Accumulate totals
                                                    totalSalary += salary;
                                                    totalManpower += manpowerValue || 0;
                                                    totalExpense += expense;
                                                    if (production) {
                                                        totalCostPerImage += expense / production;
                                                        validCostCount++;
                                                    }

                                                    return (
                                                        <tr key={head}>
                                                            <td style={{ textAlign: "left" }}>{head}</td>
                                                            <td>{salaries[head] || "N/A"}</td>
                                                            <td>{production || 'N/A'}</td>
                                                            <td>{manpower || 'N/A'}</td>
                                                            <td>{expense.toFixed(2) || 'N/A'}</td>
                                                            <td>{costPerImage}</td>
                                                        </tr>
                                                    );
                                                });

                                                // Add totals row
                                                rows.push(
                                                    <tr key="totals" style={{ fontWeight: "bold", backgroundColor: "#f9f9f9" }}>
                                                        <td>Total</td>
                                                        <td>{totalSalary.toFixed(2)}</td>
                                                        <td></td>
                                                        <td>{totalManpower}</td>
                                                        <td>{totalExpense.toFixed(2)}</td>
                                                        <td>{validCostCount ? (totalCostPerImage / validCostCount).toFixed(2) : 'N/A'}</td>
                                                    </tr>
                                                );

                                                return rows;
                                            })()}
                                        </tbody>
                                    </table>
                                </div>
                            </>}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CostingReport;

