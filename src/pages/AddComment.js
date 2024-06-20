import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../components/addComment.css";
import Info from '../components/info';


function AddComment() {
    const navigate = useNavigate();
    const location = useLocation();
    const { email } = location.state || {};
    const { id } = location.state || {};
    const [Comment, setComment] = useState("");
    const [coursecode, setCourseCode] = useState("");
    const [examCourse, setExamCourse] = useState("");

    const handleonSubmit = async (event) => {
        event.preventDefault();
        try {
            let formData = new FormData();
            formData.append("email", email);
            formData.append("comment", Comment);
            formData.append("code", coursecode);
            formData.append("exam", examCourse);
            const response = await axios.post(
                'https://rendezvous-csd-106ea9dcba7a.herokuapp.com/student/addComment',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            if (response.status === 200) {
                alert("Comment inserted successfully");
            }
        } catch (error) {
            alert("There was an error submitting the form. Please try again.");
        }
    };

    const handleBack = () => {
        navigate('/student', { state: { id, email } });
    };

    return (
        <div className="add-comment-container">
            <Info email={email}></Info>
            <div className="right">
                <div className='header'>
                    <div className='items'>
                        <h2 className="add-comment-header">Insert a Comment</h2>
                        <form className="add-comment-form" onSubmit={handleonSubmit}>
                            <label>
                                Course code:
                                <input
                                    type="text"
                                    name="coursecode"
                                    value={coursecode}
                                    onChange={(e) => setCourseCode(e.target.value)}
                                />
                            </label>
                            <label>
                                Exam course:
                                <input
                                    type="text"
                                    name="examCourse"
                                    value={examCourse}
                                    onChange={(e) => setExamCourse(e.target.value)}
                                />
                            </label>
                            <label>
                                Comment:
                                <textarea
                                    name="Comment"
                                    value={Comment}
                                    rows="4"
                                    cols="50"
                                    onChange={(e) => setComment(e.target.value)}
                                />
                            </label>
                            <button className='button'>
                                <i className="fa-solid fa-paper-plane" style={{ paddingRight: '8px' }}></i>Submit</button>
                        </form>
                        <div id="back">
                            <button className="button" onClick={handleBack}>
                                <i className="fa-solid fa-arrow-left" style={{ paddingRight: '8px' }}></i>
                                Back</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddComment;
