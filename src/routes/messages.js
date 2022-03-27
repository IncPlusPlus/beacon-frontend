import React, {useContext, useState} from 'react';
import {MessagePane} from '../components/MessagePane';
import {useParams} from 'react-router-dom';
import {TowerContext} from "../context/towerContext";
import {observer} from "mobx-react-lite";
import {useInterval} from "react-use";

export const Messages = observer((props) => {
    let {channelId, towerId} = useParams();
    const {towers} = useContext(TowerContext);
    const [fetchMessagesPending, setFetchMessagesPending] = useState(false);
    // Refresh the messages for the open channel every 10,000 ms. This should be replaced with a better method in the future
    useInterval(() => {
        // Don't dispatch another fetch action if one is already running.
        if (!fetchMessagesPending) {
            setFetchMessagesPending(true);
            let thePromise = towers.get(towerId).channels.get(channelId).fetchMessages(towerId, channelId);
            thePromise.finally(() => setFetchMessagesPending(false));
        } else {
            console.log('Attempted to fetch messages but a previous attempt was already pending so this one was called off.');
        }
    }, 10000);

    return <MessagePane
        messages={(towerId !== "" && channelId !== "") ? towers.get(towerId).channels.get(channelId)?.messages : []}/>;
});