import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import InsightCard from '../components/InsightCard';
import FileUpload from '../components/FileUpload';

const InsightsPage = () => {
    const [id, setId] = useState('');
    const [insights, setInsights] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const storedId = localStorage.getItem('recordId');
        if (storedId) {
            setId(storedId);
        }
    }, []);

    useEffect(() => {
        if (id !== "") fetchInsights();
    }, [id]);

    const fetchInsights = async () => {
        try {
            const res = await API.post('/insight/analyze', { recordId: id });
            setInsights(res.data.insights);
        } catch (err) {
            console.error(err);
            setError('❌ Failed to fetch AI analysis.');
        } finally {
            setLoading(false);
        }
    };

    const handleid = (data) => {
        setId(data.recordId);
    }



    return (

        // <div className="min-h-screen bg-gray-100 py-10 px-4">
        //     <div className="max-w-3xl mx-auto space-y-4">
        //         <h1 className="text-3xl font-bold text-center text-indigo-700">
        //             🧠 Smart Analysis for Record {id}
        //         </h1>
        //         <FileUpload onParsed={handleid} />

        //         {loading && <p className="text-center text-gray-500">Analyzing data...</p>}
        //         {error && <p className="text-center text-red-600">{error}</p>}

        //         {!loading && insights && <InsightCard insights={insights} />}
        //     </div>
        // </div>

        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 py-12 px-6">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-4xl font-extrabold text-center text-indigo-800 drop-shadow-sm">
                    🧠 Smart Analysis for Record 
                </h1>

                <div className="bg-white rounded-2xl shadow-md p-6">
                    <FileUpload onParsed={handleid} />
                </div>

                {loading && (
                    <div className="flex justify-center items-center">
                        <p className="text-indigo-600 font-medium animate-pulse">
                            🔍 Analyzing data...
                        </p>
                    </div>
                )}

                {error && (
                    <div className="flex justify-center items-center">
                        <p className="text-red-600 font-semibold bg-red-100 px-4 py-2 rounded-md shadow">
                            {error}
                        </p>
                    </div>
                )}

                {!loading && insights && (
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <InsightCard insights={insights} />
                    </div>
                )}
            </div>
        </div>

    );
};

export default InsightsPage;
