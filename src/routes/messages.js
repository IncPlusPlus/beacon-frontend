import React, {useContext} from 'react';
import MessagePane from '../components/MessagePane';
import {useParams} from 'react-router-dom';
import {TowerContext} from "../context/towerContext";

export const Messages = (props) => {
    let {channelId, towerId} = useParams();
    const {towerContext} = useContext(TowerContext);

    return <MessagePane
        messages={(towerId !== "" && channelId !== "") ? towerContext[towerId].channels[channelId].messages : []}/>;
}