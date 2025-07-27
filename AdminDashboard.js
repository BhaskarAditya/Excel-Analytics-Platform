import { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const [stats, setStats] = useState({});
    const [recentUsers, setRecentUsers] = useState([]);
    const [recentFiles, setRecentFiles] = useState([]);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            const res = await API.get('/admin/dashboard', {
                headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
            });
            setStats(res.data);
        };

        const fetchRecentUsers = async () => {
            const res = await API.get('/admin/users', {
                headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
            });
            setRecentUsers(res.data);
        };

        const fetchRecentFiles = async () => {
            const res = await API.get('/admin/records', {
                headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
            });
            setRecentFiles(res.data);
        };

        fetchStats();
        fetchRecentUsers();
        fetchRecentFiles();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 px-6 py-10">
            <div className="max-w-6xl mx-auto space-y-10">
                <div className="items-center text-center ">
                    <h1 className="text-4xl font-bold text-indigo-700">Admin Dashboard</h1>
                    
                    {/* <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        🔓 Logout
                    </button> */}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white shadow-lg rounded-xl p-6 text-center">
                        <h2 className="text-lg font-semibold text-gray-600">Total Users</h2>
                        <p className="text-3xl font-bold text-indigo-600 mt-2">{stats.userCount}</p>
                    </div>
                    <div className="bg-white shadow-lg rounded-xl p-6 text-center">
                        <h2 className="text-lg font-semibold text-gray-600">Total Files</h2>
                        <p className="text-3xl font-bold text-indigo-600 mt-2">{stats.recordCount}</p>
                    </div>
                    <div className="bg-white shadow-lg rounded-xl p-6 text-center">
                        <h2 className="text-lg font-semibold text-gray-600">Total Insights</h2>
                        <p className="text-3xl font-bold text-indigo-600 mt-2">{stats.insightCount}</p>
                    </div>
                </div>

                {/* Register Button */}
                <div className="text-center">
                    <button
                        onClick={() => navigate('/admin/register')}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition duration-300"
                    >
                        ➕ Register New Admin
                    </button>
                </div>

                {/* Search + User Table */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-700">Recent Users</h2>
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border px-3 py-2 rounded w-64 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-center">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2">Name</th>
                                    <th className="px-4 py-2">Email</th>
                                    {/* <th className="px-4 py-2">Joined</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {recentUsers
                                    // .filter(user =>
                                    //     user.name.toLowerCase().includes(search.toLowerCase()) ||
                                    //     user.email.toLowerCase().includes(search.toLowerCase())
                                    // )

                                    .map((user) => (
                                        <tr key={user._id} className="border-b">
                                            <td className="px-4 py-2">{user.name}</td>
                                            <td className="px-4 py-2">{user.email}</td>
                                            {/* <td className="px-4 py-2">{new Date(user.uploadedBy).toLocaleDateString()}</td> */}
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Files Table */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent File Uploads</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2">User</th>
                                    <th className="px-4 py-2">Filename</th>
                                    <th className="px-4 py-2">Uploaded</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentFiles.map((file) => (
                                    <tr key={file._id} className="border-b">
                                        <td className="px-4 py-2">{file.fileName}</td>
                                        <td className="px-4 py-2">{file.fileName}</td>
                                        <td className="px-4 py-2">{new Date(file.uploadedAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
