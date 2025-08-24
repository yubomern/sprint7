import React, { useState } from 'react';
import { FaCamera } from 'react-icons/fa';
import axios from 'axios';
import './Upload.css';
import FileUpload from "./FileUpload.jsx";

const UploadOcr = () => {
    const [resultText, setResultText] = useState("");
    const [file, setFile] = useState(null);
    const [error, setError] = useState(false);

    const ScanImg = async (e) => {
        e.preventDefault(); // ✅ prevent page reload

        if (!file) {
            setError(true);
            return;
        }

        try {
            const data = new FormData();
            data.append("file", file);

            // ✅ make sure URL matches backend port and route
            const res = await axios.post("http://localhost:5000/api/v3/ocr/upload", data, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setResultText(res.data.text || res.data);
            setFile(null);
            setError(false);
        } catch (err) {
            console.error("Upload error:", err);
            setError(true);
        }
    };

    return (
        <div className="upload-page" style={{ background: "grey", padding: "20px" }}>

            <FileUpload />

            <div className="upload-section">
                <form onSubmit={ScanImg} encType="multipart/form-data">
                    <label htmlFor="fileInput">
                        Select Image <FaCamera style={{ marginLeft: "8px" }} />
                        <input
                            type="file"
                            id="fileInput"
                            name="file"
                            style={{ display: "none" }}
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                    </label>

                    {file && <img src={URL.createObjectURL(file)} className="writeImg" alt="preview" />}

                    <button type="submit" className="btn btn-row submit-button">Scan</button>
                </form>
            </div>

            {error && <p className="error">Please select a photo</p>}

            <div className="results-section">
        <textarea
            className="text-result"
            value={resultText}
            onChange={(e) => setResultText(e.target.value)}
            placeholder="OCR result will appear here..."
            rows={10}
        />
            </div>
        </div>
    );
};

export default UploadOcr;
