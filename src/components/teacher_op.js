import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './teacher_op.css';

function Teacher_op({ id, email }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const { selectedCoursePage } = location.state || {};

    useEffect(() => {
        const storedCourse = localStorage.getItem('selectedCourse');
        if (storedCourse) {
            setSelectedCourse(storedCourse);
        } else if (selectedCoursePage) {
            setSelectedCourse(selectedCoursePage);
        }

        axios.get(`${process.env.REACT_APP_API_URL}/teacher`)
            .then((response) => {
                if (response.status === 200) {
                    setCourses(response.data.data);
                    if (storedCourse && response.data.data.some(course => course.code === storedCourse)) {
                        setSelectedCourse(storedCourse);
                    } else {
                        localStorage.removeItem('selectedCourse');
                        setSelectedCourse('');
                    }
                } else {
                    alert("There is something wrong with the connections. Courses were not retrieved");
                }
            })
            .catch((error) => {
                console.error("Error fetching courses:", error);
                alert("Error fetching courses: " + error.message);
            });
    }, [selectedCoursePage]);

    const handleOptions = (event) => {
        const courseCode = event.target.value;
        setSelectedCourse(courseCode);
        localStorage.setItem('selectedCourse', courseCode);
    };

    const handleInsertStudents = async () => {
        navigate('insertstud', { state: { email, selectedCourse } });
    };

    const handleSetTAs = async () => {
        navigate('SetTAs', { state: { email, selectedCourse } });
    };

    const handleSetExams = async () => {
        navigate('setExams', { state: { email, selectedCourse } });
    };

    const handleReviewComments = async () => {
        navigate('reviewcomments', { state: { id, email, selectedCourse } });
    };

    const handleNotesTA = async () => {
        navigate('getNotes', { state: { email, selectedCourse } });
    };

    const handleTAslots = async () => {
        navigate('TAslots', { state: { email, selectedCourse } });
    };

    const handleStudslots = async () => {
        navigate('Studslots', { state: { email, selectedCourse } });
    };

    return (
        <div className="right">
            <div className="header">
                <h3>Select a Course: {selectedCourse}</h3>
                <select name="course" value={selectedCourse} onChange={handleOptions}>
                    <option value="" disabled hidden>Select a course...</option>
                    {courses.length > 0 && courses.map((opts, i) => (
                        <option key={i} value={opts.code}>{opts.code}</option>
                    ))}
                </select>
                {(selectedCourse) && (
                    <div>
                        <h3>Course: {selectedCourse}</h3>
                        <div className="btn-group1">
                            <button className='button' onClick={handleSetTAs}>
                                <i className="fa-regular fa-file-lines" style={{ paddingRight: '8px' }}></i>
                                Insert Teaching Assistants</button>
                            <button className='button' onClick={handleInsertStudents}>
                                <i className="fa-regular fa-file-lines" style={{ paddingRight: '8px' }}></i>
                                Insert Students</button>
                        </div>
                        <div className="btn-group1">
                            <button className='button' onClick={handleSetExams}>
                                <i className="fa-regular fa-file-lines" style={{ paddingRight: '8px' }}></i>
                                Insert Exams For Course</button>
                            <button className='button' onClick={handleTAslots}>
                                <i className="fa-solid fa-table" style={{ paddingRight: '8px' }}></i>
                                Review TA's slots</button>
                        </div>
                        <div className="btn-group2">
                            <button className='button' onClick={handleStudslots} >
                                <i className="fa-solid fa-table" style={{ paddingRight: '8px' }}></i>Review Students's slots</button>
                            <button className='button' onClick={handleNotesTA}>
                                <i className="fa-solid fa-table" style={{ paddingRight: '8px' }}></i>
                                Review Notes from TA</button>
                            <button className='button' onClick={handleReviewComments}>
                                <i className="fa-solid fa-table" style={{ paddingRight: '8px' }}></i>
                                Review Comments from Students</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Teacher_op;
