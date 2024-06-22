import React from 'react';
import { useLocation } from 'react-router-dom';
import Appointment from '../components/appointment';
import Info from '../components/info';

function Student() {
    const location = useLocation();
    const { email } = location.state || {};
    const { id } = location.state || {};
    return (
        <div className="container" style={{ display: 'flex' }}>
            <div className="info">
                <Info email={email} />
            </div>
            <div className="appointment">
                <Appointment id={id} email={email} />
            </div>
        </div>
    );
}

export default Student