import React, {useContext, useEffect, useRef} from 'react';
import {Message} from './Message';
import {TowerContext} from "../context/towerContext";
import {observer} from "mobx-react-lite";
import {useParams} from 'react-router-dom';

export const MessagePane = observer(function MessagePane(props) {

    const {towers} = useContext(TowerContext);
    let {channelId, towerId} = useParams();

    const messageList = useRef(null);

    const handleKeyDown = (e,field) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            // Try and send message
            const messageBody = e.target.value;
            e.target.disabled = true;

            let thePromise = towers.get(towerId).channels.get(channelId).sendMessage(messageBody);

            thePromise.finally(() => {
                e.target.value = "";
                e.target.disabled = false;
            });
        }
    }

    useEffect(() => {
        // Scroll
        messageList.current.scrollTop = messageList.current.scrollHeight;
    });

    return (
        <div className='messagePane'>
            <ol ref={messageList}>
                {
                    props.messages ? Array.from(props.messages.values()).map(
                        (msg) => <Message key={msg.id} message={msg}/>
                        // TODO: Replace this with skeletons from react-content-loader or react-loading-skeleton
                    ) : <div>No messages</div>
                }
            </ol>
            <textarea id="messageInput" rows="1" type="text" placeholder='Message' className='messageInputField'
                      onKeyDown={(e) => handleKeyDown(e, this)}/>
        </div>
    );
})