import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import ReactMarkdown from 'react-markdown'
import {UserContext} from '../context/userContext';

export const Message = observer(function Message(props) {
    const {getUsername} = useContext(UserContext);
    /*
     * For editing and deleting messages, we could either do what discord does with showing buttons on a message
     * on hover, or we could make a right click menu. Here's an example button to delete this message instance.
     * <button onClick={() => props.message.deleteMessage()}>Delete</button>
     */

    const messageActions = <span className='messageActions'>Delete</span>;

    return (
        <div className='message'>
            <strong>{getUsername(props.message.senderId)}</strong><br/>
            <span><ReactMarkdown>{props.message.messageBody}</ReactMarkdown></span>
            {messageActions}
        </div>
    );
});