import React from 'react';

function Message(props) {
    return (
        <div className='message'>
            <strong>{props.message.author}</strong><br/>
            <span>{props.message.content}</span>
        </div>
    );
}

export default Message;