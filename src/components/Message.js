import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import ReactMarkdown from 'react-markdown'
import {UserContext} from '../context/userContext';
import default_avatar from '../assets/default-avatar.png';
import { SignInContext } from '../context/signInContext';

export const Message = observer(function Message(props) {
    const {getUsername} = useContext(UserContext);
    const {accountId} = useContext(SignInContext);
    /*
     * For editing and deleting messages, we could either do what discord does with showing buttons on a message
     * on hover, or we could make a right click menu. Here's an example button to delete this message instance.
     * <button onClick={() => props.message.deleteMessage()}>Delete</button>
     */

    const senderUsername = getUsername(props.message.senderId);
    return (
        <div className='message'>

            <img className='messageUserIcon' alt={senderUsername} src={default_avatar}/>

            <span>
                <div className='messageUsername'>{senderUsername}</div>
                <div className='messageContent'><ReactMarkdown>{props.message.messageBody}</ReactMarkdown></div>
            </span>

            {(props.message.senderId === accountId) && 
                <span className='messageActionContainer'>
                    {/*TODO: Add confirmation box for deletion*/}
                    <span className='messageActionButton' onClick={() => props.message.deleteMessage() }>Delete</span>
                </span>
            }
        </div>
    );
});