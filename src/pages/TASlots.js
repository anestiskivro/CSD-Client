import axios from 'axios';
import React, { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useMediaQuery } from 'react-responsive';
import { useLocation, useNavigate } from 'react-router-dom';
import Info from '../components/info';
import "../components/review.css";

function TASlots() {
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const navigate = useNavigate();
    const location = useLocation();
    const { email, selectedCourse } = location.state || {};
    const [exams, setExams] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null);
    const [TAs, setTAs] = useState([]);
    const [selectedTA, setTA] = useState("");
    const [slots, setSlots] = useState([]);
    useEffect(() => {
        axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/teacher").then((response) => {
            if (response.status === 200) {
                setCourses(response.data.data)
            }
        })
        axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/teacher/getExams", { params: { selectedCourse: selectedCourse } }).then((response) => {
            if (response.status === 200) {
                setExams(response.data.exams);
            } else {
                alert(response.data.message)
            }
        });
        axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/teacher/getTAs", { params: { selectedCourse: selectedCourse } }).then((response) => {
            if (response.status === 200) {
                setTAs(response.data.TAs);
            } else {
                alert(response.data.message)
            }
        });
    }, [selectedCourse])
    const handleOptions = (event) => {
        const examName = event.target.value;
        const selectedExam = exams.find(exam => exam.name === examName);
        setSelectedExam(selectedExam);
    };
    const handleAssistantChange = (event) => {
        const selectedTA = event.target.value;
        setTA(selectedTA);
        const foundCourse = courses.find(course => course.code === selectedCourse);
        const cid = foundCourse.cid;
        axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/teacher/getSlots", { params: { teaching_assistant: selectedTA, exam: selectedExam, cid: cid } })
            .then((response) => {
                if (response.status === 200) {
                    setSlots(response.data.slots)
                }
            });

    };

    const handleBack = () => {
        navigate("/teacher", { state: { email } });
    };
    return (
        <div className={`home-container ${isMobile ? 'mobile' : 'desktop'}`}>
            <div className="review">
                <Info email={email} />
                <div className="right">
                    {selectedCourse && (
                        <>
                            <h4>Select Exam:</h4>
                            <select name="TAs" onChange={handleOptions}>
                                <option value="" selected disabled hidden>Select an Exam...</option>
                                {exams.length > 0 && exams.map((opts, i) => (
                                    <option key={i}>{opts.name}</option>
                                ))}
                            </select>
                        </>
                    )}
                    {selectedCourse && selectedExam && (
                        <>
                            <h4>Select TA:</h4>
                            <select name="TAs" onChange={handleAssistantChange}>
                                <option value="" selected disabled hidden>Select a TA...</option>
                                {TAs.length > 0 && TAs.map((opts, i) => (
                                    <option key={i}>{opts.lastname}</option>
                                ))}
                            </select>
                        </>
                    )}
                    {selectedCourse && selectedExam && (
                        <>
                            <div className="table-container">
                                {slots && slots.length > 0 ? (
                                    <>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Course</th>
                                                    <th>Exam</th>
                                                    <th>TA</th>
                                                    <th>Date</th>
                                                    <th>FromTime</th>
                                                    <th>EndTime</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {slots.map((val, i) => (
                                                    <tr key={i}>
                                                        <td>{selectedCourse}</td>
                                                        <td>{exams.find(exam => exam.eid === val.eid)?.name}</td>
                                                        <td>{selectedTA}</td>
                                                        <td>{val.date}</td>
                                                        <td>{val.fromTime}</td>
                                                        <td>{val.EndTime}</td>
                                                        <td>{val.Status}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </>
                                ) : (
                                    <div>No slots available</div>
                                )}
                            </div>
                            <div className="btn-group3">
                                <button className="button" onClick={handleBack}>
                                    <i className="fa-solid fa-arrow-left" style={{ paddingRight: '8px' }}></i>
                                    Back</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
export default TASlots;
