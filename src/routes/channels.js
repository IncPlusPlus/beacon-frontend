import {TowerDetails} from '../components/TowerDetails.js';
import React, {useContext} from 'react';
import {Outlet, useNavigate, useParams} from 'react-router-dom';
import {TowerContext} from "../context/towerContext";
import {observer} from "mobx-react-lite";

export const Channels = observer((props) => {
    let {towerId, channelId} = useParams();
    let navigate = useNavigate();
    const {towers} = useContext(TowerContext);

    return <>{
        // The towerContext may be empty at this time (might have only just initialized)
        towers.get(towerId) ? <>
            <TowerDetails tower={towers.get(towerId)}
                          selected={channelId}
                          onClick={(clickedChannel) => {
                              navigate(`/channels/${towerId}/${clickedChannel}`)
                          }}
            />
            <Outlet/>
        </> : <div>Tower not found!</div>
    }</>;
});