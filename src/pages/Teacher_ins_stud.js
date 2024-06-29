import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useLocation, useNavigate } from 'react-router-dom';
import Info from '../components/info';
import "../components/teacher_op.css";

function Teacher_ins_stud() {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const navigate = useNavigate();
  const location = useLocation();
  const { email, selectedCourse } = location.state || {};
  const [fileData, setFileData] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFileData(file);
  };

  const upload_to_Students = async () => {
    if (!fileData) {
      alert('Please select a file');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', fileData);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/teacher/insertstud`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 200) {
        alert('Data imported successfully');
      } else {
        alert('Data import failed. ');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Check your connection');
    }
  };

  const handleBack = () => {
    navigate('/teacher', { state: { email, selectedCourse } });
  };

  const handleShowInfo = () => {
    setShowInfo(true);
  };

  const handleCloseInfo = () => {
    setShowInfo(false);
  };

  const seeFile = () => {
    if (!fileData) {
      alert('Please select a file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      window.open(dataUrl, '_blank');
    };
    reader.readAsDataURL(fileData);
  };

  return (
    <div className={`home-container ${isMobile ? 'mobile' : 'desktop'}`}>
      <Info email={email}></Info>
      <div className="right">
        <div id="file">
          <h2>Insert the file here</h2>
          <input type="file" name="file" onChange={handleFileUpload} />
        </div>
        <div className="btn-group">
          <button className="button" onClick={upload_to_Students}>
            <i className="fa-regular fa-file-lines" style={{ paddingRight: '8px' }}></i>
            Import Data
          </button>
          <button className="button" onClick={handleBack}>
            <i className="fa-solid fa-arrow-left" style={{ paddingRight: '8px' }}></i>
            Back
          </button>
        </div>
        <a href={`${process.env.PUBLIC_URL}/students.xls`} download="students.xls" className="button">
          <i className="fa fa-download" style={{ paddingRight: '8px' }}></i>Download Students File
        </a>
        <div id="import1">
          <button className="button" onClick={seeFile}>
            <i className="fa fa-external-link-alt" style={{ paddingRight: '8px' }}></i>See your file right here
          </button>
        </div>
        <div id="info">
          <button className="button" onClick={handleShowInfo}>
            <i className="fa fa-info-circle" style={{ paddingRight: '8px' }}></i>Info</button>
        </div>
        {showInfo && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={handleCloseInfo}>&times;</span>
              <p><strong>Begin by downloading the file. Customize it according to your preferences, and then it will be ready for submission.</strong></p>
              <h2>File Format Information</h2>
              <p><strong>Student's File:</strong> The excel file should contain the following columns: ΑΜ,Επώνυμο,Όνομα,Ακαδημαϊκό Email.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Teacher_ins_stud;
