import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useLocation, useNavigate } from 'react-router-dom';
import Info from '../components/info';
import "../components/review.css";

function Review_comments() {
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const [comments, setComments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [exams, setExams] = useState([]);
    const [TAs, setTAs] = useState([]);

    useEffect(() => {
        axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/tassistant/getComments")
            .then((response) => {
                if (response.status === 200) {
                    setComments(response.data.comments);
                    return axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/tassistant/getExams");
                } else {
                    throw new Error("Failed to get comments");
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    setExams(response.data.exams);
                } else {
                    throw new Error("Failed to get exams");
                }
            })
            .catch((error) => {
                alert(error.message);
            });

        axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/tassistant")
            .then((response) => {
                if (response.status === 200) {
                    setCourses(response.data.data);
                    return axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/teacher/getTAs", { params: { selectedCourse: response.data.data } });
                } else {
                    throw new Error("Failed to get courses");
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    setTAs(response.data.TAs);
                } else {
                    throw new Error(response.data.message);
                }
            })
            .catch((error) => {
                alert(error.message);
            });

        axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/tassistant/getStudents")
            .then((response) => {
                if (response.status === 200) {
                    setStudents(response.data.students);
                } else {
                    throw new Error("Failed to get students");
                }
            })
            .catch((error) => {
                alert(error.message);
            });
    }, []);

    const navigate = useNavigate();
    const location = useLocation();
    const { email, id, selectedCourse } = location.state || {};

    const handleBack = () => {
        const path = id && id.includes("TA") ? '/tassistant' : '/teacher';
        navigate(path, { state: { id, email, selectedCourse } });
    };

    return (
        <div className={`home-container ${isMobile ? 'mobile' : 'desktop'}`}>
            <Info email={email} />
            <div className='right'>
                <div className="table-container">
                    {comments && comments.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Course</th>
                                    <th>Exam</th>
                                    <th>TA</th>
                                    <th>AM</th>
                                    <th>Date</th>
                                    <th>FromTime</th>
                                    <th>EndTime</th>
                                    <th>Comment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comments.map((val, i) => {
                                    const course = courses.find(course => course.cid === val.cid);
                                    const exam = exams.find(exam => exam.eid === val.eid);
                                    const ta = TAs.find(ta => ta.taid === val.taid);
                                    const student = students.find(student => student.id === val.studentId);
                                    return (
                                        <tr key={i}>
                                            <td>{course ? course.code : 'N/A'}</td>
                                            <td>{exam ? exam.name : 'N/A'}</td>
                                            <td>{ta ? ta.lastname : 'N/A'}</td>
                                            <td>{student ? student.student_number : 'N/A'}</td>
                                            <td>{val.date}</td>
                                            <td>{val.FromTime}</td>
                                            <td>{val.EndTime}</td>
                                            <td className="comment-cell">{val.Comment}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <div>No comments available</div>
                    )}
                </div>
                <div className='btn-group3'>
                    <button className="button" onClick={handleBack}>
                        <i className="fa-solid fa-arrow-left" style={{ paddingRight: '8px' }}></i>
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Review_comments;
