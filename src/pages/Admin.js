import { default as React } from 'react';
import { useLocation } from 'react-router-dom';
import AdminOp from '../components/admin_op';
import Info from '../components/info';
import '../components/info.css';

function Admin() {
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const location = useLocation();
    const { email } = location.state || {};
    return (
        <div className={`home-container ${isMobile ? 'mobile' : 'desktop'}`}>
        <Info email={email}></Info>
        <AdminOp  email={email} />
        </div>
    );
}

export default Admin