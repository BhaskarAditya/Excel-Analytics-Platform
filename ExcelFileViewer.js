import { useState, useRef } from 'react';
import FileUpload from '../components/FileUpload';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';

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
import ThreeDChart from './ThreeDChart';
import Footer from './Footer';
import PdfDownload from './PdfDownload';
import DataPreview from './DataPreview';


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


const ExcelFileViewer = () => {

    const [chartData, setChartData] = useState(null);
    const [selectedChart, setSelectedChart] = useState('bar');
    const [columns, setColumns] = useState([]);
    const [xAxis, setXAxis] = useState('');
    const [yAxis, setYAxis] = useState('');
    const navigate = useNavigate();
    const chatRef = useRef()

    const handleParsedData = (data) => {
        data = data.data
        const keys = Object.keys(data[0]);
        setColumns(keys);
        setXAxis(keys[0]);
        setYAxis(keys[1] || keys[0]);

        const xData = data.map(row => row[keys[0]]);
        const yData = data.map(row => row[keys[1]]);

        setChartData({
            raw: data,
            labels: xData,
            datasets: [
                {
                    label: 'Excel Data',
                    data: yData,
                    backgroundColor: 'rgba(59, 130, 246, 0.6)'
                },
            ],
        });
    };

    const updateChartData = (newX, newY) => {
        if (!chartData?.raw) return;
        const xData = chartData.raw.map(row => row[newX]);
        const yData = chartData.raw.map(row => row[newY]);

        setChartData(prev => ({
            ...prev,
            labels: xData,
            datasets: [{ ...prev.datasets[0], data: yData }],
        }));
    };

    const renderChart = () => {
        if (!chartData || !xAxis || (!yAxis && selectedChart !== 'pie')) {
            return <div className="text-gray-500 italic">Please upload data and select axes.</div>;
        }

        switch (selectedChart) {
            case 'bar':
                return <Bar ref={chatRef} data={chartData} options={{ responsive: true }} />;
            case 'line':
                return <Line ref={chatRef} data={chartData} options={{ responsive: true }} />;
            case 'pie': {
                const groupedData = {};
                chartData.raw.forEach(row => {
                    const key = row[xAxis];
                    const value = parseFloat(row[yAxis]) || 0;
                    if (!groupedData[key]) groupedData[key] = 0;
                    groupedData[key] += value;
                });
                const labels = Object.keys(groupedData);
                const data = Object.values(groupedData);
                const backgroundColor = labels.map(() =>
                    `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
                );
                return <Pie ref={chatRef} data={{ labels, datasets: [{ data, backgroundColor }] }} options={{ responsive: true }} />;
            }
            case 'scatter':
                return <Scatter ref={chatRef} data={{ datasets: [{ label: `${xAxis} vs ${yAxis}`, data: chartData.raw.map(row => ({ x: row[xAxis], y: row[yAxis] })), backgroundColor: 'rgba(99, 102, 241, 0.6)' }] }} options={{ responsive: true }} />;
            default:
                return null;
        }
    };

    const handleDownload = () => {
        const chartInstance = chatRef.current;
        if (!chartInstance) {
            return;
        }
        const canvas = chartInstance.canvas;
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'charts.png';
        link.click();
    };

    return (
        

        <div >

            {/* Content */}
            <main className="p-8 space-y-10 pb-0 bg-gray-50 min-h-screen "> {/* Added bg-gray-50 and min-h-screen */}
                {/* Upload */}
                <section className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200"> {/* Increased padding, rounded corners, stronger shadow, subtle border */}
                    <h2 className="text-2xl font-bold text-indigo-800 mb-6 flex items-center"> {/* Larger, bolder, darker indigo, added flex for icon alignment */}
                        <svg className="w-7 h-7 mr-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                        Upload Excel File
                    </h2>
                    <FileUpload onParsed={handleParsedData} />
                </section>

                {/* Chart Options */}
                <section className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200"> {/* Consistent styling with upload section */}
                    <h2 className="text-2xl font-bold text-indigo-800 mb-6 flex items-center"> {/* Consistent heading style */}
                        <svg className="w-7 h-7 mr-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        Configure Chart
                    </h2>
                    <div className="space-y-6"> {/* Increased space between elements */}
                        <select
                            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition duration-200 ease-in-out text-gray-700 text-base" /* Enhanced focus styles, better border, larger text, transition */
                            value={selectedChart}
                            onChange={(e) => setSelectedChart(e.target.value)}
                        >
                            <option value="bar">Bar Chart</option>
                            <option value="line">Line Chart</option>
                            <option value="pie">Pie Chart</option>
                            <option value="scatter">Scatter Chart</option>
                        </select>

                        {columns.length > 0 && (
                            <div className="flex flex-wrap gap-8"> {/* Increased gap */}
                                <div className="flex-1 min-w-[240px]"> {/* Slightly wider min-width */}
                                    <label className="block mb-2 font-semibold text-gray-700">X-Axis</label> {/* Bolder label */}
                                    <select
                                        value={xAxis}
                                        onChange={(e) => {
                                            setXAxis(e.target.value);
                                            updateChartData(e.target.value, yAxis);
                                        }}
                                        className="w-full border border-gray-300 p-2.5 rounded-md shadow-sm focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition duration-200 ease-in-out text-gray-700 text-base" /* Enhanced focus styles, better border, larger text, transition */
                                    >
                                        {columns.map((col, i) => <option key={i} value={col}>{col}</option>)}
                                    </select>
                                </div>
                                {selectedChart !== 'pie' && (
                                    <div className="flex-1 min-w-[240px]"> {/* Slightly wider min-width */}
                                        <label className="block mb-2 font-semibold text-gray-700">Y-Axis</label> {/* Bolder label */}
                                        <select
                                            value={yAxis}
                                            onChange={(e) => {
                                                setYAxis(e.target.value);
                                                updateChartData(xAxis, e.target.value);
                                            }}
                                            className="w-full border border-gray-300 p-2.5 rounded-md shadow-sm focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition duration-200 ease-in-out text-gray-700 text-base" /* Enhanced focus styles, better border, larger text, transition */
                                        >
                                            {columns.map((col, i) => <option key={i} value={col}>{col}</option>)}
                                        </select>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {/* Chart Section */}
                <section className=" bg-white p-8 rounded-2xl shadow-xl border  border-gray-200"> {/* Consistent styling */}
                    <h2 className="text-2xl font-bold text-indigo-800 mb-6 flex items-center"> {/* Consistent heading style */}
                        <svg className="w-7 h-7 mr-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"></path></svg>
                        Chart Preview
                    </h2>
                    <div id="myChart" className="max-w-screen-lg bg-gray-100 p-4 rounded-lg mb-6 flex justify-center items-center min-h-[300px]">
                        {/* <div id="myChart" className="max-w-screen-xl bg-gray-100 p-4 rounded-lg mb-6 flex justify-center items-center min-h-[300px]">  */}
                        {renderChart()}
                    </div>
                    <button className="bg-indigo-600 text-white px-6 py-3 mr-4 rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 ease-in-out inline-flex items-center text-lg font-semibold transform hover:scale-105" /* Larger padding, rounded-full, stronger shadow, smoother transition, slightly larger text, scale on hover */
                        onClick={handleDownload}>
                        <svg className="fill-current w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg>
                        <span>Export png</span>
                    </button>


                    <PdfDownload targetRefId="myChart" />

                </section>


                {/* Excel Viewer */}
                <section className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200"> {/* Consistent styling */}
                    <h2 className="text-2xl font-bold text-indigo-800 mb-6 flex items-center"> {/* Consistent heading style */}
                        <svg className="w-7 h-7 mr-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-5h2m-2 0h2m-2 0V9m2 0V7m0 0a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2z"></path></svg>
                        Excel Data Preview
                    </h2>

                    {/* <div className="bg-gray-100 p-4 rounded-lg text-gray-600 text-center italic h-48 flex items-center justify-center"> */}

                        {/* Your parsed Excel data will appear here. */}
                        <DataPreview data={chartData?.raw} limit={10} />
                    {/* </div> */}
                </section>



            </main>
            <section className="w-full">
                <Footer />
            </section>
        </div>
    );
};

export default ExcelFileViewer;
