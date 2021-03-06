import React, { useContext, useEffect, useRef, useState } from 'react';
import { Message } from './Message';
import { TowerContext } from "../context/towerContext";
import { observer } from "mobx-react-lite";
import { get } from "mobx";
import { useParams } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import { darkenHex, getContrastingTextColor } from '../util/colorHelper';

export const MessagePane = observer(function MessagePane(props) {

    const { towers } = useContext(TowerContext);
    const [scrollAtBottom, setScrollAtBottom] = useState(false);
    const [messagesBelow, setMessagesBelow] = useState(false);
    const [channelName, setChannelName] = useState('');
    let { channelId, towerId } = useParams();

    const tower = get(towers, towerId);
    const channelInitialized = tower.channels.get(channelId) !== undefined;

    const messageList = useRef(null);

    const towerPrimaryColor = (tower && tower.primaryColor) ? darkenHex(tower.primaryColor) : 'a7942d';
    const towerSecondaryColor = (tower && tower.secondaryColor) ? darkenHex(tower.secondaryColor) : '5e5d59';
    const mainTextColor = (tower && tower.secondaryColor) ? getContrastingTextColor(towerSecondaryColor) : 'FFFFFF';

    // Used to determine whether or not we've scrolled to the bottom of the page
    const scrollHandler = (event) => {
        const atBottom = event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight;
        if (atBottom !== scrollAtBottom) {
            setScrollAtBottom(atBottom);
        }
    };

    const scrollToBottom = () => {
        messageList.current.scrollTop = messageList.current.scrollHeight;
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
    // Move to the bottom of the screen once when we load
    useEffectOnce(() => {
        scrollToBottom();
        setMessagesBelow(false); // This only exists so we dont get an unused warning
    });

    // Scroll to bottom when a message is sent or we just loaded
    useEffect(() => {
        if (scrollAtBottom) {
            scrollToBottom();
        }
        // TODO implement the 'more messages below' alert
    });

    // Set the channel name
    useEffect(() => {
        if (channelInitialized) {
            setChannelName(tower.channels.get(channelId).name);
        }
    }, [channelId, channelInitialized, tower.channels, towerId]);

    return (
        <div id='channelPane' style={{backgroundColor:'#'+towerSecondaryColor,color:'#'+mainTextColor}}>
            <h3 id='messageChannelTitle' style={{backgroundColor:'#'+towerPrimaryColor}}>#{channelName}</h3>
            <ol id='messagePane' ref={messageList} onScroll={scrollHandler} style={{backgroundColor:'#'+towerSecondaryColor}}>
                {
                    props.messages ? Array.from(props.messages.values()).map(
                        (msg, index, arr) => <Message key={msg.id} message={msg} minimal={index > 0 && arr[index-1].senderId === msg.senderId} />
                        // TODO: Replace this with skeletons from react-content-loader or react-loading-skeleton
                    ) : <div>No messages</div>
                }
            </ol>
            {messagesBelow ? <span className='messageAlert' onClick={() => scrollToBottom()}>More messages below</span> : <></>}
            <textarea id="messageInput" rows="1" placeholder='Message' className='messageInput'
                onKeyDown={(e) => handleKeyDown(e, this)} />
        </div>
    );
})