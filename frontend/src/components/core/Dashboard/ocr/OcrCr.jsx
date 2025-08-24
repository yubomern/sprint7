import { useState } from "react";
import axios from "axios";
import  './Upload.css'
export default function OCRUploader() {
    const [file, setFile] = useState(null);
    const [text, setText] = useState("");

    const handleUpload = async () => {
        if (!file) return alert("Please select a file first!");

        const formData = new FormData();
        formData.append("file", file);

        try {
            // lang can be 'eng', 'fra', or 'eng+fra'
            const res = await axios.post("http://localhost:5000/api/v3/ocr/upload?lang=eng+fra", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setText(res.data.text);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1>OCR Uploader</h1>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={handleUpload}>Upload & OCR</button>
            <pre>{text}</pre>
        </div>
    );
}
