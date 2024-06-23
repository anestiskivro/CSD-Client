import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { useLocation } from 'react-router-dom';
import Info from '../components/info';
import '../components/info.css';
import TeacherOp from '../components/teacher_op';

function Teacher_page() {
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const location = useLocation();
    const { email } = location.state || {};
    const { id } = location.state || {};
    return (
        <div className={`home-container ${isMobile ? 'mobile' : 'desktop'}`}>
            <Info email={email}></Info>
            <TeacherOp id={id} email={email} />
        </div>
    );
}

export default Teacher_page;