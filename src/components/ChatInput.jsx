function ChatInput({ input, setInput, onSend }) {
  return (
    <div className="input-box">
      <input
        value={input}
        placeholder="Type message..."
        onChange={(event) => setInput(event.target.value)}
        onKeyDown={(event) => event.key === 'Enter' && onSend()}
      />
      <button onClick={onSend}>Send</button>
    </div>
  );
}

export default ChatInput;
