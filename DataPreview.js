import React from 'react';

const DataPreview = ({ data, limit = 10 }) => {
    if (!data || data.length === 0) {
        return <p className="text-gray-500">No data to preview.</p>;
    }

    const headers = Object.keys(data[0]);
    const previewRows = data.slice(0, limit);

    return (
        <div className="overflow-x-auto mt-4">
            <h2 className="text-lg font-semibold mb-2 text-indigo-700">📄 Data Preview (first {limit} rows)</h2>
            <table className="min-w-full bg-white border rounded-xl shadow">
                <thead className="bg-indigo-100 text-indigo-800">
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index} className="py-2 px-4 border">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {previewRows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-t hover:bg-gray-50">
                            {headers.map((header, colIndex) => (
                                <td key={colIndex} className="py-2 px-4 border text-center">
                                    {row[header]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataPreview;
