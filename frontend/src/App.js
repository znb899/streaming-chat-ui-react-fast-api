import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function App() {
  const [isActive, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();
  const submissionsContainerRef = useRef();

  const handleSubmit = async () => {
    let text = inputRef.current.innerText;
    setLoading(true);

    if (text.trim() !== '') {
      // Create and append "You" message div
      var youDiv = document.createElement('div');
      inputRef.current.innerText = '';
      youDiv.innerHTML = `<p class='persona'>You</p><p class='message'>${text}</p>`;
      submissionsContainerRef.current.appendChild(youDiv);
      
      // Create "Bot" message div
      var botDiv = document.createElement('div');
      botDiv.id = 'bot-message';

      try {
        const response = await fetch('/api/completion', {
          method: 'POST',
          body: JSON.stringify({'message': text}),
          headers: {
           'Content-Type': 'application/json'
          }
        });
        
        const reader = response.body.getReader();
        var botText = '';
        while (true) {
          const {done, value} = await reader.read();
          if (done) break;
          let resText = new TextDecoder().decode(value);
          botText += resText;
          botDiv.innerHTML = `<p class='persona'>Bot</p><p class='message'>${botText}</p>`;
          submissionsContainerRef.current.appendChild(botDiv); // Append bot's message to the submissions container
        }
        
      } catch (error) {
        console.error(error);
      }
      
      document.getElementById('bot-message').removeAttribute('id'); // Remove 'id' attribute from the bot message
      setLoading(false);
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey && !loading) {
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
    <div>
      <div ref={submissionsContainerRef} className="submissionsContainer">
        {/* Submissions will be placed here */}
      </div>

      <div className="container">
        <div className={`textareaContainer ${isActive ? "active" : ""}`}>
          <p
            ref={inputRef}
            className="resizable"
            onFocus={() => setActive(true)}
            onBlur={() => setActive(false)}
            onPaste={(e) => handlePaste(e)}
            onKeyPress={(e) => handleKeyPress(e)}
            contentEditable="true"
            autoFocus
          />
          <button type="button" className="btnSubmit" onClick={handleSubmit} disabled={loading}>
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
