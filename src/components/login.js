import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/")
            .then((response) => {
                if (response.data.loggedIn === true) {
                    if (response.data.id.includes("TA")) {
                        navigate("/tassistant", { state: { id: response.data.id, email: response.data.email } });
                    } else if (response.data.id.includes("teacher")) {
                        navigate("/teacher", { state: { id: response.data.id, email: response.data.email } });
                    } else if (response.data.id.includes("student")) {
                        navigate("/student", { state: { id: response.data.id, email: response.data.email } });
                    } else {
                        navigate("/admin", { state: { id: response.data.id, email: response.data.email } });
                    }
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, [navigate]);

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('https://rendezvous-csd-106ea9dcba7a.herokuapp.com', { email }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                alert('Login successful');
                const userEmail = response.data;
                if (userEmail.email.includes("admin")) {
                    navigate("/admin", { state: { id: userEmail.id, email: userEmail.email } });
                } else if (userEmail.id === "TA") {
                    navigate("/tassistant", { state: { id: userEmail.id, email: userEmail.email } });
                } else if (userEmail.id === "student") {
                    navigate("/student", { state: { id: userEmail.id, email: userEmail.email } });
                } else {
                    navigate("/teacher", { state: { id: userEmail.id, email: userEmail.email } });
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