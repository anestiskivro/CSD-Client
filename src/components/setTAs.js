import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../components/teacher_op.css";
import Info from './info';

function TeachingAssistant() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, selectedCourse } = location.state || {};
  const [fileData, setFileData] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const handleTAUpload = (e) => {
    const file = e.target.files[0];
    setFileData(file);
  };
  const handleInsertTA = async () => {
    if (!fileData) {
      alert('Please select a file');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', fileData);
      formData.append('selectedCourse', selectedCourse);
      console.log(selectedCourse)
      const response = await axios.post(
        'https://rendezvous-csd-106ea9dcba7a.herokuapp.com/teacher/SetTAs',
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
        alert('Data import failed.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('The insertion of file teaching assistants was not succesful');
    }
  }
  const handleBack = () => {
    navigate('/teacher', { state: { email } });
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
    <div className="admin1">
      <Info email={email}></Info>
      <div className="right">
        <h3>Insert the file here</h3>
        <input type="file" name="file" onChange={handleTAUpload} />
        <div className='btn-group'>
          <button className="button" onClick={handleInsertTA}>
            <i class="fa-solid fa-file-import" style={{ paddingRight: '8px' }}></i>Set Teaching Assistants</button>
          <button className="button" onClick={handleBack}>
            <i className="fa-solid fa-arrow-left" style={{ paddingRight: '8px' }}></i>Back
          </button>
        </div>
        <a href={`${process.env.PUBLIC_URL}/tassistants.xlsx`} download="tassistants.xlsx" className="button">
          <i className="fa fa-download" style={{ paddingRight: '8px' }}></i>Download TA's File
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
              <p><strong>TA's File:</strong> The excel file should contain the following columns: ΑΜ,Επώνυμο,Όνομα,Ακαδημαϊκό Email.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeachingAssistant;