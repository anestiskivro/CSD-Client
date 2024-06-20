import React from 'react';
import { useLocation } from 'react-router-dom';
import Appointment from '../components/appointment';
import Info from '../components/info';

function TAssistant() {
    const location = useLocation();
    const { email } = location.state || {};
    const { id } = location.state || {};
    return (
        <div style={{ display: 'flex' }}>
            <Info email={email}></Info>
            <Appointment id={id} email={email} />
        </div>
    );
}

export default TAssistant