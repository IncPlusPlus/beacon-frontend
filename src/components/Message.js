import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import ReactMarkdown from 'react-markdown'
import {UserContext} from '../context/userContext';
import default_avatar from '../assets/default-avatar.png';

export const Message = observer(function Message(props) {
    const {getUsername} = useContext(UserContext);
    /*
     * For editing and deleting messages, we could either do what discord does with showing buttons on a message
     * on hover, or we could make a right click menu. Here's an example button to delete this message instance.
     * <button onClick={() => props.message.deleteMessage()}>Delete</button>
     */

    const senderUsername = getUsername(props.message.senderId);
    return (
        <div className={'message' + (props.minimal ? ' minimal' : '')}>

            {!props.minimal && <img className='messageUserIcon' alt={senderUsername} src={default_avatar}/>}

            <span>
                {!props.minimal && <div className='messageUsername'>{senderUsername}</div>}
                <div className='messageContent'><ReactMarkdown>{props.message.messageBody}</ReactMarkdown></div>
            </span>
        </div>
    );
});