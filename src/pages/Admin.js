import { default as React } from 'react';
import { useLocation } from 'react-router-dom';
import AdminOp from '../components/admin_op';
import Info from '../components/info';

function Admin() {
    const location = useLocation();
    const { email } = location.state || {};
    return (
        <div style={{ display: 'flex' }}>
        <Info email={email}></Info>
        <AdminOp  email={email} />
        </div>
    );
}

export default Admin