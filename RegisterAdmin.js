import React, { useState } from 'react';
import API from '../services/api'
import { useNavigate } from 'react-router-dom';


const RegisterAdmin = ({Admin}) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const navigate = useNavigate();
    
    if(!Admin){
        alert('You are not authorized to access this page.');
        navigate('/login');
    }

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let res = await API.post('/admin/register', formData);
            setMessage('Registration successful!');
            if (res.status === 200) {
            // localStorage.setItem('token', res.data.token);
            // setIsLoggedIn(true);
            navigate('/admin/dashboard');
            }

            
        } catch (err) {
            setMessage(err.response?.data?.message || 'Registration failed.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Admin Register</h2>

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onChange={handleChange}
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full p-3 border rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onChange={handleChange}
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
                >
                    Register
                </button>
                <p className="text-center text-sm text-gray-500 mt-4">
                    Already have an account? <a href="/admin/login" className="text-blue-600 hover:underline">Login</a>
                </p>

                {message && <p className="mt-4 text-center text-sm text-red-600">{message}</p>}
            </form>
        </div>
    );
};

export default RegisterAdmin;