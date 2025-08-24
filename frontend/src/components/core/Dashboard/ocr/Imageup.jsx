import React, { useState } from "react";
import axios from "axios";

function Imageup() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");

    const handleFileChange = (e) => setFile(e.target.files[0]);

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file first");
            return;
        }
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post("http://localhost:4002/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setMessage(res.data.message);
        } catch (error) {
            setMessage("Upload failed");
            console.error(error);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload} className="btn btn-info">Upload</button>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Imageup;
