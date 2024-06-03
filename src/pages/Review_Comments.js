import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Info from '../components/info';
import "../components/review.css";
function Review_comments() {
    const [comments, setComments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [exams, setExams] = useState([]);
    useEffect(() => {
        axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/tassistant/getComments").then((response) => {
            if (response.status === 200) {
                setComments(response.data.comments);
                axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/tassistant/getExams").then((response) => {
                    if (response.status === 200) {
                        setExams(response.data.exams);
                    }
                });
            }
        });
        axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/tassistant").then((response) => {
            if (response.status === 200) {
                setCourses(response.data.data);
            }
        });
        axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/tassistant/getStudents").then((response) => {
            if (response.status === 200) {
                setStudents(response.data.students);
            }
        });
    }, []);

    const navigate = useNavigate();
    const location = useLocation();
    const { email } = location.state || {};
    const handleBack = () => {
        const path = email.includes("csdp") ? '/tassistant' : '/teacher';
        navigate(path, { state: { email } });
    };
    return (
        <div className="admin1">
            <Info email={email}></Info>
            <div className='right'>
                <div className="table-container">
                    {comments && comments.length > 0 ? (
                        <>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Course</th>
                                        <th>Exam</th>
                                        <th>AM</th>
                                        <th>Date</th>
                                        <th>FromTime</th>
                                        <th>EndTime</th>
                                        <th>Comment</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comments.map((val, i) => (
                                        <tr key={i}>
                                            <td>{courses.find(course => course.cid === val.cid)?.code}</td>
                                            <td>{exams.find(exam => exam.eid === val.eid)?.name}</td>
                                            <td>{students.find(student => student.id === val.studentId)?.student_number}</td>
                                            <td>{val.date}</td>
                                            <td>{val.FromTime}</td>
                                            <td>{val.EndTime}</td>
                                            <td className="comment-cell">{val.Comment}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    ) : (
                        <div>No comments available</div>
                    )}
                </div>
                <div className='btn-group3'>
                    <button className="button" onClick={handleBack}>
                        <i className="fa-solid fa-arrow-left" style={{ paddingRight: '8px' }}></i>
                        Back</button>
                </div>
            </div>
        </div >
    )
}

export default Review_comments