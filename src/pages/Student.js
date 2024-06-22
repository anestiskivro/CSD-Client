import React from 'react';
import { useLocation } from 'react-router-dom';
import Appointment from './Appointment';
import Info from './Info';

function Student() {
    const location = useLocation();
    const { email } = location.state || {};
    const { id } = location.state || {};

    return (
        <div>
            <style>
                {`
                    @media (max-width: 600px) {
                        .container {
                            flex-direction: column;
                            align-items: center;
                        }
                    
                        .info {
                            width: 100%;
                            text-align: center;
                        }
                    
                        .appointment {
                            width: 100%;
                        }
                    }
                `}
            </style>
            <div className="container" style={{ display: 'flex' }}>
                <div className="info">
                    <Info email={email} />
                </div>
                <div className="appointment">
                    <Appointment id={id} email={email} />
                </div>
            </div>
        </div>
    );
}

export default Student;