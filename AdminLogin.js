// pages/AdminLogin.js
import { useState } from 'react';
import API from '../services/api';

export default function AdminLogin({ setAdmin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        const res = await API.post('/auth/login', { email, password });
        localStorage.setItem('adminToken', res.data.token);
        setAdmin(true);
    };

    return (
        // <div className="p-6 max-w-sm mx-auto bg-white shadow rounded">
        //     <h2 className="text-xl font-bold mb-4">Admin Login</h2>
        //     <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="mb-2 border p-2 w-full" />
        //     <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="mb-4 border p-2 w-full" />
        //     <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>

        // </div>


        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-300 px-4">
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-6">
                <h2 className="text-3xl font-extrabold text-center text-indigo-700">
                    Admin Login
                </h2>

                <div className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        onClick={handleLogin}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-300"
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>

    );
}
