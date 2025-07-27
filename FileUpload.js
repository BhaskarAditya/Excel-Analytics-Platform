import { useState } from 'react';
import API from '../services/api';

export default function FileUpload({ onParsed }) {
    const [file, setFile] = useState(null);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return alert('No file selected');

        const formData = new FormData();
        formData.append('excel', file);

        try {
            const res = await API.post('/excel/upload', formData);
            console.log(res.data);
            await localStorage.setItem('recordId', res.data.recordId);
            alert('File uploaded and parsed successfully!');
            if (onParsed) onParsed(res.data);
        } catch (err) {
            console.error(err);
            alert('Upload failed');
        }
    };

    return (
        <form onSubmit={handleUpload}>
            <input type="file" accept=".xls,.xlsx,.csv" onChange={(e) => setFile(e.target.files[0])} />
            <button type="submit" className='p-1 px-3 rounded-lg text-white bg-indigo-500 hover:bg-sky-700 hover:scale-100 transition'>Upload Excel</button>
        </form>
    );
}
