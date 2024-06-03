import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;
    useEffect(() => {
        axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/").then((response) => {
            if(response.data.loggedIn === true){
                if( response.data.email.includes("csdp")){
                    navigate("/tassistant", { state: { email: response.data.email } });
                }else if(response.data.email.includes("admin")) {
                    navigate("/admin", { state: { email: response.data.email } });
                }else if(response.data.email.includes("csd")){
                    navigate("/student", { state: { email: response.data.email } });
                }else {
                    navigate("/teacher", { state: { email: response.data.email } });
                }
            }
        })
    },[navigate])
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
                const userEmail = response.data.email;
                if (userEmail.includes("admin")) {
                    navigate("/admin", { state: { email: userEmail } });
                }else if (userEmail.includes("csdp")) {
                    navigate("/tassistant", { state: { email: userEmail } });
                }else if (userEmail.includes("csd")) {
                    navigate("/student", { state: { email: userEmail } });
                }else {
                    navigate("/teacher",{ state: { email: userEmail } });
                }
            } else {
                alert('Login failed. Please check your email.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
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