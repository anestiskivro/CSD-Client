import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useLocation, useNavigate } from 'react-router-dom';
import Info from '../components/info';
import "../components/review.css";

function Cancellation() {
    const navigate = useNavigate();
    const isMobile = useMediaQuery({ maxWidth: 428 });
    const location = useLocation();
    const { email } = location.state || {};
    const { id } = location.state || {};
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
    const [selectedAppointments, setSelectedAppointments] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [exams, setExams] = useState([]);
    const [TAs, setTAs] = useState([]);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        if (id.includes("TA")) {
            axios.get(`${process.env.REACT_APP_API_URL}/tassistant/getSlots`, { params: { email } })
                .then((response) => {
                    if (response.status === 200) {
                        setSelectedSlots(response.data.slots);
                        axios.get(`${process.env.REACT_APP_API_URL}/teacher/getStudents`).then((response) => {
                            if (response.status === 200) {
                                setStudents(response.data.students);
                                axios.get(`${process.env.REACT_APP_API_URL}/tassistant/getappointments`)
                                    .then((response) => {
                                        if (response.status === 200) {
                                            setAppointments(response.data.appointments);
                                        } else {
                                            alert("We could not get the appointments. Check your connection");
                                        }
                                    });
                            } else {
                                alert("We could not get the students. Check your connection");
                            }
                        });
                    } else {
                        alert("We could not get the slots. Check your connection");
                    }
                });
        } else {
            axios.get(`${process.env.REACT_APP_API_URL}/student/getappointments`, { params: { email } })
                .then((response) => {
                    if (response.status === 200) {
                        setSelectedAppointments(response.data.appointments);
                    } else {
                        alert(response.data.message);
                    }
                });
        }
        axios.get(`${process.env.REACT_APP_API_URL}/tassistant/getcomments`).then((response) => {
            if (response.status === 200) {
                setComments(response.data.comments);
            } else {
                alert(response.data.message);
            }
        });
        axios.get(`${process.env.REACT_APP_API_URL}/student/getExams`)
            .then((response) => {
                if (response.status === 200) {
                    setExams(response.data.exams);
                } else {
                    alert(response.data.message);
                }
            })
    }, [email, id]);

    useEffect(() => {
        if (selectedAppointments.length > 0) {
            const cids = selectedAppointments.map(val => val.cid).join(',');
            axios.get(`${process.env.REACT_APP_API_URL}/student/getcourses`, { params: { cids } })
                .then((response) => {
                    setSelectedCourses(response.data.courses);
                    return axios.get(`${process.env.REACT_APP_API_URL}/teacher/getTAs`, { params: { selectedCourse: response.data.courses } });
                })
                .then((response) => {
                    if (response.status === 200) {
                        setTAs(response.data.TAs);
                    } else {
                        alert(response.data.message);
                    }
                })
                .catch((error) => {
                    console.error("There was an error fetching the courses!", error);
                });
        }
    }, [selectedAppointments]);

    const handleCheckboxChange = (index) => (event) => {
        const isChecked = event.target.checked;
        const selectedData = id.includes("TA") ? selectedSlots[index] : selectedAppointments[index];
        if (isChecked) {
            setSelectedCheckboxes(prevState => [...prevState, selectedData]);
        } else {
            setSelectedCheckboxes(prevState => prevState.filter(data => data !== selectedData));
        }
    };

    const handleCancel = async () => {
        const endpoint = id.includes("TA") ? "tassistant/cancel" : "student/cancel";
        try {
            if (selectedCheckboxes.length > 0) {
                const response = await axios.delete(`${process.env.REACT_APP_API_URL}/${endpoint}`, { data: { checkboxes: selectedCheckboxes } });
                if (response.status === 200) {
                    alert("Successfully removed");
                }
            } else {
                alert("Please select a checkbox");
            }

        } catch (error) {
            console.error("Error:", error);
            alert("The cancellation was not succesful. Check your connection");
        }
    };

    const handleBack = () => {
        const path = id.includes("TA") ? '/tassistant' : '/student';
        navigate(path, { state: { id, email } });
    };

    return (
        <div className={`home-container ${isMobile ? 'mobile' : 'desktop'}`}>
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
                                            <th>AM</th>
                                            <th>FromTime</th>
                                            <th>EndTime</th>
                                            <th>Comment</th>
                                            <th>Status</th>
                                            <th>Select</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedSlots.map((val, i) => {
                                            const matched_exam = exams.find(exam => exam.cid === val.cid && exam.eid === val.eid);
                                            const slotAppointment = appointments.find(appointment => appointment.slotId === val.slotid);
                                            const matched_comment = comments.find(comment => comment.appoint_id === slotAppointment?.appoint_id);
                                            const student = slotAppointment ? students.find(student => student.id === slotAppointment.studentId) : null;
                                            return (
                                                <tr key={i}>
                                                    <td>{matched_exam ? matched_exam.name : ''}</td>
                                                    <td>{val.date}</td>
                                                    <td>{student ? student.student_number : ''}</td>
                                                    <td>{val.fromTime}</td>
                                                    <td>{val.EndTime}</td>
                                                    <td>{matched_comment ? matched_comment.Comment : ''}</td>
                                                    <td>{val.Status}</td>
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
                                            <th>TA</th>
                                            <th>FromTime</th>
                                            <th>EndTime</th>
                                            <th>Course</th>
                                            <th>Exam</th>
                                            <th>Comment</th>
                                            <th>Status</th>
                                            <th>Select</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedAppointments.map((val, i) => {
                                            const matchedExam = exams.find(exam => exam.cid === val.cid && exam.eid === val.eid);
                                            const matched_TA = TAs.find(ta => ta.taid === val.taid);
                                            const matched_comment = comments.find(comment => comment.appoint_id === val.appoint_id);
                                            return (
                                                <tr key={i}>
                                                    <td>{val.date}</td>
                                                    <td>{matched_TA ? matched_TA.lastname : ''}</td>
                                                    <td>{val.FromTime}</td>
                                                    <td>{val.EndTime}</td>
                                                    <td>{selectedCourses.find(course => course.cid === val.cid)?.code}</td>
                                                    <td>{matchedExam ? matchedExam.name : ''}</td>
                                                    <td>{matched_comment ? matched_comment.Comment : ''}</td>
                                                    <td>{val.Status}</td>
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
