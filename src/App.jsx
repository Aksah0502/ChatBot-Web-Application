import { useState } from 'react';
import ChatInput from './components/ChatInput.jsx';
import MessageList from './components/MessageList.jsx';
import { getBotReply } from './services/chatService.js';

function App() {
  const [messages, setMessages] = useState([
    { text: 'Hi! Ask me about date, weather, or AQI.', sender: 'bot' },
  ]);
  const [input, setInput] = useState('');

  async function sendMessage() {
    if (input.trim() === '') return;

    const userMessage = input;
    setMessages((prev) => [...prev, { text: userMessage, sender: 'user' }]);
    setInput('');

    const reply = await getBotReply(userMessage);
    setMessages((prev) => [...prev, { text: reply, sender: 'bot' }]);
  }

  return (
    <div className="app">
      <MessageList messages={messages} />
      <ChatInput input={input} setInput={setInput} onSend={sendMessage} />
    </div>
  );
}

export default App;
