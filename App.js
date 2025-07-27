import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
// import ExcelUpload from './pages/ExcelUpload';
import ExcelFileViewer from './components/ExcelFileViewer';
import ThreeDChart from './components/ThreeDChart';
import InsightsPage from './pages/InsightsPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import RegisterAdmin from './pages/RegisterAdmin';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [Admin, setAdmin] = useState(!!localStorage.getItem('adminToken'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
      setAdmin(!!localStorage.getItem('adminToken'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
    window.location.href = '/login';
  };


  return (
    <Router>
      {/* <div style={{ padding: '1rem', background: '#f6f6f6' }}> */}
      <div className='p-3 bg-indigo-300'>
        {/* <nav style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/">Dashboard</Link>
          {!isLoggedIn && <Link to="/login">Login</Link>}
          {!isLoggedIn && <Link to="/register">Register</Link>}
          {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
        </nav> */}

        <nav className="flex items-center justify-between bg-white border-b border-grey-200 shadow-md px-6 py-4 rounded-b-xl">
          {/* Left Side: Brand or Dashboard Link */}
          <div className="text-xl font-bold text-indigo-700">
            <Link to="/">📊 Dashboard</Link>
          </div>

          {/* Right Side: Navigation Links */}
          <div className="flex gap-6 items-center text-gray-700 font-medium">
            {!isLoggedIn && !Admin && (
              <>
                <Link to="/admin/login" className="hover:text-indigo-700 transition">
                  Admin
                </Link>
                <Link to="/login" className="hover:text-indigo-700 transition">Login</Link>
                <Link to="/register" className="hover:text-indigo-700 transition">Register</Link>

              </>
            )}
            {Admin && (
              <>
                {/* <Link to="/admin/login" className="hover:text-indigo-700 transition">
                  Admin
                </Link>
                <Link to="/login" className="hover:text-indigo-700 transition">Login</Link>
                <Link to="/register" className="hover:text-indigo-700 transition">Register</Link> */}
                <button
                  onClick={handleLogout}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </>
            )}
            {isLoggedIn && (
              <>
                <div className="text-xl font-bold text-indigo-700">
                  <Link to="/excelfileviewer" className="ml-6 text-gray-700 hover:text-indigo-700 transition">2D charts</Link>
                  <Link to="/threedchart" className="ml-6 text-gray-700 hover:text-indigo-700 transition">3D charts</Link>
                  <Link to="/insightpage" className="ml-6 text-gray-700 hover:text-indigo-700 transition">AI Insights</Link>
                  {/* {/* <Link to="/analyze/:id" className="ml-6 text-gray-700 hover:text-indigo-700 transition">AI Insights</Link> */}
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </>

            )}
          </div>
        </nav>


      </div>

      <Routes>
        <Route path="/" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/login" element={!isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />} />
        <Route path="/register" element={!isLoggedIn ? <Register setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />} />
        <Route path="/admin/login" element={!Admin ? <AdminLogin setAdmin={setAdmin} />: <Navigate to ="/admin/dashboard" />} />
        <Route path = "/admin/dashboard" element={Admin ? <AdminDashboard /> : <Navigate to="/admin/login" />} />
        <Route path = "/admin/register" element={Admin ? <RegisterAdmin Admin={Admin}/> : <Navigate to="/admin/login"/>} />
        <Route path="/excelfileviewer" element={<ExcelFileViewer />} />
        <Route path="/threedchart" element={<ThreeDChart />} />
        <Route path="/insightpage" element={<InsightsPage />} />
        {/* <Route path="/analyze/:id" element={<InsightsPage />} /> */}
        {/* <Route path="/excelupload" element={isLoggedIn ? <ExcelUpload /> : <Navigate to="/login" />} /> */}

      </Routes>
    </Router>

  );
}

export default App;
