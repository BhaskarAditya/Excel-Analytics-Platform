import React from 'react';

const InsightCard = ({ insights }) => {
    return (
        <div className="bg-white shadow-lg rounded-xl p-6 max-w-3xl mx-auto mt-6 border">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">📌 AI Insights</h2>
            <pre className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">
                {insights || "Loading insights..."}
            </pre>
        </div>
    );
};

export default InsightCard;
