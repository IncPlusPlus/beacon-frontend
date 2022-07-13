import React, {useContext, useEffect} from 'react';
import {MessagePane} from '../components/MessagePane';
import {useParams} from 'react-router-dom';
import {TowerContext} from "../context/towerContext";
import {observer} from "mobx-react-lite";
import {get} from "mobx";
import { MemberList } from '../components/MemberList';

export const Messages = observer(function Messages(props) {
    let {channelId, towerId} = useParams();
    const {towers} = useContext(TowerContext);
    const tower = get(towers, towerId);
    const channelInitialized = tower.channels.get(channelId) !== undefined;

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
    }, [channelId, channelInitialized, tower.channels, towerId]);

    return <>
        <MessagePane
            messages={(towerId !== "" && channelId !== "") ? towers.get(towerId).channels.get(channelId)?.messages : []}/>
        <MemberList tower={tower}/>
    </>;
});