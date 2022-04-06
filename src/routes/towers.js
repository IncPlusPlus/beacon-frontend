import {TowerList} from "../components/TowerList";
import {Outlet, useNavigate, useParams} from "react-router-dom";
import React, {useContext} from 'react';
import {TowerContext} from "../context/towerContext";
import {observer} from "mobx-react-lite";

export const Towers = observer((props) => {
    const {joinTower} = useContext(TowerContext);
    let {towerId} = useParams();
    let navigate = useNavigate();

    return (
        <div className='appContainer'>
            {/*TODO: Show something if there are no towers in the towerContext*/}
            <TowerList selectedTowerId={towerId}
                       onClick={(clickedTower) => {
                           navigate(`/channels/${clickedTower}`)
                       }}
                       onUserIconSelected={(t) => {
                           navigate(`/me`)
                       }}
                       onJoinTowerSelected={() => {
                            // TODO implement cool modals or something
                            const code = prompt("Enter the code for the tower you want to join");
                            if (towerId !== null) {
                                joinTower(code);
                            }
                       }}
            />
            <Outlet/>
        </div>
    );
});