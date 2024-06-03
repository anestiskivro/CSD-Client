import axios from 'axios';
import React, { useState } from 'react';
import './admin_op.css';

function AdminOp() {
    const [fileData, setFileData] = useState(null);

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
                'http://localhost:3001/admin',
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
            alert('An error occurred. Please try again later.');
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
                'http://localhost:3001/admin/insertcourses',
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
            alert('An error occurred. Please try again later.');
        }
    };
    //TODO: Ο υπεύθυνος του συστήματος θα πραγματοποιεί δύο ενέργειες. Μία θα είναι να εισάγει τα μαθήματα που 
    //υπάρχουν για το συγκεκριμένο εξάμηνο. Η δεύτερη ενέργεια θα είναι να εισάγει τους καθηγητές όπου θα αντιστοιχούν με τα μαθήματα 
    //που έχουν καταχωρηθεί.
    return (
        <div className="right">
            <div id="file">
                <h2>Insert the teachers here</h2>
                <input type="file" name="file" accept=".csv" onChange={handleFileUpload} />
            </div>
            <div id="import">
                <button className="button" onClick={uploadToTeachers}>
                    <i className="fa-regular fa-file-lines" style={{ paddingRight: '8px' }}></i>Insert Teachers</button>
            </div>
            <div id="file">
                <h2>Insert the courses here</h2>
                <input type="file" name="file" accept=".csv" onChange={handleFileUpload} />
            </div>
            <div id="import">
                <button className="button" onClick={uploadToCourses}>
                    <i className="fa-regular fa-file-lines" style={{ paddingRight: '8px' }}></i>Insert Courses</button>
            </div>
        </div>
    );
}

export default AdminOp;