import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Info from './info';

function TeachingAssistant() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, selectedCourse } = location.state || {};
  const [fileData, setFileData] = useState(null);
  const handleTAUpload = (e) => {
    const file = e.target.files[0];
    setFileData(file);
  };
  const handleInsertTA = async() => {
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
        'http://localhost:3001/teacher/SetTAs',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 200) {
        console.log('Data imported successfully');
      } else {
        alert('Data import failed.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    }
  }
  const handleBack = () => {
    navigate('/teacher', { state: { email } });
  };

  return (
    <div className="admin1">
      <Info email={email}></Info>
      <div className="right">
      <h3>Insert the file here</h3>
      <input type="file" name="file" accept=".csv" onChange={handleTAUpload} />
      <div className='btn-group'>
        <button className="button" onClick={handleInsertTA}>
        <i class="fa-solid fa-file-import" style={{ paddingRight: '8px' }}></i>Set Teaching Assistants</button>
          <button className="button" onClick={handleBack}>
          <i className="fa-solid fa-arrow-left" style={{ paddingRight: '8px' }}></i>Back
          </button>
          </div>
    </div>
    </div>
  );
}

export default TeachingAssistant;