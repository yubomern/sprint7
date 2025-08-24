import React, { useState } from "react";
import axios from "axios";
import {  Document, Page } from "react-pdf";
//import "react-pdf/dist/esm/Page/AnnotationLayer.css";
//import 'react-pdf/dist/entry.webpack.css';

import  './Upload.css'


// OcrPdf.jsx or your pdf component
import { pdfjs } from 'react-pdf';
import Imageup from "./Imageup.jsx";
//import workerSrc from 'pdfjs-dist/build/pdf.worker.entry';

//pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;



// Required worker setup for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function UploadPdfOcr() {
    const [file, setFile] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [ocrText, setOcrText] = useState("");
    const [loading, setLoading] = useState(false);

    const onFileChange = (e) => {
        setFile(e.target.files[0]);
        setOcrText("");
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const handleOcr = async () => {
        if (!file) return alert("Please select a PDF file");
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await axios.post("http://localhost:5000/api/ocr/pdf", formData);
            setOcrText(res.data.text);
        } catch (err) {
            console.error(err);
            alert("OCR failed");
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: 20  ,backgroundColor: "white" }}>
            <Imageup/>
            <h2>PDF OCR Reader</h2>
            <input type="file" accept="application/pdf" onChange={onFileChange} />

            {file && (
                <Document
                    file={file}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading="Loading PDF..."
                >
                    {Array.from(new Array(numPages), (el, index) => (
                        <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                    ))}
                </Document>
            )}

            <button onClick={handleOcr} disabled={loading}>
                {loading ? "Processing..." : "Run OCR"}
            </button>

            {ocrText && (
                <div style={{ marginTop: 20 }}>
                    <h3>Extracted Text:</h3>
                    <textarea
                        rows="10"
                        style={{ width: "100%" }}
                        value={ocrText}
                        readOnly
                    />
                </div>
            )}
        </div>
    );
}
