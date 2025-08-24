// ChatApp.jsx
import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

// connect to backend socket.io server
const socket = io("http://localhost:4000");

export default function ChatApp() {
  const { user } = useSelector((state) => state.profile);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const messageEndRef = useRef();
  const sendSoundRef = useRef();

  // fetch old messages
  useEffect(() => {
    fetch("http://localhost:4000/api/user/messages")
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error(err));
  }, []);

  // listen for new messages
  useEffect(() => {
    socket.on("chat", (payload) => {
      setMessages((prev) => [...prev, payload]);
    });
    return () => socket.off("chat");
  }, []);

  // scroll bottom
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // send message
  const sendChat = (e) => {
    e?.preventDefault();
    if (!message.trim() && !selectedFile) return;

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        socket.emit("chat", {
          sender: user?.email,
          avatar: user?.image,
          message: message.trim(),
          file: reader.result,
          fileName: selectedFile.name,
          fileType: selectedFile.type,
          time: new Date().toISOString(),
        });
        playSendSound();
        setMessage("");
        setSelectedFile(null);
      };
      reader.readAsDataURL(selectedFile);
      return;
    }

    socket.emit("chat", {
      sender: user?.email,
      avatar: user?.image,
      message: message.trim(),
      time: new Date().toISOString(),
    });
    playSendSound();
    setMessage("");
  };

  // play mp3 on send
  const playSendSound = () => {
    if (sendSoundRef.current) {
      sendSoundRef.current.currentTime = 0;
      sendSoundRef.current.play();
    }
  };

  const EMOJIS = ["😀","😅","😂","😍","😘","👍","👏","🙏","🔥","🎉","🤝","🙌","😎","😢","🤔","😴","🥳","😇","😬","😡"];

  const formatTime = (time) => {
    if (!time) return "";
    const d = new Date(time);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const FilePreview = ({ file, type, name }) => {
    if (!file) return null;
    if (type.startsWith("image/")) {
      return (
        <div className="file-preview">
          <img src={file} alt={name} />
        </div>
      );
    }
    if (type.startsWith("audio/")) {
      return (
        <div className="file-preview">
          <audio controls src={file} />
        </div>
      );
    }
    return (
      <div className="file-preview">
        <a href={file} download={name} className="file-download">
          📎 {name}
        </a>
      </div>
    );
  };

  return (
    <div className="chat-container">
      {/* hidden audio for sound */}
      <audio ref={sendSoundRef} src="/send.mp3" preload="auto" />

      {/* header */}
      <div className="chat-header">
        <div className="user-info">
          <div className="avatar">
            {user?.image ? (
              <img src={user.image} alt={user?.email} />
            ) : (
              user?.email?.[0]?.toUpperCase()
            )}
          </div>
          <div className="user-details">
            <h2>{user?.email?.split?.("@")?.[0] ?? "Me"}</h2>
            <p>Online</p>
          </div>
        </div>
        <div className="header-actions">
          <button title="Search">🔍</button>
          <button title="More">⋯</button>
        </div>
      </div>

      {/* messages */}
      <div className="chat-messages">
        {messages.map((m, i) => {
          const own = m.sender === user?.email;
          return (
            <div key={i} className={`message ${own ? "sent" : "received"}`}>
              <div className="message-content">
                {!own && <div className="message-sender">{m.sender}</div>}
                {m.message && <p>{m.message}</p>}
                {m.file && (
                  <FilePreview
                    file={m.file}
                    type={m.fileType || ""}
                    name={m.fileName || "file"}
                  />
                )}
                <div className="message-time">{formatTime(m.time)}</div>
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      {/* input */}
      <form className="chat-input-container" onSubmit={sendChat}>
        <div className="input-actions">
          <button
            type="button"
            onClick={() => setShowEmoji((s) => !s)}
            title="Emoji"
          >
            😊
          </button>
          <label>
            📎
            <input
              type="file"
              hidden
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            />
          </label>
        </div>
        {showEmoji && (
          <div className="emoji-picker">
            {EMOJIS.map((e) => (
              <div
                key={e}
                className="emoji"
                onClick={() => {
                  setMessage((m) => m + e);
                  setShowEmoji(false);
                }}
              >
                {e}
              </div>
            ))}
          </div>
        )}
        <textarea
          className="message-textarea"
          placeholder={
            selectedFile ? `File: ${selectedFile.name} (press Send)` : "Type a message..."
          }
          value={message}
          rows={1}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className="send-button">➤</button>
      </form>

      {/* styles */}
      <style>{`
        * { box-sizing: border-box; }
        .chat-container {
          width: 100%; max-width: 900px; height: 95vh;
          margin: auto; background: #fff; border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          display: flex; flex-direction: column; overflow: hidden;
        }
        .chat-header {
          background: linear-gradient(to right,#4e54c8,#8f94fb);
          color:white; padding:16px 20px; display:flex;
          align-items:center; justify-content:space-between;
        }
        .user-info { display:flex; align-items:center; }
        .avatar {
          width:42px;height:42px;border-radius:50%;overflow:hidden;
          display:flex;align-items:center;justify-content:center;
          background:#fff;color:#4e54c8;font-weight:bold;margin-right:12px;
        }
        .avatar img { width:100%; height:100%; object-fit:cover; }
        .chat-messages {
          flex:1; overflow-y:auto; padding:20px; background:#f5f7fb;
          display:flex; flex-direction:column; gap:16px;
        }
        .message { max-width:70%; }
        .message.sent { align-self:flex-end; }
        .message.received { align-self:flex-start; }
        .message-content {
          padding:12px 16px; border-radius:18px; box-shadow:0 2px 5px rgba(0,0,0,0.05);
        }
        .sent .message-content {
          background:linear-gradient(to right,#4e54c8,#8f94fb); color:white;
          border-top-right-radius:4px;
        }
        .received .message-content {
          background:white; color:#333; border-top-left-radius:4px;
        }
        .message-sender { font-size:12px; font-weight:600; margin-bottom:5px; }
        .message-time { font-size:11px; opacity:0.7; margin-top:5px; text-align:right; }
        .file-preview img { max-width:200px; border-radius:8px; margin-top:8px; }
        .file-preview audio { width:100%; margin-top:8px; }
        .file-download { display:inline-block; margin-top:8px; font-size:13px; text-decoration:none; }
        .chat-input-container {
          padding:16px 20px; display:flex; align-items:center; gap:12px;
          border-top:1px solid #ddd; position:relative;
        }
        .input-actions button,label {
          background:#f0f2f5; border:none; width:40px;height:40px;
          border-radius:50%; display:flex;align-items:center;justify-content:center;
          cursor:pointer;
        }
        .message-textarea {
          flex:1; padding:12px 16px; border:1px solid #ddd; border-radius:16px;
          font-size:15px; outline:none; resize:none; min-height:40px; max-height:120px;
        }
        .send-button {
          width:46px;height:46px;border-radius:50%;border:none;
          background:linear-gradient(to right,#4e54c8,#8f94fb);
          color:white; cursor:pointer;
        }
        .emoji-picker {
          position:absolute; bottom:70px; left:20px;
          background:white; border-radius:12px; padding:12px;
          box-shadow:0 5px 15px rgba(0,0,0,0.1);
          display:grid; grid-template-columns:repeat(6,1fr); gap:8px;
          z-index:10;
        }
        .emoji { font-size:20px; cursor:pointer; text-align:center; }
      `}</style>
    </div>
  );
}
