import React, { useState } from "react";
import { FaCamera } from "react-icons/fa";
import axios from "axios";
import "./Upload.css";

const TestOcr = () => {
    const [resultText, setResultText] = useState("");
    const [file, setFile] = useState(null);
    const [error, setError] = useState(false);

    const ScanImg = async (e) => {
        e.preventDefault(); // ✅ stop page reload

        if (!file) {
            setError(true);
            return;
        }

        const data = new FormData();
        data.append("file", file); // ✅ must match backend field name

        try {
            const res = await axios.post(
                "http://localhost:5000/api/v3/ocr/upload",
                data,
                { headers: { "Content-Type": "multipart/form-data" } } // ✅ multipart header
            );

            setResultText(res.data);
            setFile(null);
            setError(false);
        } catch (err) {
            console.error(err);
            setError(true);
        }
    };

    return (
        <div className="upload-page" style={{ background: "grey" }}>
            <div className="upload-section">
                <form onSubmit={ScanImg} encType="multipart/form-data">
                    <label htmlFor="fileInput">
                        Select Image
                        <i className="writeIcon">
                            <FaCamera />
                        </i>
                        <input
                            type="file"
                            id="fileInput"
                            name="file"
                            style={{ display: "none" }}
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                    </label>

                    {file && (
                        <img
                            src={URL.createObjectURL(file)}
                            className="writeImg"
                            alt="preview"
                        />
                    )}

                    <button type="submit" className="submit-button">
                        Scan
                    </button>
                </form>
            </div>

            {error && <p className="error">Please select a photo</p>}

            <div className="results-section">
        <textarea
            className="text-result"
            value={resultText}
            readOnly
            placeholder="OCR result will appear here"
        />
            </div>
        </div>
    );
};

export default TestOcr;


















/*
import React, { useState } from "react";
import { FaCamera } from "react-icons/fa";
import axios from "axios";
import "./Upload.css";

export default function TestOcr() {
    const [resultText, setResultText] = useState("");
    const [file, setFile] = useState(null);
    const [error, setError] = useState(false);

    const ScanImg = async (e) => {
        e.preventDefault();
        if (!file) {
            setError(true);
            return;
        }

        try {
            const data = new FormData();
            data.append("file", file);

            const res = await axios.post("http://localhost:4000/api/v3/ocr/upload",  {
                headers: {
                    "Content-Type": "multipart/form-data" // ✅ let axios set boundary
                } },data);
            setResultText(res.data.text);
            setFile(null);
            setError(false);
        } catch (err) {
            console.error("Upload error:", err);
            setError(true);
        }
    };

    return (
        <div className="upload-page" style={{background:"grey"}}>
            <div className="upload-section">
                <form onSubmit={ScanImg} encType="multipart/form-data">
                    <label htmlFor="fileInput">
                        Select Image
                        <FaCamera style={{ marginLeft: "10px" }} />
                        <input
                            type="file"
                            id="fileInput"
                            style={{ display: "none" }}
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                    </label>
                    {file && <img src={URL.createObjectURL(file)} alt="preview" className="preview-img" />}
                    <button type="submit">Scan</button>
                </form>
            </div>
            {error && <p style={{ color: "red" }}>Please select a photo</p>}
            <div className="results-section">
                <textarea value={resultText} readOnly rows="10" cols="50" />
            </div>
        </div>
    );
}
*/
