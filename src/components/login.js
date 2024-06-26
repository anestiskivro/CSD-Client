import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                const data = response.data;
                if (data.loggedIn) {
                    switch (data.id) {
                        case 'admin':
                            navigate('/admin');
                            break;
                        case 'teacher':
                            navigate('/teacher');
                            break;
                        case 'TA':
                            navigate('/ta');
                            break;
                        case 'student':
                            navigate('/student');
                            break;
                        default:
                            navigate('/');
                    }
                } else {
                    navigate('/');
                }
            })
            .catch(error => {
                console.error('Error authenticating user:', error);
                navigate('/');
            });
        } else {
            navigate('/');
        }
    }, [navigate]);

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('https://rendezvous-csd-106ea9dcba7a.herokuapp.com', { email }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (response.status === 200) {
                alert('Login successful');
                const user = response.data.user;
                const token = response.data.token;
                localStorage.setItem('token', token);
                if (user.email.includes("admin")) {
                    navigate("/admin", { state: { id: user.id, email: user.email } });
                } else if (user.id === "TA") {
                    navigate("/tassistant", { state: { id: user.id, email: user.email } });
                } else if (user.id === "student") {
                    navigate("/student", { state: { id: user.id, email: user.email } });
                } else {
                    navigate("/teacher", { state: { id: user.id, email: user.email } });
                }
            } else {
                alert('Login failed. Please check your email.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later. Check your connection to the Internet');
        }
    };

    return (
        <div className="container">
            <div className="left">
                <div className="header">
                    <img src="/imagesUOC.png" alt="Logo" className="logo" />
                    <h1>Welcome</h1>
                    <h2>Rendezvous System for CSD Courses</h2>
                    <p>This is an application for the Examination of Students</p>
                </div>
                <div className="social-icons">
                    <a href="#"><i className="fab fa-facebook"></i></a>
                    <a href="#"><i className="fab fa-instagram"></i></a>
                    <a href="#"><i className="fab fa-twitter"></i></a>
                </div>
            </div>
            <div className="right">
                <div className="form-container">
                    <form onSubmit={handleFormSubmit}>
                        <label htmlFor="email"><strong>Email:</strong></label><br />
                        <input type="email" placeholder='Email...'
                            onChange={(event) => setEmail(event.target.value)} /><br /> <br />
                        <input className="button" type="submit" value="Login" id="submit" />
                    </form>
                    <p>Forgot password? <a href="https://webmail.csd.uoc.gr/">Click here</a></p>
                </div>
            </div>
        </div>
    );
}

export default Login;
