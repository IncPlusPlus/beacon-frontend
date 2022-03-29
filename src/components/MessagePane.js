import React from 'react';
import {Message} from './Message';
import {observer} from "mobx-react-lite";

export const MessagePane = observer(function MessagePane(props) {
    return (
        <div className='messagePane'>
            <ol>
                {
                    props.messages ? Array.from(props.messages.values()).map(
                        (msg) => <Message key={msg.id} message={msg}/>
                        // TODO: Replace this with skeletons from react-content-loader or react-loading-skeleton
                    ) : <div>No messages</div>
                }
            </ol>
            <input id="messageInput" type="text" placeholder='Message' className='messageInputField'/>
        </div>
    );
})