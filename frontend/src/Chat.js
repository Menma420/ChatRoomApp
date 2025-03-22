import React, { useEffect, useState, useRef } from "react";

function Chat({ socket, username, room }) {
  const [currMsg, setCurrMsg] = useState("");
  const [msgList, setMsgList] = useState([]);
  const bottomRef = useRef(null);

  const sendMsg = async () => {
    if (currMsg !== "") {
      const msgData = {
        room,
        username,
        message: currMsg,
        time: new Date().getHours() + ":" + new Date().getMinutes(),
      };
      await socket.emit("send_msg", msgData);
      setMsgList((prev) => [...prev, msgData]);
      setCurrMsg("");
    }
  };

  useEffect(() => {
    const handleReceiveMsg = (data) => {
      console.log(data);
      setMsgList((prev) => [...prev, data]);
    };

    socket.on("recieve_msg", handleReceiveMsg);

    return () => {
      socket.off("recieve_msg", handleReceiveMsg);
    };
  }, [socket]);

  // Manual auto-scroll using a ref
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [msgList]);

  return (
    <div className="Chat">
      <div className="room-data">
        <h1 id="username">{username}</h1>
        <h1 id="room">{room}</h1>
      </div>

      <div className="chat-window">
        <div className="chat-header">
          <p>Live Chat</p>
        </div>

        <div className="chat-body">
          <div className="message-container">
            {msgList.map((msg, index) => {
              const isMe = msg.username === username;
              return (
                <div
                  key={index}
                  className={`message ${isMe ? "you" : "other"}`}
                >
                  <div className="message-content">
                    <p>{msg.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{msg.time}</p>
                    <p id="author">{msg.username}</p>
                  </div>
                </div>
              );
            })}
            {/* Dummy element to scroll into view */}
            <div ref={bottomRef} />
          </div>
        </div>

        <div className="chat-footer">
          <input
            type="text"
            placeholder="Hey..."
            value={currMsg}
            onChange={(e) => setCurrMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMsg()}
          />
          <button onClick={sendMsg}>&#9658;</button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
