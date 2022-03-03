import React from 'react';

export const Message = (props) => {
    return (
        <div className='message'>
            <strong>{props.message.author}</strong><br/>
            <span>{props.message.content}</span>
        </div>
    );
}