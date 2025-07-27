import React, { useState, useRef } from 'react';
import Plot from 'react-plotly.js';
import * as XLSX from 'xlsx';
import Footer from './Footer';
import PdfDownload from './PdfDownload';

const ThreeDChart = () => {
    const [data, setData] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [xAxis, setXAxis] = useState('');
    const [yAxis, setYAxis] = useState('');
    const [zAxis, setZAxis] = useState('');
    const [chartType, setChartType] = useState('scatter3d');
    const chatRef = useRef()


    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (evt) => {
            const fileData = evt.target.result;
            const isCSV = file.name.endsWith('.csv');

            let workbook;
            if (isCSV) {
                workbook = XLSX.read(fileData, { type: 'string' });
            } else {
                workbook = XLSX.read(fileData, { type: 'binary' });
            }

            const wsname = workbook.SheetNames[0];
            const ws = workbook.Sheets[wsname];
            const jsonData = XLSX.utils.sheet_to_json(ws);

            if (jsonData.length > 0) {
                setHeaders(Object.keys(jsonData[0]));
            }

            setData(jsonData);
        };

        const isCSV = file.name.endsWith('.csv');
        if (isCSV) {
            reader.readAsText(file);
        } else {
            reader.readAsBinaryString(file);
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

    const renderChart = () => {
        if (!xAxis || !yAxis || data.length === 0) return null;

        let plotData;
        let layout = {
            width: 800,
            height: 600,
            title: 'Chart Visualization',
            autosize: true
        };

        switch (chartType) {
            case 'scatter3d':
                if (!zAxis) return null;
                plotData = [{
                    x: data.map(d => d[xAxis]),
                    y: data.map(d => d[yAxis]),
                    z: data.map(d => d[zAxis]),
                    mode: 'markers',
                    type: 'scatter3d',
                    marker: { size: 5, color: 'blue' },
                }];
                layout.scene = {
                    xaxis: { title: xAxis },
                    yaxis: { title: yAxis },
                    zaxis: { title: zAxis }
                };
                break;

            case 'bar3d':
                if (!zAxis || !xAxis || !yAxis) return null;

                const xData3D = data.map(d => parseFloat(d[xAxis]));
                const yData3D = data.map(d => parseFloat(d[yAxis]));
                const zData3D = data.map(d => parseFloat(d[zAxis]));

                const dx = 1; // Width of each bar in x direction
                const dy = 1; // Width of each bar in y direction
                const dz = 1; // Scale factor for height in z direction

                plotData = data.map((d, i) => {
                    const x = xData3D[i];
                    const y = yData3D[i];

                    const baseZ = 0; // Base of the bar
                    const height = zData3D[i] * dz; // Scaled height

                    const vertices = [
                        [x, y, baseZ],
                        [x + dx, y, baseZ],
                        [x + dx, y + dy, baseZ],
                        [x, y + dy, baseZ],
                        [x, y, baseZ + height],
                        [x + dx, y, baseZ + height],
                        [x + dx, y + dy, baseZ + height],
                        [x, y + dy, baseZ + height],
                    ];

                    const xs = vertices.map(v => v[0]);
                    const ys = vertices.map(v => v[1]);
                    const zs = vertices.map(v => v[2]);

                    return {
                        type: 'mesh3d',
                        x: xs,
                        y: ys,
                        z: zs,
                        i: [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5],
                        j: [1, 3, 2, 0, 3, 6, 0, 7, 5, 7, 6, 4],
                        k: [3, 2, 3, 2, 6, 7, 7, 4, 7, 6, 7, 0],

                        // flatshading: true,
                        opacity: 1,
                        color: 'orange',
                        name: `${d[xAxis]}-${d[yAxis]}-${d[zAxis]}`
                    };
                });

                layout.scene = {
                    xaxis: { title: xAxis },
                    yaxis: { title: yAxis },
                    zaxis: { title: zAxis }
                };
                break;

            case 'line':
                if (!zAxis) return null;
                plotData = [{
                    x: data.map(d => d[xAxis]),
                    y: data.map(d => d[yAxis]),
                    z: data.map(d => d[zAxis]),
                    type: 'scatter3d',
                    mode: 'lines+markers'
                }];
                layout.scene = {
                    xaxis: { title: xAxis },
                    yaxis: { title: yAxis },
                    zaxis: { title: zAxis }
                };
                break;

            case 'pie':
                plotData = [{
                    labels: data.map(d => d[xAxis]),
                    values: data.map(d => d[yAxis]),
                    type: 'pie',
                }];
                break;

            case 'surface3d':
                if (!xAxis || !yAxis || !zAxis) return null;

                const surfaceX = [...new Set(data.map(d => d[xAxis]))].sort((a, b) => a - b);
                const surfaceY = [...new Set(data.map(d => d[yAxis]))].sort((a, b) => a - b);

                const surfaceZ = surfaceY.map(yVal =>
                    surfaceX.map(xVal => {
                        const point = data.find(d => d[xAxis] == xVal && d[yAxis] == yVal);
                        return point ? parseFloat(point[zAxis]) : null;
                    })
                );

                plotData = [{
                    type: 'surface',
                    x: surfaceX,
                    y: surfaceY,
                    z: surfaceZ,
                    colorscale: 'Viridis',
                    showscale: true,
                    name: '3D Surface'
                }];

                layout.scene = {
                    xaxis: { title: xAxis },
                    yaxis: { title: yAxis },
                    zaxis: { title: zAxis }
                };
                break;

            case 'bubble3d':
                if (!xAxis || !yAxis || !zAxis) return null;

                const xBubble = data.map(d => parseFloat(d[xAxis]));
                const yBubble = data.map(d => parseFloat(d[yAxis]));
                const zBubble = data.map(d => parseFloat(d[zAxis]));

                // Optional: pick a numeric column for bubble size or default to zAxis
                const sizeKey = zAxis; // Or set a dedicated size field if you have one
                const sizeData = data.map(d => parseFloat(d[sizeKey]));

                // Normalize sizes for better visual balance
                const minSize = 5, maxSize = 30;
                const minVal = Math.min(...sizeData);
                const maxVal = Math.max(...sizeData);
                const scaledSizes = sizeData.map(s =>
                    minSize + ((s - minVal) / (maxVal - minVal)) * (maxSize - minSize)
                );

                plotData = [{
                    type: 'scatter3d',
                    mode: 'markers',
                    x: xBubble,
                    y: yBubble,
                    z: zBubble,
                    marker: {
                        size: scaledSizes,
                        color: zBubble,
                        colorscale: 'Viridis',
                        opacity: 0.8,
                    },
                    text: data.map(d => `${xAxis}: ${d[xAxis]}, ${yAxis}: ${d[yAxis]}, ${zAxis}: ${d[zAxis]}`),
                    hoverinfo: 'text'
                }];

                layout.scene = {
                    xaxis: { title: xAxis },
                    yaxis: { title: yAxis },
                    zaxis: { title: zAxis },
                };
                break;




            default:
                return null;
        }

        return <Plot data={plotData} layout={layout} />;
    };

    return (
        // <div className="p-6 bg-white rounded-lg shadow">
        //     <h2 className="text-xl font-bold mb-4 text-indigo-600">📊 Excel Chart Visualizer</h2>

        //     <input type="file" onChange={handleFileUpload} accept=".xlsx, .xls, .csv" className="mb-4" />

        //     {headers.length > 0 && (
        //         <>
        //             <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
        //                 <select onChange={(e) => setXAxis(e.target.value)} className="border p-2 rounded">
        //                     <option value="">Select X-Axis</option>
        //                     {headers.map((h, i) => <option key={i} value={h}>{h}</option>)}
        //                 </select>
        //                 <select onChange={(e) => setYAxis(e.target.value)} className="border p-2 rounded">
        //                     <option value="">Select Y-Axis</option>
        //                     {headers.map((h, i) => <option key={i} value={h}>{h}</option>)}
        //                 </select>
        //                 {(chartType === 'scatter3d' || chartType === 'bar3d' || chartType === 'line') && (
        //                     <select onChange={(e) => setZAxis(e.target.value)} className="border p-2 rounded">
        //                         <option value="">Select Z-Axis</option>
        //                         {headers.map((h, i) => <option key={i} value={h}>{h}</option>)}
        //                     </select>
        //                 )}
        //                 <select onChange={(e) => setChartType(e.target.value)} className="border p-2 rounded">
        //                     <option value="scatter3d">3D Scatter</option>
        //                     <option value="bar3d">3D Bar (simulated)</option>
        //                     <option value="line">3D Line</option>
        //                     <option value="pie">Pie Chart</option>
        //                 </select>
        //             </div>
        //         </>
        //     )}

        //     {renderChart()}
        // </div>

        // This is diffrent design
        // <>
        //     <div className="p-8 bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-5xl mx-auto mt-10 ">
        //         <h2 className="text-2xl font-bold mb-6 text-indigo-700 text-center flex items-center justify-center gap-2">
        //             📊 Excel Chart Visualizer
        //         </h2>

        //         {/* File Upload */}
        //         <div className="mb-6">
        //             <input
        //                 type="file"
        //                 onChange={handleFileUpload}
        //                 accept=".xlsx, .xls, .csv"
        //                 className="block w-full text-sm text-gray-700 bg-indigo-50 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer transition"
        //             />
        //         </div>

        //         {/* Dropdown Selectors */}
        //         {headers.length > 0 && (
        //             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        //                 <select
        //                     onChange={(e) => setXAxis(e.target.value)}
        //                     className="p-3 rounded-xl border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        //                 >
        //                     <option value="">Select X-Axis</option>
        //                     {headers.map((h, i) => (
        //                         <option key={i} value={h}>
        //                             {h}
        //                         </option>
        //                     ))}
        //                 </select>

        //                 <select
        //                     onChange={(e) => setYAxis(e.target.value)}
        //                     className="p-3 rounded-xl border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        //                 >
        //                     <option value="">Select Y-Axis</option>
        //                     {headers.map((h, i) => (
        //                         <option key={i} value={h}>
        //                             {h}
        //                         </option>
        //                     ))}
        //                 </select>

        //                 {(chartType === 'scatter3d' || chartType === 'bar3d' || chartType === 'line' || chartType === 'surface3d' || chartType === 'bubble3d') && (
        //                     <select
        //                         onChange={(e) => setZAxis(e.target.value)}
        //                         className="p-3 rounded-xl border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        //                     >
        //                         <option value="">Select Z-Axis</option>
        //                         {headers.map((h, i) => (
        //                             <option key={i} value={h}>
        //                                 {h}
        //                             </option>
        //                         ))}
        //                     </select>
        //                 )}

        //                 <select
        //                     onChange={(e) => setChartType(e.target.value)}
        //                     className="p-3 rounded-xl border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        //                 >
        //                     <option value="scatter3d">3D Scatter</option>
        //                     <option value="bar3d">3D Bar (simulated)</option>
        //                     <option value="line">3D Line</option>
        //                     <option value="pie">Pie Chart</option>
        //                 </select>
        //             </div>
        //         )}

        //         {/* Chart Display */}
        //         <div className="mt-8">{renderChart()}</div>

        //     </div>
        //     <div className="w-full pb-0" >

        //         <Footer />
        //     </div>
        // </>

        // This is Gemeni Design
        <>
            {/* Main Container - Centered and Clean */}
            <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
                <header className="w-full max-w-5xl text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                        3D Data Visualizer
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        Upload your data, select your columns, and instantly visualize your insights.
                    </p>
                </header>

                {/* Core Application Layout - Two Columns */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 w-full max-w-6xl overflow-hidden md:grid md:grid-cols-3 lg:grid-cols-4 animate-fade-in">

                    {/* Left Column: Controls & Configuration */}
                    <div className="md:col-span-1 p-8 border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50">
                        {/* Upload Section */}
                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                Upload File
                            </h2>
                            <input
                                type="file"
                                onChange={handleFileUpload}
                                accept=".xlsx, .xls, .csv"
                                className="block w-full text-sm text-gray-700
                                    file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-indigo-600 file:text-white
                                    hover:file:bg-indigo-700 cursor-pointer transition"
                            />
                            <p className="mt-2 text-xs text-gray-500">.xlsx, .xls, .csv files supported</p>
                        </section>

                        {/* Chart Configuration Section */}
                        {headers.length > 0 && (
                            <section className="space-y-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                    Chart Settings
                                </h2>

                                <div>
                                    <label htmlFor="chartType" className="block text-sm font-medium text-gray-700 mb-1">Chart Type</label>
                                    <select
                                        id="chartType"
                                        onChange={(e) => setChartType(e.target.value)}
                                        className="w-full p-2.5 rounded-md border border-gray-300 bg-white text-gray-800
                                            focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                    >
                                        <option value="scatter3d">3D Scatter</option>
                                        <option value="line">3D Line</option>
                                        <option value="surface3d">Surface</option>
                                        <option value="bubble3d">Bubble Chart</option>
                                        <option value="bar3d">3D Bar</option>
                                        <option value="pie">Pie Chart</option>

                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="xAxis" className="block text-sm font-medium text-gray-700 mb-1">X-Axis</label>
                                    <select
                                        id="xAxis"
                                        onChange={(e) => setXAxis(e.target.value)}
                                        className="w-full p-2.5 rounded-md border border-gray-300 bg-white text-gray-800
                                            focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                    >
                                        <option value="">Select X-Axis</option>
                                        {headers.map((h, i) => (
                                            <option key={i} value={h}>{h}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="yAxis" className="block text-sm font-medium text-gray-700 mb-1">Y-Axis</label>
                                    <select
                                        id="yAxis"
                                        onChange={(e) => setYAxis(e.target.value)}
                                        className="w-full p-2.5 rounded-md border border-gray-300 bg-white text-gray-800
                                            focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                    >
                                        <option value="">Select Y-Axis</option>
                                        {headers.map((h, i) => (
                                            <option key={i} value={h}>{h}</option>
                                        ))}
                                    </select>
                                </div>
                                {(chartType === 'scatter3d' || chartType === 'bar3d' || chartType === 'line' || chartType === 'surface3d' || chartType === 'bubble3d') && (
                                    <div>
                                        <label htmlFor="zAxis" className="block text-sm font-medium text-gray-700 mb-1">Z-Axis</label>
                                        <select
                                            id="zAxis"
                                            onChange={(e) => setZAxis(e.target.value)}
                                            className="w-full p-2.5 rounded-md border border-gray-300 bg-white text-gray-800
                                                focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                        >
                                            <option value="">Select Z-Axis</option>
                                            {headers.map((h, i) => (
                                                <option key={i} value={h}>{h}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                
                                <PdfDownload targetRefId="myChart" />
                            </section>
                        )}
                    </div>

                    {/* Right Column: Chart Display */}
                    <div className="md:col-span-2 lg:col-span-3 p-8 bg-white flex flex-col">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"></path></svg>
                            Your Chart
                        </h2>
                        <div id="myChart" className="flex-grow bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center min-h-[400px] lg:min-h-[600px] overflow-hidden">
                            {renderChart()}
                        </div>

                    </div>

                </div>

                {/* Footer outside the main card */}

            </div>
            <footer className="mt-5 w-full text-center text-gray-500 ">
                <Footer />
            </footer>
        </>

    );
};

export default ThreeDChart;
