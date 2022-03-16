import React from 'react';
import {Message} from './Message';

export const MessagePane = (props) => {
    return (
        <div className='messagePane'>
            <ol>
                {props.messages.map(
                    (msg) => <Message key={msg.id} message={msg}/>
                )}
            </ol>
            <input id="messageInput" type="text" placeholder='Message' className='messageInputField'/>
        </div> 
    );
}