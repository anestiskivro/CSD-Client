import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useLocation, useNavigate } from 'react-router-dom';
import Info from '../components/info';
import "../components/review.css";

function NotesTA() {
    const navigate = useNavigate();
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const location = useLocation();
    const { email } = location.state || {};
    const { selectedCourse } = location.state || {};
    const [TAs, setTAs] = useState([]);
    const [students, setStudents] = useState([]);
    const [exams, setExams] = useState([]);
    const [selectedTA, setTA] = useState("");
    const [Evaluations, setEvaluations] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/teacher/getExams`, { params: { selectedCourse } }).then((response) => {
            if (response.status === 200) {
                setExams(response.data.exams);
                axios.get(`${process.env.REACT_APP_API_URL}/teacher/getStudents`).then((response) => {
                    if (response.status === 200) {
                        setStudents(response.data.students);
                    } else {
                        alert("We could not get the students. Check your connection");
                    }
                });
            } else {
                alert(response.data.message);
            }
        });
        axios.get(`${process.env.REACT_APP_API_URL}/teacher/getTAs`, { params: { selectedCourse } }).then((response) => {
            if (response.status === 200) {
                setTAs(response.data.TAs);
            } else {
                alert(response.data.message);
            }
        });
    }, [selectedCourse]);

    const handleAssistantChange = (event) => {
        const selectedTA = event.target.value;
        setTA(selectedTA);
        axios.get(`${process.env.REACT_APP_API_URL}/teacher/getNotes`, { params: { teaching_assistant: selectedTA } })
            .then((response) => {
                if (response.status === 200) {
                    setEvaluations(response.data.evaluations);
                } else {
                    alert(response.data.message);
                }
            });
    };

    const handleBack = () => {
        navigate("/teacher", { state: { email } });
    };

    return (
        <div className={`home-container ${isMobile ? 'mobile' : 'desktop'}`}>
            <Info email={email}></Info>
            <div className="right">
                {selectedCourse && (
                    <>
                        <h4>Select TA:</h4>
                        <select name="TAs" onChange={handleAssistantChange}>
                            <option value="" selected disabled hidden>Select a TA...</option>
                            {TAs.length > 0 && TAs.map((opts, i) => <option key={i}>{opts.lastname}</option>)}
                        </select>
                    </>
                )}
                {selectedCourse && selectedTA && (
                    <>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Course</th>
                                        <th>Exam</th>
                                        <th>TAssistant</th>
                                        <th>Student</th>
                                        <th>Evaluation</th>
                                    </tr>
                                </thead>
                            </table>
                            <div className="table-body-container">
                                <table>
                                    <tbody>
                                        {Evaluations.map((val, i) => (
                                            <tr key={i}>
                                                <td>{selectedCourse}</td>
                                                <td>{exams.find(exam => exam.eid === val.eid)?.name}</td>
                                                <td>{selectedTA}</td>
                                                <td>{students.find(student => student.id === val.studentId)?.student_number}</td>
                                                <td>{val.evaluation_info}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
                <div className="btn-group3">
                    <button className='button' onClick={handleBack}>
                        <i className="fa-solid fa-arrow-left" style={{ paddingRight: '8px' }}></i>
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NotesTA;
