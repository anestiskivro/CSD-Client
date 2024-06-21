import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import { default as React, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../components/addComment.css";
import Info from '../components/info';


function AddEvaluation() {
    const navigate = useNavigate();
    const location = useLocation();
    const { email } = location.state || {};
    const { id } = location.state || {};
    const [Evaluation, setEvaluation] = useState("");
    const [courses, setCourses] = useState([]);
    const [exams, setExams] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [examSelected, setExamSelected] = useState(null);
    const [studentemail, setStudentemail] = useState("");
    useEffect(() => {
        axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/tassistant").then((response) => {
            if (response.status === 200) {
                setCourses(response.data.data);
            }
        });
    }, []);
    const handleOptions = (event) => {
        if (event.target.value !== "Select a course...") {
            setSelectedCourse(event.target.value);
            axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/tassistant/book", {
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
            formData.append("evaluation", Evaluation);
            formData.append("code", selectedCourse);
            formData.append("exam", examSelected);
            formData.append("studentemail", studentemail);
            const response = await axios.post(
                'https://rendezvous-csd-106ea9dcba7a.herokuapp.com/tassistant/addeval',
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
        <div className="add-comment-container">
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
                                <input
                                    type="text"
                                    name="studentemail"
                                    value={studentemail}
                                    onChange={(e) => setStudentemail(e.target.value)}
                                />
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
        </div>
    )
}

export default AddEvaluation