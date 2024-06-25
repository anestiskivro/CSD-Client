import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useLocation, useNavigate } from 'react-router-dom';
import Info from '../components/info';
// import '../components/review.css';

function Review() {
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const navigate = useNavigate();
    const location = useLocation();
    const { email } = location.state || {};
    const { id } = location.state || {};
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [selectedAppointments, setSelectedAppointments] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [exams, setExams] = useState([]);
    const [students, setStudents] = useState([]);
    const [TAs, setTAs] = useState([]);

    useEffect(() => {
        if (id.includes("TA")) {
            axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/tassistant/getSlots", { params: { email } })
                .then((response) => {
                    if (response.status === 200) {
                        setSelectedSlots(response.data.slots);
                        axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/teacher/getStudents").then((response) => {
                            if (response.status === 200) {
                                setStudents(response.data.students);
                                axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/tassistant/getappointments")
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
            axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/student/getappointments", { params: { email } })
                .then((response) => {
                    if (response.status === 200) {
                        setSelectedAppointments(response.data.appointments);
                    } else {
                        alert("We could not get the appointments. Check your connection");
                    }
                });
        }
    }, [email, id]);

    useEffect(() => {
        axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/student/getcourses")
            .then((response) => {
                setSelectedCourses(response.data.courses);
                return axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/teacher/getTAs", { params: { selectedCourse: response.data.courses } });
            })
            .then((response) => {
                if (response.status === 200) {
                    setTAs(response.data.TAs);
                } else {
                    alert(response.data.message);
                }
            })
            .catch((error) => {
                console.error("There was an error fetching the courses or TAs!", error);
            });

        axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/student/getExams")
            .then((response) => {
                if (response.status === 200) {
                    setExams(response.data.exams);
                } else {
                    alert(response.data.message);
                }
            })
            .catch((error) => {
                console.error("There was an error fetching the exams!", error);
            });
    }, []);

    const handleBack = () => {
        const path = id.includes("TA") ? '/tassistant' : '/student';
        navigate(path, { state: { id, email } });
    };

    return (
        <div className={`home-container ${isMobile ? 'mobile' : 'desktop'}`} style={{ padding: '10px', margin: 'auto' }}>
            <Info email={email} />
            <div className="right" style={{ padding: '10px', margin: 'auto' }}>
                {id.includes("TA") ? (
                    <div className="table-container" style={{ overflow: 'auto', maxHeight: '60vh', maxWidth: '95%' }}>
                        {selectedSlots && selectedSlots.length > 0 ? (
                            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                                <thead>
                                    <tr>
                                        <th style={{ backgroundColor: '#c50047', color: 'white', padding: '5px', fontSize: '14px' }}>Exam</th>
                                        <th style={{ backgroundColor: '#c50047', color: 'white', padding: '5px', fontSize: '14px' }}>Date</th>
                                        <th style={{ backgroundColor: '#c50047', color: 'white', padding: '5px', fontSize: '14px' }}>AM</th>
                                        <th style={{ backgroundColor: '#c50047', color: 'white', padding: '5px', fontSize: '14px' }}>FromTime</th>
                                        <th style={{ backgroundColor: '#c50047', color: 'white', padding: '5px', fontSize: '14px' }}>EndTime</th>
                                        <th style={{ backgroundColor: '#c50047', color: 'white', padding: '5px', fontSize: '14px' }}>Status</th>
                                        <th style={{ backgroundColor: '#c50047', color: 'white', padding: '5px', fontSize: '14px' }}>Message</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedSlots.map((val, i) => {
                                        const matched_exam = exams.find(exam => exam.cid === val.cid && exam.eid === val.eid);
                                        const slotAppointment = appointments.find(appointment => appointment.slotId === val.slotid);
                                        const student = slotAppointment ? students.find(student => student.id === slotAppointment.studentId) : null;
                                        return (
                                            <tr key={i}>
                                                <td style={{ border: '1px solid #ccc', padding: '5px' }}>{matched_exam ? matched_exam.name : ''}</td>
                                                <td style={{ border: '1px solid #ccc', padding: '5px' }}>{val.date}</td>
                                                <td style={{ border: '1px solid #ccc', padding: '5px' }}>{student ? student.student_number : ''}</td>
                                                <td style={{ border: '1px solid #ccc', padding: '5px' }}>{val.fromTime}</td>
                                                <td style={{ border: '1px solid #ccc', padding: '5px' }}>{val.EndTime}</td>
                                                <td style={{ border: '1px solid #ccc', padding: '5px' }}>{val.Status}</td>
                                                <td style={{ border: '1px solid #ccc', padding: '5px' }}>
                                                    {student ? (
                                                        <a href={`mailto:${student.email}`}>Send Message</a>
                                                    ) : ''}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <div>No slots available</div>
                        )}
                    </div>
                ) : (
                    <div className="table-container" style={{ overflow: 'auto', maxHeight: '60vh', maxWidth: '95%' }}>
                        {selectedAppointments && selectedAppointments.length > 0 ? (
                            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                                <thead>
                                    <tr>
                                        <th style={{ backgroundColor: '#c50047', color: 'white', padding: '5px', fontSize: '14px' }}>Course</th>
                                        <th style={{ backgroundColor: '#c50047', color: 'white', padding: '5px', fontSize: '14px' }}>Exam</th>
                                        <th style={{ backgroundColor: '#c50047', color: 'white', padding: '5px', fontSize: '14px' }}>TA</th>
                                        <th style={{ backgroundColor: '#c50047', color: 'white', padding: '5px', fontSize: '14px' }}>Date</th>
                                        <th style={{ backgroundColor: '#c50047', color: 'white', padding: '5px', fontSize: '14px' }}>FromTime</th>
                                        <th style={{ backgroundColor: '#c50047', color: 'white', padding: '5px', fontSize: '14px' }}>EndTime</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedAppointments.map((val, i) => {
                                        const matchedCourse = selectedCourses.find(course => course.cid === val.cid);
                                        const matchedExam = exams.find(exam => exam.cid === val.cid && exam.eid === val.eid);
                                        const matched_TA = TAs.find(ta => ta.taid === val.taid);
                                        return (
                                            <tr key={i}>
                                                <td style={{ border: '1px solid #ccc', padding: '5px' }}>{matchedCourse ? matchedCourse.code : 'N/A'}</td>
                                                <td style={{ border: '1px solid #ccc', padding: '5px' }}>{matchedExam ? matchedExam.name : 'N/A'}</td>
                                                <td style={{ border: '1px solid #ccc', padding: '5px' }}>{matched_TA ? matched_TA.lastname : 'N/A'}</td>
                                                <td style={{ border: '1px solid #ccc', padding: '5px' }}>{val.date}</td>
                                                <td style={{ border: '1px solid #ccc', padding: '5px' }}>{val.FromTime}</td>
                                                <td style={{ border: '1px solid #ccc', padding: '5px' }}>{val.EndTime}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <div>No appointments available</div>
                        )}
                    </div>
                )}
                <div className='btn-group3' style={{ padding: '10px', margin: 'auto' }}>
                    <button className="button" onClick={handleBack}>
                        <i className="fa-solid fa-arrow-left" style={{ paddingRight: '8px' }}></i>
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Review;
