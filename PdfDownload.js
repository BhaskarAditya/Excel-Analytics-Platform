import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function PdfDownload({ targetRefId }) {
    const downloadPDF = async () => {
        const element = document.getElementById(targetRefId);

        if (!element) return alert('Target element not found!');

        const canvas = await html2canvas(element, {
            scale: 2,
        });

        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('report.pdf');
    };

    return (
        // <button
        //     onClick={downloadPDF}
        //     className="bg-indigo-600 text-white px-4 py-2 rounded-xl mt-4 hover:bg-indigo-700"
        // >
        //     Download as PDF
        // </button>

        <button className="bg-indigo-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 ease-in-out inline-flex items-center text-lg font-semibold transform hover:scale-105" /* Larger padding, rounded-full, stronger shadow, smoother transition, slightly larger text, scale on hover */
            onClick={downloadPDF}>
            <svg className="fill-current w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg>
            <span>Export Pdf</span> {/* Changed text for clarity */}
        </button>
    );
}
