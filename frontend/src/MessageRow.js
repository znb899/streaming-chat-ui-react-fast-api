import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faUser } from '@fortawesome/free-solid-svg-icons';

function MessageRow({ message }) {
  return (
    <div className={`messageRow ${message.type}`}>
      <FontAwesomeIcon icon={message.type === "ai" ? faRobot : faUser} />
      <span className='messageContent'>{message.content}</span>
    </div>
  );
}

export default MessageRow;
