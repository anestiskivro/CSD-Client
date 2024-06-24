import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useLocation, useNavigate } from 'react-router-dom';
import Info from '../components/info';
import "./setExams.css";


function Set_Exams() {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [name, setName] = useState("");
  const [fromDate, setfromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [Duration, setDuration] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};
  const { selectedCourse } = location.state || {};

  const handleBack = () => {
    navigate('/teacher', { state: { email } });
  };

  const handleonSubmit = async () => {
    let formData = new FormData();
    formData.append("cid", selectedCourse);
    formData.append("name", name);
    formData.append("fromDate", fromDate);
    formData.append("toDate", toDate);
    formData.append("Duration", Duration);

    const response = await axios.post(
      'https://rendezvous-csd-106ea9dcba7a.herokuapp.com/teacher/setExams',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    if (response.status === 200) {
      alert("Exam inserted successfully");
    }else {
      alert("The file was not uploaded.");
    }
  }

  return (
    <div className={`home-container ${isMobile ? 'mobile' : 'desktop'}`}>
    <div className="set-exams-container">
      <Info email={email} />
      <div className="right">
        <h2 className="set-exams-header">Insert the Exam</h2>
        <form className="set-exams-form">
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            From Date:
            <input
              type="date"
              name="fromdate"
              value={fromDate}
              onChange={(e) => setfromDate(e.target.value)}
            />
          </label>
          <label>
            To Date:
            <input
              type="date"
              name="todate"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </label>
          <label>
            Duration in minutes:
            <input
              type="text"
              name="duration"
              value={Duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </label>
          <button type="button" onClick={handleonSubmit}>
            <i className="fa-solid fa-paper-plane" style={{ paddingRight: '8px' }}></i>Submit</button>
        </form>
          <button className="button" onClick={handleBack}>
            <i className="fa-solid fa-arrow-left" style={{ paddingRight: '8px' }}></i>Back</button>
      </div>
    </div>
    </div>
  )
}

export default Set_Exams;
