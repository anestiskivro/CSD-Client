import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Info from '../components/info';
import "../components/review.css";

function Cancellation() {
    const navigate = useNavigate();
    const location = useLocation();
    const { email } = location.state || {};
    const { id } = location.state || {};
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
    const [selectedAppointments, setSelectedAppointments] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [exams, setExams] = useState([]);
    useEffect(() => {
        if (id.includes("TA") ) {
            axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/tassistant/getSlots", { params: { email } })
                .then((response) => {
                    if (response.status === 200) {
                        setSelectedSlots(response.data.slots);
                    } else {
                        alert(response.data.message);
                    }
                });
        } else {
            axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/student/getappointments", { params: { email } })
                .then((response) => {
                    if (response.status === 200) {
                        setSelectedAppointments(response.data.appointments);
                    } else {
                        alert(response.data.message);
                    }
                });
        }
        axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/student/getExams")
            .then((response) => {
                if (response.status === 200) {
                    setExams(response.data.exams);
                } else {
                    alert(response.data.message);
                }
            })
    }, [email]);

    useEffect(() => {
        if (selectedAppointments.length > 0) {
            const cids = selectedAppointments.map(val => val.cid).join(',');
            axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/student/getcourses", { params: { cids } })
                .then((response) => {
                    setSelectedCourses(response.data.courses);
                })
                .catch((error) => {
                    console.error("There was an error fetching the courses!", error);
                });
        }
    }, [selectedAppointments]);

    const handleCheckboxChange = (index) => (event) => {
        const isChecked = event.target.checked;
        const selectedData = email.includes("csdp") ? selectedSlots[index] : selectedAppointments[index];
        if (isChecked) {
            setSelectedCheckboxes(prevState => [...prevState, selectedData]);
        } else {
            setSelectedCheckboxes(prevState => prevState.filter(data => data !== selectedData));
        }
    };

    const handleCancel = async () => {
        const endpoint = email.includes("csdp") ? "tassistant/cancel" : "student/cancel";
        try {
            const response = await axios.delete(`https://rendezvous-csd-106ea9dcba7a.herokuapp.com/${endpoint}`, { data: { checkboxes: selectedCheckboxes } });
            if (response.status === 200) {
                alert("Successfully removed");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("The cancellation was not succesful. Check your connection");
        }
    };

    const handleBack = () => {
        const path = id.includes("TA") ? '/tassistant' : '/student';
        navigate(path, { state: { id,email } });
    };

    return (
        <div className="admin1">
            <Info email={email} />
            <div className="right">
                {id.includes("TA") ? (
                    <div className="table-container">
                        {selectedSlots && selectedSlots.length > 0 ? (
                            <>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Exam</th>
                                            <th>Date</th>
                                            <th>FromTime</th>
                                            <th>EndTime</th>
                                            <th>Select</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedSlots.map((val, i) => {
                                            const matched_exam = exams.find(exam => exam.cid === val.cid && exam.eid === val.eid);
                                            return (
                                                <tr key={i}>
                                                    <td>{matched_exam ? matched_exam.name : 'N/A'}</td>
                                                    <td>{val.date}</td>
                                                    <td>{val.fromTime}</td>
                                                    <td>{val.EndTime}</td>
                                                    <td><input type="checkbox" onChange={handleCheckboxChange(i)} /></td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </>
                        ) : (
                            <div>No slots available</div>
                        )}
                    </div>
                ) : (
                    <div className="table-container">
                        {selectedAppointments && selectedAppointments.length > 0 ? (
                            <>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>FromTime</th>
                                            <th>EndTime</th>
                                            <th>Course</th>
                                            <th>Exam</th>
                                            <th>Select</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedAppointments.map((val, i) => {
                                            const matched_exam = exams.find(exam => exam.cid === val.cid && exam.eid === val.eid);
                                            return (
                                                <tr key={i}>
                                                    <td>{val.date}</td>
                                                    <td>{val.FromTime}</td>
                                                    <td>{val.EndTime}</td>
                                                    <td>{selectedCourses.find(course => course.cid === val.cid)?.code}</td>
                                                    <td>{matched_exam ? matched_exam.name : 'N/A'}</td>
                                                    <td><input type="checkbox" onChange={handleCheckboxChange(i)} /></td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </>
                        ) : (
                            <div>No appointments available</div>
                        )}
                    </div>
                )}
                <div className="btn-group3" >
                    <button className='button' onClick={handleBack}>
                        <i className="fa-solid fa-arrow-left" style={{ paddingRight: '8px' }}></i>
                        Back</button>
                    <button className='button' onClick={handleCancel}>
                        <i className="fa-solid fa-trash" style={{ paddingRight: '8px' }}></i>Remove</button>
                </div>
            </div >
        </div>
    );
}

export default Cancellation;
