import React from 'react';
import Message from './Message';

function MessagePane(props) {
    return (
        <ul>
            {props.messages.map(
                (msg) => <Message key={msg.id} message={msg}/>
            )}
        </ul>
    );
}

export default MessagePane;