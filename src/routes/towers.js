import {TowerList} from "../components/TowerList";
import {Outlet, useNavigate, useParams} from "react-router-dom";
import React from "react";
import {observer} from "mobx-react-lite";

export const Towers = observer((props) => {
    let {towerId} = useParams();
    let navigate = useNavigate();

    return (
        <div className='appContainer'>
            {/*TODO: Show something if there are no towers in the towerContext*/}
            <TowerList selected={towerId}
                       onClick={(clickedTower) => {
                           navigate(`/channels/${clickedTower}`)
                       }}
                       onUserIconSelected={(t) => {
                           navigate(`/me`)
                       }}
            />
            <Outlet/>
        </div>
    );
});