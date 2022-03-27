import React from 'react';
import {observer} from "mobx-react-lite";

export const Message = observer(function Message(props) {
    /*
     * For editing and deleting messages, we could either do what discord does with showing buttons on a message
     * on hover, or we could make a right click menu. Here's an example button to delete this message instance.
     * <button onClick={() => props.message.deleteMessage()}>Delete</button>
     */
    return (
        <div className='message'>
            <strong>{props.message.senderId}</strong><br/>
            <span>{props.message.messageBody}</span>
        </div>
    );
});