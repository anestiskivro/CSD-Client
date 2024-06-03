import React from 'react';
import { useLocation } from 'react-router-dom';
import Info from '../components/info';
import TeacherOp from '../components/teacher_op';

function Teacher_page() {
    const location = useLocation();
    const { email } = location.state || {};
    return (
        <div style={{ display: 'flex' }}>
            <Info email={email}></Info>
            <TeacherOp email={email} />
        </div>
    );
}

export default Teacher_page;