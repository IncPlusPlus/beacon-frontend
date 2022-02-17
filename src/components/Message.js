import React from 'react';

function Message(props) {
    return (
        <div>
            <h3>{props.message.author}</h3>
            <span>{props.message.content}</span>
        </div>
    );
}

export default Message;