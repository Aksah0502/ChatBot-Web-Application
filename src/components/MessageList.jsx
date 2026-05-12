function MessageList({ messages }) {
  return (
    <div className="messages">
      {messages.map((message, index) => (
        <div key={index} className={message.sender}>
          <div className="text">{message.text}</div>
        </div>
      ))}
    </div>
  );
}

export default MessageList;
