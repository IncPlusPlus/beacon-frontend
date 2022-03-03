import ChannelList from '../components/ChannelList.js';
import React, {useContext} from 'react';
import {Outlet, useNavigate, useParams} from 'react-router-dom';
import {TowerContext} from "../context/towerContext";

export const Channels = (props) => {
    let {towerId, channelId} = useParams();
    let navigate = useNavigate();
    const {towerContext} = useContext(TowerContext);

    return <>{
        // The towerContext may be empty at this time (might have only just initialized)
        towerContext[towerId] ? <>
            <ChannelList serverName={towerContext[towerId].name} channels={towerContext[towerId].channels}
                         selected={channelId} onClick={(clickedChannel) => {
                navigate(`/channels/${towerId}/${clickedChannel}`)
            }}/>
            <Outlet/>
        </> : <div>Tower not found!</div>
    }</>;
}