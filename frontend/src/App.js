import React, { useState, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function Message({ message }) {
  return (
    <p>
      <strong>{message.direction === 'ai' ? 'Bot: ' : ''}</strong>
      {message.content}
    </p>
  )
}

function App() {
  const [isActive, setActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const inputRef = useRef();
  const decoder = new TextDecoder('utf-8');

  const handleSubmit = () => {
    const text = inputRef.current.innerText;
    if (text.trim() !== '') {
      const humanMessage = {direction: 'human', content: text};
      inputRef.current.innerText = '';
      setMessages(currentMessages => [...currentMessages, humanMessage]);
      
      const source = axios.CancelToken.source();
    
      axios.post('http://localhost:5000/api/completion', {'message': text}, {
        cancelToken: source.token,
        responseType: 'stream',
        timeout: 60000,
      }).then(response => {
        const reader = response.data.body.getReader();
        const streamData = reader.read();
        streamData.then(data => {
          const aiMessage = {direction: 'ai', content: decoder.decode(data.value)};
          setMessages(currentMessages => [...currentMessages, aiMessage]);
        });
      });
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      handleSubmit();
      event.preventDefault(); // Prevent adding a newline character
    }
  }
  
  const handlePaste = (e) => {
    e.preventDefault(); // Prevent browser default paste behavior
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  }

  return (
    <div className='container'>
      <div className='submissionsContainer'>
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}
      </div>
      <div className={`textareaContainer ${isActive ? 'active' : ''}`} >
        <div className='textareaInnerContainer'>
          <p
            ref={inputRef}
            className='resizable'
            onFocus={() => setActive(true)}
            onBlur={() => setActive(false)}
            onPaste={handlePaste} // Modify this function according to the CSS adjustment below
            onKeyPress={handleKeyPress}
            contentEditable="true"
            autoFocus // Add this line to auto-focus the textarea
          />
        </div>
        <button
          type='button'
          className='btnSubmit'
          onClick={handleSubmit}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </div>
  );
}

export default App;