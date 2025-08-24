import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

const socket = io.connect("http://localhost:4000");

function ChatOk() {
  const [prevMessage, setPrevMessage] = useState([]);
  const [message, setMessage] = useState("");
  const { user } = useSelector((state) => state.profile);
  const messageEndRef = useRef();

  // Send message
  const sendChat = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    socket.emit("chat", {
      message,
      sender: user?.email,
      avatar: user?.image,
      time: new Date().toISOString(),
    });
    setMessage("");
  };

  // Receive new messages
  useEffect(() => {
    socket.on("chat", (payload) => {
      setPrevMessage((prev) => [...prev, payload]);
    });
    return () => socket.off("chat");
  }, []);

  // Fetch old messages
  useEffect(() => {
    fetch("http://localhost:4000/api/user/messages")
      .then((res) => res.json())
      .then((data) => setPrevMessage(data))
      .catch((err) => console.error(err));
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [prevMessage]);

  // Format time
  const formatTime = (time) => {
    const date = new Date(time);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  // Avatar with fallback (green border, white background)
  const Avatar = ({ src, email }) => {
    const [imgError, setImgError] = useState(false);
    if (!src || imgError) {
      return (
        <div className="w-8 h-8 rounded-full bg-white border-2 border-green-500 text-green-600 flex items-center justify-center mr-2 font-bold text-sm">
          {email?.charAt(0).toUpperCase()}
        </div>
      );
    }
    return (
      <img
        src={src}
        alt={email}
        className="w-8 h-8 rounded-full mr-2 object-cover border-2 border-green-500 bg-white"
        onError={() => setImgError(true)}
      />
    );
  };

  return (
    <div className="flex flex-col w-full h-screen bg-gray-100">
      {/* Header */}
      <div className="flex items-center bg-blue-600 text-white p-3 shadow-md">
        <Avatar src={user?.image} email={user?.email.split("@")[0]} />
        <div>
          <h2 className="text-lg font-semibold">{user?.email.split("@")[0]}</h2>
          <p className="text-sm text-blue-100">Online</p>
        </div>
      </div>

      {/* Messages */}
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
                  src={payload?.avatar}
                  email={payload.sender.split("@")[0]}
                />
              )}

              <div
                className={`relative max-w-xs md:max-w-sm lg:max-w-md px-3 py-2 rounded-lg shadow ${
                  isOwn
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                }`}
              >
                <p className="text-xs font-semibold mb-1">
                  {isOwn
                    ? user?.email.split("@")[0]
                    : payload.sender.split("@")[0]}
                </p>
                <p>{payload.message}</p>
                <span
                  className={`absolute bottom-1 right-2 text-[10px] ${
                    isOwn ? "text-blue-100" : "text-gray-400"
                  }`}
                >
                  {payload.time ? formatTime(payload.time) : ""}
                </span>
              </div>

              {isOwn && (
                <Avatar src={user?.image} email={user?.email.split("@")[0]} />
              )}
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={sendChat}
        className="flex items-center p-3 bg-white border-t border-gray-300"
      >
        <input
          type="text"
          className="flex-1 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="ml-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatOk;
