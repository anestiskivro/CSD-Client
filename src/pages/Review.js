import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Info from '../components/info';
import '../components/review.css';

function Review() {
    const navigate = useNavigate();
    const location = useLocation();
    const { email } = location.state || {};
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [selectedAppointments, setSelectedAppointments] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [exams, setExams] = useState([]);

    useEffect(() => {
        if (email.includes("csdp")) {
            axios.get("http://localhost:3001/tassistant/getSlots", { params: { email } })
                .then((response) => {
                    if (response.status === 200) {
                        setSelectedSlots(response.data.slots);
                    }
                });
        } else {
            axios.get("http://localhost:3001/student/getappointments", { params: { email } })
                .then((response) => {
                    if (response.status === 200) {
                        setSelectedAppointments(response.data.appointments);
                    }
                });
        }
    }, [email]);

    useEffect(() => {
        axios.get("http://localhost:3001/student/getcourses",)
            .then((response) => {
                setSelectedCourses(response.data.courses);
                return axios.get("http://localhost:3001/student/getExams",);
            })
            .then((response) => {
                if (response.status === 200) {
                    setExams(response.data.exams);
                } else {
                    alert(response.data.message);
                }
            })
            .catch((error) => {
                console.error("There was an error fetching the courses or exams!", error);
            });
    }, []);

    const handleBack = () => {
        const path = email.includes("csdp") ? '/tassistant' : '/student';
        navigate(path, { state: { email } });
    };

    return (
        <div className="admin1">
            <Info email={email} />
            <div className="right">
                {email.includes("csdp") ? (
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
                                            <th>Status</th>
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
                                                <td>{val.Status}</td>
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
                                            <th>Course</th>
                                            <th>Exam</th>
                                            <th>Date</th>
                                            <th>FromTime</th>
                                            <th>EndTime</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedAppointments.map((val, i) => {
                                            const matchedCourse = selectedCourses.find(course => course.cid === val.cid);
                                            const matchedExam = exams.find(exam => exam.cid === val.cid && exam.eid === val.eid);
                                            return (
                                                <tr key={i}>
                                                    <td>{matchedCourse ? matchedCourse.code : 'N/A'}</td>
                                                    <td>{matchedExam ? matchedExam.name : 'N/A'}</td>
                                                    <td>{val.date}</td>
                                                    <td>{val.FromTime}</td>
                                                    <td>{val.EndTime}</td>
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
                <div className='btn-group3'>
                    <button className="button" onClick={handleBack}>
                        <i className="fa-solid fa-arrow-left" style={{ paddingRight: '8px' }}></i>
                        Back</button>
                </div>
            </div>
        </div>
    );
}

export default Review;
