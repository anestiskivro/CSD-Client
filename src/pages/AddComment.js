import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useLocation, useNavigate } from 'react-router-dom';
import "../components/addComment.css";
import Info from '../components/info';


function AddComment() {
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const navigate = useNavigate();
    const location = useLocation();
    const { email } = location.state || {};
    const { id } = location.state || {};
    const [Comment, setComment] = useState("");
    const [courses, setCourses] = useState([]);
    const [exams, setExams] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [examSelected, setExamSelected] = useState(null);
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/tassistant`).then((response) => {
            if (response.status === 200) {
                setCourses(response.data.data);
            }
        });
        axios.get(`${process.env.REACT_APP_API_URL}/student/getComment`,{
            params: { email }}).then((response) => {
            if (response.status === 200) {
                setComment(response.data.comment);
            }
        });
    }, []);

    const handleOptions = (event) => {
        if (event.target.value !== "Select a course...") {
            setSelectedCourse(event.target.value);
            axios.get(`${process.env.REACT_APP_API_URL}/tassistant/book`, {
                params: { selectedCourse: event.target.value }
            }).then((response) => {
                if (response.status === 200) {
                    setExams(response.data.exams);
                    setExamSelected(null);
                }
            });
        }
    };
    const handleExamChange = (event) => {
        const selectedExamName = event.target.value;
        const foundExam = exams.find(exam => exam.name === selectedExamName);
        setExamSelected(foundExam);
    };
    const handleonSubmit = async (event) => {
        event.preventDefault();
        try {
            let formData = new FormData();
            formData.append("email", email);
            formData.append("comment", Comment);
            formData.append("code", selectedCourse);
            formData.append("exam", examSelected.name);
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/student/addComment`,
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
        <div className={`home-container ${isMobile ? 'mobile' : 'desktop'}`}>
            <Info email={email}></Info>
            <div className="right">
                <div className='header'>
                    <div className='items'>
                        <h2 className="add-comment-header">Insert a Comment</h2>
                        <form className="add-comment-form" onSubmit={handleonSubmit}>
                            <label>
                                Course code:
                                <select name="course" onChange={handleOptions}>
                                    <option value="" selected disabled hidden>Select a course...</option>
                                    {courses.length > 0 && courses.map((opts, i) => <option key={i}>{opts.code}</option>)}
                                </select>
                            </label>
                            <label>
                                Exam course:
                                <select name="exams" onChange={handleExamChange}>
                                    <option value="" selected disabled hidden>Select an exam...</option>
                                    {exams.length > 0 && exams.map((opts, i) => <option key={i}>{opts.name}</option>)}
                                </select>
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
