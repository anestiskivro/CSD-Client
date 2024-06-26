import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { useLocation } from 'react-router-dom';
import Appointment from '../components/appointment';
import Info from '../components/info';
import '../components/info.css';

function TAssistant() {
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const location = useLocation();
    const { email } = location.state || {};
    const { id } = location.state || {};
    return (
        <div className={`home-container ${isMobile ? 'mobile' : 'desktop'}`}>
            <Info email={email}></Info>
            <Appointment id={id} email={email} />
        </div>
    );
}

export default TAssistant