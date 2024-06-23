import React from 'react';
import { useMediaQuery } from 'react-responsive';
import Info from '../components/info';
import '../components/info.css';
import Login from '../components/login';
function Home() {
    const isMobile = useMediaQuery({ maxWidth: 768 });

    return (
        <div className={`home-container ${isMobile ? 'mobile' : 'desktop'}`}>
            <Info />
            <Login />
        </div>
    );
}

export default Home;