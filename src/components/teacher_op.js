import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './teacher_op.css';

function Teacher_op({ email }) {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    useEffect(() => {
        axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/teacher").then((response) => {
            if (response.status === 200) {
                setCourses(response.data.data)
            }else {
                alert("There is something wrong with the connections. Courses were not retrieved");
            }
        })
    }, [])
    const handleOptions = (event) => {
        if (event.target.value !== "Select a course...") {
            setSelectedCourse(event.target.value);
        }
    };
    const handleInsertStudents = async () => {
        navigate('insertstud', { state: { email, selectedCourse } });
    }
    const handleSetTAs = async () => {
        navigate('SetTAs', { state: { email, selectedCourse } });
    }
    const handleSetExams = async () => {
        navigate('setExams', { state: { email, selectedCourse } });
    }
    const handleReviewComments = async () => {
        navigate('reviewcomments', { state: { email } });
    }
    const handleNotesTA = async () => {
        navigate('getNotes', { state: { email, selectedCourse } })
    }
    const handleTAslots = async () => {
        navigate('TAslots', { state: { email, selectedCourse } })
    }
    const handleStudslots = async () => {
        navigate('Studslots', { state: { email, selectedCourse } })
    }
    return (
        <div className="right">
            <div className="header">
                <h3>Select a Course: {selectedCourse}</h3>
                <select name="course" onChange={handleOptions}>
                    <option value="" selected disabled hidden>Select a course...</option>
                    {courses.length > 0 && courses.map((opts, i) => <option key={i}>{opts.code}</option>)}
                </select>
                <h4>{selectedCourse}</h4>
                {(selectedCourse) && (
                    <div>
                        <h3>Course: {selectedCourse}</h3>
                        <div className="btn-group1">
                            <button className='button' onClick={() => handleSetTAs()}>
                            <i className="fa-regular fa-file-lines" style={{ paddingRight: '8px' }}></i>
                                Insert Teaching Assistants</button>
                            <button className='button' onClick={() => handleInsertStudents()}>
                            <i className="fa-regular fa-file-lines" style={{ paddingRight: '8px' }}></i>
                                Insert Students</button>
                        </div>
                        <div className="btn-group1">
                            <button className='button' onClick={() => handleSetExams()}>
                            <i className="fa-regular fa-file-lines" style={{ paddingRight: '8px' }}></i>
                                Insert Exams For Course</button>
                            <button className='button' onClick={() => handleTAslots()}>
                            <i className="fa-solid fa-table" style={{ paddingRight: '8px' }}></i>
                                Review TA's slots</button>
                        </div>
                        <div className="btn-group2">
                            <button className='button'onClick={handleStudslots} >
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