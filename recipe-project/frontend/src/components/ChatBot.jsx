import React, { useState } from 'react';
import '../styles/ChatBot.css';

const ChatAssistant = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi! Need help with the recipe?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { role: 'user', text: input },
      { role: 'ai', text: 'That’s a great question! Let me help...' }
    ];
    setMessages(newMessages);
    setInput('');
  };

  return (
    <>
      {!isChatOpen && (
        <div className="chat-button" onClick={() => setIsChatOpen(true)}>
          💬 Need help?
        </div>
      )}

      {isChatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <span>Recipe Assistant</span>
            <button onClick={() => setIsChatOpen(false)}>✕</button>
          </div>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.role}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <form className="chat-input-area" onSubmit={handleSend}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatAssistant;
