import axios from 'axios';
import React, { useState } from 'react';
import './admin_op.css';

function AdminOp() {
    const [fileData, setFileData] = useState(null);
    const [showInfo, setShowInfo] = useState(false);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        setFileData(file);
    };

    const handleReset = async () => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_API_URL}/admin/reset`);
            if (response.status === 200) {
                localStorage.clear();
                alert('Data cleared successfully');
            } else {
                alert('Failed to clear data');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to clear data');
        }
    };

    const uploadToTeachers = async () => {
        if (!fileData) {
            alert('Please select a file');
            return;
        }
        try {
            const formData = new FormData();
            formData.append('file', fileData);
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/admin`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 200) {
                alert('Data imported successfully');
            } else {
                alert('Data import failed.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('The insertion of file teachers was not successful');
        }
    };

    const uploadToCourses = async () => {
        if (!fileData) {
            alert('Please select a file');
            return;
        }
        try {
            const formData = new FormData();
            formData.append('file', fileData);
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/admin/insertcourses`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 200) {
                alert('Data imported successfully');
            } else {
                alert('Data import failed.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('The insertion of file courses was not successful');
        }
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
        <div className="right">
            <div id="file">
                <h2>Insert the teachers here</h2>
                <input type="file" name="file" onChange={handleFileUpload} />
            </div>
            <div id="import">
                <button className="button" onClick={uploadToTeachers}>
                    <i className="fa-regular fa-file-lines" style={{ paddingRight: '8px' }}></i>Insert Teachers
                </button>
            </div>
            <a href={`${process.env.PUBLIC_URL}/teachers.xls`} download="teachers.xls" className="button">
                <i className="fa fa-download" style={{ paddingRight: '8px' }}></i>Download Teachers File
            </a>
            <div id="file">
                <h2>Insert the courses here</h2>
                <input type="file" name="file" onChange={handleFileUpload} />
            </div>
            <div id="import">
                <button className="button" onClick={uploadToCourses}>
                    <i className="fa-regular fa-file-lines" style={{ paddingRight: '8px' }}></i>Insert Courses
                </button>
            </div>
            <a href={`${process.env.PUBLIC_URL}/courses.xlsx`} download="courses.xlsx" className="button">
                <i className="fa fa-download" style={{ paddingRight: '8px' }}></i>Download Courses File
            </a>
            <div id="import1">
                <button className="button" onClick={seeFile}>
                    <i className="fa fa-external-link-alt" style={{ paddingRight: '8px' }}></i>See your file right here
                </button>
            </div>
            <div id="import1">
                <button className="button" onClick={handleShowInfo}>
                    <i className="fa fa-info-circle" style={{ paddingRight: '8px' }}></i>Info
                </button>
                <button className="button" onClick={handleReset}>
                    <i className="fa-solid fa-arrows-rotate" style={{ paddingRight: '8px' }}></i>Reset
                </button>
            </div>
            {showInfo && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseInfo}>&times;</span>
                        <p><strong>Begin by downloading the file. Customize it according to your preferences, and then it will be ready for submission.</strong></p>
                        <h2>File Format Information</h2>
                        <p><strong>Teachers File:</strong> The Excel file should contain the following columns: Επώνυμο, Όνομα, Email.</p>
                        <p><strong>Courses File:</strong> The Excel file should contain the following columns: Τμήμα, Κωδικός, Τίτλος, Καθηγητής, ECTS, Τύπος.</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminOp;
