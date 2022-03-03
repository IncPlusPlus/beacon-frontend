import React from 'react';
import {Message} from './Message';

export const MessagePane = (props) => {
    return (
        <ul className='messagePane'>
            {props.messages.map(
                (msg) => <Message key={msg.id} message={msg}/>
            )}
        </ul>
    );
}