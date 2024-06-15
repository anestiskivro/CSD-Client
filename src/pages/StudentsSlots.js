import axios from 'axios';
import React, { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useLocation, useNavigate } from 'react-router-dom';
import Info from '../components/info';
import "../components/review.css";

function StudentsSlots() {
    const navigate = useNavigate();
    const location = useLocation();
    const { email, selectedCourse } = location.state || {};
    const [exams, setExams] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null);
    const [TAs, setTAs] = useState([]);
    const [slots, setSlots] = useState([]);
    useEffect(() => {
        axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/teacher/getStudents").then((response) => {
            if (response.status === 200) {
                setStudents(response.data.students)
            }else {
                alert("We could not get the students. Check your connection");
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
        axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/teacher/getStudentsSlots", { params: { selectedCourse: selectedCourse, selectedExam: examName } }).then((response) => {
            if (response.status === 200) {
                setSlots(response.data.slots);
            } else {
                alert(response.data.message)
            }
        });
    };
    const handleBack = () => {
        navigate("/teacher", { state: { email } });
    };
    return (
        <div className="admin1">
            <Info email={email} />
            <div className="right">
                {selectedCourse && (
                    <>
                        <h4>Select Exam:</h4>
                        <select name="Exam" onChange={handleOptions}>
                            <option value="" selected disabled hidden>Select an Exam...</option>
                            {exams.length > 0 && exams.map((opts, i) => (
                                <option key={i}>{opts.name}</option>
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
                                                <th>AM</th>
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
                                                    <td>{students.find(student => student.id === val.studentId)?.student_number}</td>
                                                    <td>{TAs.find(TA => TA.taid === val.taid)?.lastname}</td>
                                                    <td>{val.date}</td>
                                                    <td>{val.FromTime}</td>
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
    );
}
export default StudentsSlots