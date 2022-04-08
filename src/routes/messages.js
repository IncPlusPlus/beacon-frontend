import React, {useContext, useEffect, useState} from 'react';
import {MessagePane} from '../components/MessagePane';
import {useParams} from 'react-router-dom';
import {TowerContext} from "../context/towerContext";
import {observer} from "mobx-react-lite";
import {get} from "mobx";
import { useInterval } from 'react-use';

export const Messages = observer(function Messages(props) {
    let {channelId, towerId} = useParams();
    const {towers} = useContext(TowerContext);
    const tower = get(towers, towerId);
    const channelInitialized = tower.channels.get(channelId) !== undefined;
    const [fetchMessagesPending, setFetchMessagesPending] = useState(false);
    /*
    If the user visits, for example, http://localhost:3000/channels/623de7d41b2b8c392b5e23d0/623f9a06023ebe6403a6446d
    in a fresh new browser tab, this new tab had no state until it starts talking to the API. Because of this, we can't
    immediately load the messages for this channel on mount because the channel itself might not have even loaded yet.

    To mitigate this, we delay the fetchMessages() call until we know the channel has been created in the state.
    channelInitialized is a boolean that we reference to see if the state contains the channel whose messages this
    component is meant to be displaying.
     */
    useEffect(() => {
        if (channelInitialized && !tower.channels.get(channelId).messagesLoadedOnce) {
            tower.channels.get(channelId).fetchMessages();
        }
    });

    // Refresh the messages for the open channel every 10,000 ms. This should be replaced with a better method in the future
    useInterval(() => {
        // Don't dispatch another fetch action if one is already running.
        if (!fetchMessagesPending) {
            setFetchMessagesPending(true);
            let thePromise = towers.get(towerId).channels.get(channelId).fetchMessages();
            thePromise.finally(() => setFetchMessagesPending(false));
        } else {
            console.log('Attempted to fetch messages but a previous attempt was already pending so this one was called off.');
        }
    }, [channelId, channelInitialized, tower.channels, towerId]);

    return <MessagePane
        messages={(towerId !== "" && channelId !== "") ? towers.get(towerId).channels.get(channelId)?.messages : []}/>;
});