import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Components/Header';
import { API_URL } from './Api';
import { IoDownload } from 'react-icons/io5';
import { format, sub } from "date-fns";
import { ToastContainer, toast } from 'react-toastify';

const FollowUpReportForm = ({ showSideBar }) => {
    const [followupData, setFollowupData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const currentDate = new Date();
    const yesterdayDate = sub(currentDate, { days: 1 });
    const formattedCurrentDate = format(currentDate, "dd-MM-yyyy");
    const formattedYesterdayDate = format(yesterdayDate, "dd-MM-yyyy");

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const [formData, setFormData] = useState({
        startDate: '',
        name: '',
        description: '',
        responsible_person: '',
        remarks: '',
        status_as_on_date: '',
        work_status: 0,
        endDate: '',
    });

    const fetchFollowupData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_URL}/follow_up_data`);
            setFollowupData(response.data);
        } catch (err) {
            setError('Error fetching report data. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFollowupData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.startDate || !formData.description || !formData.endDate) {
            toast.error("Please enter start date, description and end date");
        }
        try {
            const formattedData = {
                ...formData,
                startDate: format(new Date(formData.startDate), "yyyy-MM-dd"),
                endDate: formData.endDate ? format(new Date(formData.endDate), "yyyy-MM-dd") : null,
            };
            await axios.post(`${API_URL}/follow-up-report`, formattedData);
            toast.success('Report added successfully');
            fetchFollowupData();
            setFormData({
                startDate: '',
                name: '',
                description: '',
                responsible_person: '',
                remarks: '',
                status_as_on_date: '',
                work_status: 0,
                endDate: '',
            });
        } catch (error) {
            toast.error('Failed to add report');
        }
    };

    const handleEditClick = (record) => {
        setSelectedRecord({ ...record });
        setIsEditModalOpen(true);
    };

    const handleUpdate = async () => {
        try {
            const formattedRecord = {
                ...selectedRecord,
                startDate: format(new Date(selectedRecord.startDate), "yyyy-MM-dd"),
                endDate: selectedRecord.endDate ? format(new Date(selectedRecord.endDate), "yyyy-MM-dd") : null,
            };

            // Send PUT request to update the record
            await axios.put(`${API_URL}/follow-up-report/${selectedRecord.id}`, formattedRecord);

            toast.success('Record updated successfully');
            setIsEditModalOpen(false);
            fetchFollowupData(); // Refresh data after updating
        } catch (error) {
            console.error("Error updating record:", error);
            toast.error('Failed to update record');
        }
    };




    const exportFollowUpData = () => {
        const headers = [
            "Sr. No.",
            "Issue Raise Date",
            "Discussion Point",
            "Description",
            "Responsibility",
            "Remarks",
            "Status as on Date",
            "Status",
            "Timeline",
        ];

        const rows = followupData.map((elem, index) => [
            index + 1,
            elem.startDate ? format(new Date(elem.startDate), "yyyy-MM-dd") : "N/A",
            elem.name || "N/A",
            elem.description || "N/A",
            elem.responsible_person || "N/A",
            elem.remarks || "N/A",
            elem.status_as_on_date || "N/A",
            ["Pending", "In Progress", "Completed"][elem.work_status] || "N/A",
            elem.endDate ? format(new Date(elem.endDate), "yyyy-MM-dd") : "N/A",
        ]);

        downloadCSV(headers, rows, "Follow_Up_Report.csv");
    };

    const downloadCSV = (headers, rows, filename) => {
        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(item => `"${item}"`).join(",")),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <>

            <div className='container-fluid mt-2 mb-5'>
                <div className='row'>
                    <div className={`${showSideBar ? 'col-lg-1 col-md-0' : 'col-lg-2 col-md-0'} d-none d-lg-block`}></div>
                    <div className={`${showSideBar ? 'col-lg-11 col-md-12' : 'col-lg-10 col-md-12 '} col-sm-12`}>

                        <h4 className='text-center'>Follow-Up Form</h4>
                        <div className='follow_up-form mt-4'>
                            <form onSubmit={handleSubmit}>
                                <div className='row mt-2'>
                                    <div className='col-4'>
                                        <label>Start Date:</label>
                                    </div>
                                    <div className='col-6'>
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className='row mt-2'>
                                    <div className='col-4'>
                                        <label>Discussion Point:</label>
                                    </div>
                                    <div className='col-6'>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className='row mt-2'>
                                    <div className='col-4'>
                                        <label>Description:</label>
                                    </div>
                                    <div className='col-6'>
                                        <textarea
                                            type="textarea"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className='row mt-2'>
                                    <div className='col-4'>
                                        <label>Responsible Person:</label>
                                    </div>
                                    <div className='col-6'>
                                        <input
                                            type="text"
                                            name="responsible_person"
                                            value={formData.responsible_person}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className='row mt-2'>
                                    <div className='col-4'>
                                        <label>Remarks:</label>
                                    </div>
                                    <div className='col-6'>
                                        <textarea
                                            type="textarea"
                                            name="remarks"
                                            value={formData.remarks}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className='row mt-2'>
                                    <div className='col-4'>
                                        <label>Status as on Date:</label>
                                    </div>
                                    <div className='col-6'>
                                        <input
                                            type="date"
                                            name="status_as_on_date"
                                            value={formData.status_as_on_date}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className='row mt-2'>
                                    <div className='col-4'>
                                        <label>Work Status:</label>
                                    </div>
                                    <div className='col-6'>
                                        <select
                                            name="work_status"
                                            value={formData.work_status}
                                            onChange={handleChange}
                                        >
                                            <option value={0}>Pending</option>
                                            <option value={1}>In Progress</option>
                                            <option value={2}>Completed</option>
                                        </select>
                                    </div>
                                </div>
                                <div className='row mt-2'>
                                    <div className='col-4'>
                                        <label>Expected End Date:</label>
                                    </div>
                                    <div className='col-6'>
                                        <input
                                            type="date"
                                            name="endDate"
                                            value={formData.endDate}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className='row mt-2'>
                                    <div className='col-4'>
                                        <button type="submit" className='btn add-btn' style={{ marginLeft: '0px' }}>Submit</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className='row mt-2 me-1'>
                            <div className='table-card' style={{ marginBottom: "0px" }}>
                                <div className='row' style={{ padding: "5px", backgroundColor: "#4BC0C0", paddingTop: "15px" }}>
                                    <div className='col-10'><h6 style={{ color: 'white' }}>Follow Up Report</h6></div>
                                    <div className='col-2'>
                                        <button
                                            className="btn btn-light" style={{ marginTop: '-10px' }}
                                            onClick={exportFollowUpData}
                                        >
                                            Export to CSV
                                        </button>
                                    </div>
                                </div>
                                <div className="row ms-2 me-2" style={{ overflowX: "auto" }}>
                                    <table className="table table-hover table-bordered table-responsive data-table">
                                        <thead style={{ color: '#4BC0C0' }}>
                                            <tr>
                                                <th>Sr. No.</th>
                                                <th>Issue Raise Date</th>
                                                <th>Discussion Point</th>
                                                <th>Description</th>
                                                <th>Responsibility</th>
                                                <th>Remarks</th>
                                                <th>Status as on Date</th>
                                                <th>Status</th>
                                                <th>Timeline</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {followupData.map((elem, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{format(new Date(elem.startDate), "yyyy-MM-dd")}</td>
                                                    <td>{elem.name}</td>
                                                    <td>{elem.description}</td>
                                                    <td>{elem.responsible_person}</td>
                                                    <td>{elem.remarks}</td>
                                                    <td>{elem.status_as_on_date}</td>
                                                    <td>{["Pending", "In Progress", "Completed"][elem.work_status]}</td>
                                                    <td>{elem.endDate ? format(new Date(elem.endDate), "yyyy-MM-dd") : "N/A"}</td>
                                                    <td>
                                                        <button className='btn add-btn' style={{ width: "60px" }} onClick={() => handleEditClick(elem)}>Edit</button>
                                                    </td>
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

            {isEditModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h4>Edit Follow-Up Record</h4>
                        <label>Start Date:</label>
                        <input
                            type="date"
                            value={selectedRecord?.startDate || ''}
                            onChange={(e) => setSelectedRecord({ ...selectedRecord, startDate: e.target.value })}
                        />
                        <label>Name:</label>
                        <input
                            type="text"
                            value={selectedRecord?.name || ''}
                            onChange={(e) => setSelectedRecord({ ...selectedRecord, name: e.target.value })}
                        />
                        <label>Description:</label>
                        <input
                            type="textarea"
                            value={selectedRecord?.description || ''}
                            onChange={(e) => setSelectedRecord({ ...selectedRecord, description: e.target.value })}
                        />
                        <label>Responsible Person:</label>
                        <input
                            type="text"
                            value={selectedRecord?.responsible_person || ''}
                            onChange={(e) => setSelectedRecord({ ...selectedRecord, responsible_person: e.target.value })}
                        />
                        <label>Remarks:</label>
                        <input
                            type="textarea"
                            value={selectedRecord?.remarks || ''}
                            onChange={(e) => setSelectedRecord({ ...selectedRecord, remarks: e.target.value })}
                        />
                        <label>Status as on Date:</label>
                        <input
                            type="date"
                            value={selectedRecord?.status_as_on_date || ''}
                            onChange={(e) => setSelectedRecord({ ...selectedRecord, status_as_on_date: e.target.value })}
                        />
                        <label>Work Status:</label>
                        <select
                            value={selectedRecord?.work_status || 0}
                            onChange={(e) =>
                                setSelectedRecord({ ...selectedRecord, work_status: Number(e.target.value) })
                            }
                        >
                            <option value={0}>Pending</option>
                            <option value={1}>In Progress</option>
                            <option value={2}>Completed</option>
                        </select>
                        <label>End Date:</label>
                        <input
                            type="date"
                            value={selectedRecord?.endDate || ''}
                            onChange={(e) => setSelectedRecord({ ...selectedRecord, endDate: e.target.value })}
                        />
                        <div className='row mt-2'>
                            <div className='col-6'>
                                <button className='ms-0 btn add-btn' onClick={handleUpdate}>Update</button>
                            </div>
                            <div className='col-6'>
                                <button className='ms-0 btn add-btn' onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>

                </div>
            )}
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
};

export default FollowUpReportForm;
