import React, {useContext, useState} from 'react';
import {observer} from "mobx-react-lite";
import ReactMarkdown from 'react-markdown'
import {UserContext} from '../context/userContext';
import default_avatar from '../assets/default-avatar.png';
import { SignInContext } from '../context/signInContext';

export const Message = observer(function Message(props) {
    const {getUsername} = useContext(UserContext);
    const {accountId} = useContext(SignInContext);

    const [editMode,setEditMode] = useState(false); // True when the message is being edited
    const [editText,setEditText] = useState('');

    const enterEditMode = () => {
        setEditMode(true);
        setEditText(props.message.messageBody);
    };

    const handleChange = (event) => {
        setEditText(event.target.value);
    };

    // Update a message when enter is pressed (ignoring shift)
    // TODO this code is copied from MessagePane
    const handleKeyDown = (e, field) => {

        if (e.key === 'Escape') {
            setEditMode(false);
            setEditText('');

        }else if (e.key === 'Enter' && !e.shiftKey) {
            // Update message
            e.preventDefault();
            // Check if text is unedited
            if (editText !== props.message.messageBody) {
                props.message.editMessage(editText)
                    .finally(() => {
                        setEditMode(false);
                    });
            }else{
                // Well we didn't change anything, so no need to update
                setEditMode(false);
            }
        }
    }

    const senderUsername = getUsername(props.message.senderId);
    return (
        <div className='message'>

            <img className='messageUserIcon' alt={senderUsername} src={default_avatar}/>

            <span>
                <div className='messageUsername'>{senderUsername}</div>
                {
                    editMode ?
                        <textarea className='messageInput edit' rows="1" value={editText} onChange={handleChange} onKeyDown={(e) => handleKeyDown(e, this)}/>
                        :
                        <div className='messageContent'><ReactMarkdown>{props.message.messageBody}</ReactMarkdown></div>
                }
            </span>

            {(props.message.senderId === accountId && !editMode) && 
                <span className='messageActionContainer'>
                    {/*TODO: Add confirmation box for deletion*/}
                    <span className='messageActionButton' onClick={() => enterEditMode() }>Edit</span>
                    <span> | </span>
                    <span className='messageActionButton' onClick={() => props.message.deleteMessage() }>Delete</span>
                </span>
            }
        </div>
    );
});