import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import { default as React, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useLocation, useNavigate } from 'react-router-dom';
import "../components/addComment.css";
import Info from '../components/info';


function AddEvaluation() {
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const navigate = useNavigate();
    const location = useLocation();
    const { email } = location.state || {};
    const { id } = location.state || {};
    const [students, setStudents] = useState([]);
    const [Evaluation, setEvaluation] = useState("");
    const [courses, setCourses] = useState([]);
    const [exams, setExams] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [examSelected, setExamSelected] = useState(null);
    const [studentemail, setStudentemail] = useState("");
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/tassistant`).then((response) => {
            if (response.status === 200) {
                setCourses(response.data.data);
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
                    axios.get(`${process.env.REACT_APP_API_URL}/teacher/getStudents`).then((response) => {
                        if (response.status === 200) {
                            setStudents(response.data.students);
                        } else {
                            alert("We could not get the students. Check your connection");
                        }
                    });
                }
            });
        }
    };
    const handleExamChange = (event) => {
        const selectedExamName = event.target.value;
        const foundExam = exams.find(exam => exam.name === selectedExamName);
        setExamSelected(foundExam);
    };
    const handleStudentChange = (event) => {
        const selectedemail = event.target.value;
        setStudentemail(selectedemail);
    };
    const handleonSubmit = async (event) => {
        event.preventDefault();
        try {
            let formData = new FormData();
            formData.append("email", email);
            formData.append("evaluation", Evaluation);
            formData.append("code", selectedCourse);
            formData.append("exam", examSelected.name);
            formData.append("studentemail", studentemail);
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/tassistant/addeval`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.status === 200) {
                alert("Evaluation inserted successfully");
            }
        } catch (error) {
            alert("An error occurred while submitting your evaluation in the form. Please try again.");
        }
    };

    const handleBack = () => {
        navigate('/tassistant', { state: { id, email } });
    };

    return (
        <div className={`home-container ${isMobile ? 'mobile' : 'desktop'}`}>
            <Info email={email}></Info>
            <div className="right">
                <div className='header'>
                    <div className='items'>
                        <h2 className="add-comment-header">Insert Evaluation</h2>
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
                                Student email:
                                <select name="students" onChange={handleStudentChange}>
                                    <option value="" selected disabled hidden>Select a Student...</option>
                                    {students.length > 0 && students.map((opts, i) => <option key={i}>{opts.email}</option>)}
                                </select>
                            </label>
                            <label>
                                Evaluation:
                                <textarea
                                    name="Evaluation"
                                    value={Evaluation}
                                    rows="4"
                                    cols="50"
                                    onChange={(e) => setEvaluation(e.target.value)}
                                />
                            </label>
                            <button className='button'>
                                <i className="fa-solid fa-paper-plane" style={{ paddingRight: '8px' }}></i>Submit</button>
                        </form>
                        <div id="back">
                            <button className="button" onClick={handleBack}>
                                <i className="fa-solid fa-arrow-left" style={{ paddingRight: '8px' }}></i>
                                Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default AddEvaluation