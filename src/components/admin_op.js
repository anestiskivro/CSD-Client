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

    const uploadToTeachers = async () => {
        if (!fileData) {
            alert('Please select a file');
            return;
        }
        try {
            const formData = new FormData();
            formData.append('file', fileData);
            const response = await axios.post(
                'https://rendezvous-csd-106ea9dcba7a.herokuapp.com/admin',
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
            alert('The insertion of file teachers was not succesful');
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
            const response = await axios.post(
                'https://rendezvous-csd-106ea9dcba7a.herokuapp.com/admin/insertcourses',
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
            alert('The insertion of file courses was not succesful');
        }
    };

    const handleShowInfo = () => {
        setShowInfo(true);
    };

    const handleCloseInfo = () => {
        setShowInfo(false);
    };

    return (
        <div className="right">
            <div id="file">
                <h2>Insert the teachers here</h2>
                <input type="file" name="file" onChange={handleFileUpload} />
            </div>
            <div id="import">
                <button className="button" onClick={uploadToTeachers}>
                    <i className="fa-regular fa-file-lines" style={{ paddingRight: '8px' }}></i>Insert Teachers</button>
            </div>
            <a href="/Lista HY-252 2023 Καθηγητες.xlsx" download className="button">
                <i className="fa fa-download" style={{ paddingRight: '8px' }}></i>Download Teachers File
            </a>
            <div id="file">
                <h2>Insert the courses here</h2>
                <input type="file" name="file" onChange={handleFileUpload} />
            </div>
            <div id="import">
                <button className="button" onClick={uploadToCourses}>
                    <i className="fa-regular fa-file-lines" style={{ paddingRight: '8px' }}></i>Insert Courses</button>
            </div>
            <a href="/Lista HY-252 2023 μαθήματα.xlsx" download className="button">
                <i className="fa fa-download" style={{ paddingRight: '8px' }}></i>Download Courses File
            </a>
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
                        <p><strong>Teachers File:</strong> The excel file should contain the following columns: Επώνυμο, Όνομα, Email.</p>
                        <p><strong>Courses File:</strong> The excel file should contain the following columns: Τμήμα, Κωδικός, Τίτλος, Καθηγητής, ECTS, Τύπος.</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminOp;
