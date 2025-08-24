import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import './Chat.css';

const socket = io.connect("http://localhost:4000");

function Chat() {
  const [prevMessage, setPrevMessage] = useState([]);
  const [message, setMessage] = useState("");
  const [fileUploading, setFileUploading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const { user } = useSelector((state) => state.profile);
  const messageEndRef = useRef();
  const sendSoundRef = useRef(null);

  useEffect(() => {
    try {
      sendSoundRef.current = new Audio("/send.mp3");
      sendSoundRef.current.volume = 0.2;
    } catch {
      sendSoundRef.current = null;
    }
  }, []);

  const sendChat = async (e) => {
    e?.preventDefault();
    if (!message.trim() && !selectedFile) return;

    if (selectedFile) {
      setFileUploading(true);
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        const payload = {
          message: message.trim() || "",
          sender: user?.email,
          avatar: user?.image,
          time: new Date().toISOString(),
          file: dataUrl,
          fileName: selectedFile.name,
          fileType: selectedFile.type,
        };
        socket.emit("chat", payload);
        // **Removed optimistic UI update here**
        setMessage("");
        setSelectedFile(null);
        setFileUploading(false);
        if (sendSoundRef.current) sendSoundRef.current.play().catch(() => {});
      };
      reader.onerror = () => {
        console.error("File read error");
        setFileUploading(false);
      };
      reader.readAsDataURL(selectedFile);
      return;
    }

    const payload = {
      message: message.trim(),
      sender: user?.email,
      avatar: user?.image,
      time: new Date().toISOString(),
    };
    socket.emit("chat", payload);
    // **Removed optimistic UI update here**
    setMessage("");
    if (sendSoundRef.current) sendSoundRef.current.play().catch(() => {});
  };

  useEffect(() => {
    socket.on("chat", (payload) => {
      setPrevMessage((prev) => [...prev, payload]);
    });
    return () => socket.off("chat");
  }, []);

  useEffect(() => {
    fetch("http://localhost:4000/api/user/messages")
        .then((res) => res.json())
        .then((data) => setPrevMessage(data))
        .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [prevMessage]);

  const formatTime = (time) => {
    if (!time) return "";
    const date = new Date(time);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  const Avatar = ({ src, email, size = 8 }) => {
    const [imgError, setImgError] = useState(false);
    if (!src || imgError) {
      return (
          <div className="w-8 h-8 rounded-full bg-white border-2 border-green-500 text-green-600 flex items-center justify-center mr-2 font-bold text-sm flex-shrink-0">
            {email?.charAt(0).toUpperCase()}
          </div>
      );
    }
    return (
        <img
            src={src}
            alt={email}
            className="w-8 h-8 rounded-full mr-2 object-cover border-2 border-green-500 bg-white flex-shrink-0"
            onError={() => setImgError(true)}
        />
    );
  };

  const EMOJIS = [
    "😀","😅","😂","😍","😘","👍","👏","🙏","🔥","🎉",
    "🤝","🙌","😎","😢","🤔","😴","🥳","😇","😬","😡"
  ];

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      alert("File too large. Max 5MB for this demo. Upload to server for bigger files.");
      return;
    }
    setSelectedFile(f);
  };

  const FilePreview = ({ file, fileType, fileName }) => {
    if (!file) return null;
    if (fileType.startsWith("image/")) {
      return (
          <div className="mt-2">
            <img src={file} alt={fileName} className="max-w-xs rounded-md border" />
            <div className="text-xs text-gray-500 mt-1">{fileName}</div>
          </div>
      );
    }
    if (fileType.startsWith("audio/")) {
      return (
          <div className="mt-2">
            <audio controls src={file} className="w-full" />
            <div className="text-xs text-gray-500 mt-1">{fileName}</div>
          </div>
      );
    }
    return (
        <div className="mt-2">
          <a
              href={file}
              download={fileName}
              className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-md border"
          >
            Download {fileName}
          </a>
        </div>
    );
  };

  return (
      <div className="flex flex-col w-full h-screen bg-gray-100">
        <div className="flex items-center bg-blue-600 text-white p-3 shadow-md">
          <Avatar src={user?.image} email={user?.email?.split?.("@")?.[0]} />
          <div className="flex-1">
            <h2 className="text-lg font-semibold">
              {user?.email?.split?.("@")?.[0] ?? "Me"}
            </h2>
            <p className="text-sm text-blue-100">Online</p>
          </div>

          <div className="flex items-center space-x-2">
            <button
                onClick={() => alert("Search (placeholder)")}
                className="p-2 rounded-full hover:bg-blue-500/30"
                title="Search"
            >
              🔍
            </button>
            <button
                onClick={() => alert("More (placeholder)")}
                className="p-2 rounded-full hover:bg-blue-500/30"
                title="More"
            >
              ⋯
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {prevMessage.map((payload, index) => {
            const isOwn = user?.email === payload.sender;
            return (
                <div
                    key={index}
                    className={`flex items-end ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  {!isOwn && (
                      <Avatar
                          src={payload?.avatar || payload?.image}
                          email={(payload.sender || "").split?.("@")?.[0]}
                      />
                  )}

                  <div
                      className={`relative max-w-xs md:max-w-sm lg:max-w-md px-3 py-2 rounded-lg shadow break-words ${
                          isOwn
                              ? "bg-blue-500 text-white rounded-br-none"
                              : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                      }`}
                  >
                    <p className="text-xs font-semibold mb-1">
                      {isOwn
                          ? (user?.email?.split?.("@")?.[0] || "Me")
                          : (payload.sender || "").split?.("@")?.[0]}
                    </p>

                    {payload.message && <p>{payload.message}</p>}

                    {payload.file && (
                        <FilePreview
                            file={payload.file}
                            fileType={payload.fileType || ""}
                            fileName={payload.fileName || "file"}
                        />
                    )}

                    <span
                        className={`absolute bottom-1 right-2 text-[10px] ${
                            isOwn ? "text-blue-100" : "text-gray-400"
                        }`}
                    >
                  {payload.time ? formatTime(payload.time) : ""}
                </span>
                  </div>

                  {isOwn && (
                      <Avatar src={user?.image} email={user?.email?.split?.("@")?.[0]} />
                  )}
                </div>
            );
          })}
          <div ref={messageEndRef} />
        </div>

        <form
            onSubmit={sendChat}
            className="flex items-center p-3 bg-white border-t border-gray-300"
        >
          
          <div class="chat-input-container">
            <div class="input-actions">
                 <div className="flex items-center space-x-2 mr-2">
            <button
                type="button"
                onClick={() => setShowEmoji((s) => !s)}
                className="p-2 rounded-full hover:bg-gray-100"
                title="Emoji"
            >
              😊
            </button>

            <label className="p-2 rounded-full hover:bg-gray-100 cursor-pointer" title="Attach file">
              📎
              <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
              />
            </label>
          </div>

                 {showEmoji && (
              <div className="absolute left-4 bottom-20 bg-white border rounded-md shadow p-2 grid grid-cols-5 gap-2 z-50">
                {EMOJIS.map((e) => (
                    <button
                        key={e}
                        type="button"
                        onClick={() => {
                          setMessage((m) => m + e);
                          setShowEmoji(false);
                        }}
                        className="text-xl"
                    >
                      {e}
                    </button>
                ))}
              </div>
          )}

        

            </div>
             <input
              type="text"
              className="flex-1 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-400 message-input"
              placeholder={selectedFile ? `File: ${selectedFile.name} (press Send)` : "Type a message"}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
          />
             
         <div> 
           <span>
                
            </span>  
        </div>
        </div> 

          

          

          <button
              type="submit"
              className="ml-3 flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition"
          >
            <span>Send</span>
          </button>
        </form>
      </div>
  );
}

export default Chat;
