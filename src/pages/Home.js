import React from 'react';
import Info from '../components/info';
import Login from '../components/login';
function Home() {
    return (
        <div style={{ display: 'flex' }}>
            <Info />
            <Login />
        </div>
    )
}

export default Home