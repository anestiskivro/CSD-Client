import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from './footer';
import './info.css';
const Info = ({ email }) => {
  const navigate = useNavigate();
  const handleSignOut = async () => {
    try {
      await axios.post('https://rendezvous-csd-106ea9dcba7a.herokuapp.com/logout');
      navigate('/');
    }
    catch (error) {
      console.error('Error logging out:', error);
    }
  };
  return (
    <div className="left">
      <div className="header">
        <img src="/imagesUOC.png" alt="Logo" className="logo" />
        <h1>Welcome</h1>
        <h2>Rendezvous System for CSD Courses</h2>
        {email ? (
          <div>
            <h3><i class="fa-solid fa-user" style={{ paddingRight: '8px' }}></i>User: {email}</h3>
            <button className="button" onClick={handleSignOut}>
              <i className="fa-solid fa-sign-out-alt" style={{ paddingRight: '8px' }}></i>Sign Out</button>
          </div>
        ) : (
          <h3>This is an application for the Examination of Students</h3>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Info;