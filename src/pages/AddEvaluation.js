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
    const [Evaluation, setEvaluation] = useState("");
    const [coursecode, setCourseCode] = useState("");
    const [examCourse, setExamCourse] = useState("");
    const [studentemail, setStudentemail] = useState("");

    const handleonSubmit = async (event) => {
        event.preventDefault();
        let formData = new FormData();
        formData.append("email", email);
        formData.append("evaluation", Evaluation);
        formData.append("code", coursecode);
        formData.append("exam", examCourse);
        formData.append("studentemail", studentemail);
        console.log(formData)
        axios.post(
            'https://rendezvous-csd-106ea9dcba7a.herokuapp.com/tassistant/addeval',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        ).then((response) => {
            if (response.status === 200) {
                alert("Evaluation inserted successfully");
            } else {
                alert("Evaluation was not inserted successfully");
            }
        })

    }

    const handleBack = () => {
        navigate('/tassistant', { state: { email } });
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