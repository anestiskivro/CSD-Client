import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/`, {
            withCredentials: true
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
    }, [navigate]);

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/`, { email }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (response.status === 200) {
                alert('Login successful');
                console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
                const user = response.data.user;
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
        <div className="right">
            <div className="header">
                <h1 id="login">Login</h1>
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
