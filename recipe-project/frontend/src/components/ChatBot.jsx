import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ChatBot.css';

const ChatAssistant = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi! Need help with the recipe?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5050/chat', {
        userMessage: input
      });

      const botReply = {
        role: 'ai',
        text: res.data.reply || 'Sorry, I didn’t catch that.'
      };
      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [...prev, { role: 'ai', text: 'Oops! Something went wrong.' }]);
    } finally {
      setLoading(false);
    }
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
            {loading && (
              <div className="chat-message ai">
                <em>Bot is typing...</em>
              </div>
            )}
          </div>
          <form className="chat-input-area" onSubmit={handleSend}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? '...' : 'Send'}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatAssistant;