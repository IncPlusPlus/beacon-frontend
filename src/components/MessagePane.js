import React, {useContext, useEffect, useRef, useState} from 'react';
import {Message} from './Message';
import {TowerContext} from "../context/towerContext";
import {observer} from "mobx-react-lite";
import {get} from "mobx";
import {useParams} from 'react-router-dom';

export const MessagePane = observer(function MessagePane(props) {

    const {towers} = useContext(TowerContext);
    const [scrollAtBottom, setScrollAtBottom] = useState(false);
    const [initialized, setInitialized] = useState(false);
    const [channelName, setChannelName] = useState('');
    let {channelId, towerId} = useParams();

    const tower = get(towers, towerId);
    const channelInitialized = tower.channels.get(channelId) !== undefined;

    const messageList = useRef(null);

    // Used to determine whether or not we've scrolled to the bottom of the page
    const scrollHandler = (event) => {
        setScrollAtBottom(event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight);
    };

    // Send a message when enter is pressed (ignoring shift)
    const handleKeyDown = (e, field) => {
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

    // Scroll to bottom when a message is sent or we just loaded
    useEffect(() => {
        if (scrollAtBottom || !initialized) {
            messageList.current.scrollTop = messageList.current.scrollHeight;
        }
        setInitialized(true);
    }, [scrollAtBottom, initialized]);

    // Set the channel name
    useEffect(() => {
        if (channelInitialized) {
            setChannelName(tower.channels.get(channelId).name);
        }
    }, [channelId, channelInitialized, tower.channels, towerId]);

    return (
        <div className='channelPane'>
            <h3 className='messageChannelTitle'>#{channelName}</h3>
            <ol className='messagePane' ref={messageList} onScroll={scrollHandler}>
                {
                    props.messages ? Array.from(props.messages.values()).map(
                        (msg) => <Message key={msg.id} message={msg}/>
                        // TODO: Replace this with skeletons from react-content-loader or react-loading-skeleton
                    ) : <div>No messages</div>
                }
            </ol>
            <textarea id="messageInput" rows="1" placeholder='Message' className='messageInputField'
                      onKeyDown={(e) => handleKeyDown(e, this)}/>
        </div>
    );
})