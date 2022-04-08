import React, { useContext, useEffect, useState } from 'react';
import { observer } from "mobx-react-lite";
import ReactMarkdown from 'react-markdown'
import { UserContext } from '../context/userContext';

export const Message = observer(function Message(props) {

    const [author, setAuthor] = useState('');
    const [refresh, setRefresh] = useState(true);

    const { users, retrieveUserInfo } = useContext(UserContext);
    const senderId = props.message.senderId;

    // Called once we're done updating the user list
    const checkUsersCallback = () => {
        setRefresh(true);
    };

    useEffect(() => {
        if (refresh) {
            if (users.has(senderId)) {
                setAuthor(users.get(senderId));
            } else {
                // Tell the user context to get the username needed
                retrieveUserInfo(senderId, checkUsersCallback);
            }
            setRefresh(false);
        }
    }, [users, refresh, retrieveUserInfo, senderId]);

    /*
     * For editing and deleting messages, we could either do what discord does with showing buttons on a message
     * on hover, or we could make a right click menu. Here's an example button to delete this message instance.
     * <button onClick={() => props.message.deleteMessage()}>Delete</button>
     */
    return (
        <div className='message'>
            <strong>{author.username}</strong><br />
            <span><ReactMarkdown>{props.message.messageBody}</ReactMarkdown></span>
        </div>
    );
});