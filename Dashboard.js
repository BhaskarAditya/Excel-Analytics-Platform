import React from 'react';
import { Upload, BarChart3, ShieldCheck, ChartArea, Lightbulb } from 'lucide-react';
// import { useState, useRef } from 'react';
// import FileUpload from '../components/FileUpload';
// import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
// import ExcelFileViewer from '../components/ExcelFileViewer';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);



const Dashboard = () => {
    const navigate = useNavigate();
    return (
        <>

            <main className=" min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 flex flex-col items-center justify-center px-6 py-12 ">
                {/* Header */}
                <header className="max-w-3xl text-center mb-12">
                    <h1 className="text-5xl font-bold text-indigo-700 leading-tight">
                        📊 Excel Analytics Platform
                    </h1>
                    <p className="mt-4 text-lg text-gray-700">
                        Upload. Analyze. Visualize your Excel data with beautiful charts and secure access.
                    </p>
                </header>

                {/* Upload Section */}
                <section className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-xl border border-gray-200 mb-16">
                    <h2 className="text-xl font-semibold text-indigo-600 mb-4">🚀 Get Started</h2>
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <p className="text-gray-600">Start by uploading your Excel file to see visual insights instantly.</p>
                        <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl shadow hover:bg-indigo-700 transition"
                            onClick={() => navigate('/excelfileviewer')}>
                            Upload File
                        </button>
                    </div>
                </section>

                {/* Features */}
                {/* <section className="grid md:grid-cols-3 gap-8 text-center"> */}
                <section className="grid md:grid-cols-3 gap-8 text-center">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border hover:scale-105 transition"
                        onClick={() => navigate('/excelfileviewer')}>
                        <BarChart3 className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Interactive 2D Charts</h3>
                        <p className="text-sm text-gray-600">Visualize your Excel data with bar, line, pie, and scatter charts powered by Chart.js.</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-lg border hover:scale-105 transition"
                        onClick={() => navigate('/insightpage')}>
                        {/* <ShieldCheck className="w-12 h-12 text-indigo-600 mx-auto mb-4" /> */}
                        <Lightbulb className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                        {/* <ChartArea className="w-12 h-12 text-indigo-600 mx-auto mb-4" /> */}
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">AI Suggestion</h3>
                        <p className="text-sm text-gray-600">All your data is protected with authentication and secure routes.</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-lg border hover:scale-105 transition"
                        onClick={() => navigate('/threedchart')}>
                        {/* <Upload className="w-12 h-12 text-indigo-600 mx-auto mb-4" /> */}
                        <ChartArea className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Interactive 3D Charts</h3>
                        <p className="text-sm text-gray-600">Drop browse Excel files with visulize 3D charts</p>
                    </div>

                </section>


                {/* <div className="w-full h-full pb-0">

                    <Footer />
                </div> */}
            </main>
            {/* <Footer /> */}
        </>


    );
};

export default Dashboard;
