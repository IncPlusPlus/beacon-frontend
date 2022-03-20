import {TowerList} from "../components/TowerList";
import {Outlet, useNavigate, useParams} from "react-router-dom";
import React, {useContext} from "react";
import {TowerContext} from "../context/towerContext";

export const Towers = (props) => {
    let {towerId} = useParams();
    let navigate = useNavigate();
    const towerContext = useContext(TowerContext);

    return (
        <div className='appContainer'>
            {/*TODO: Show something if there are no towers in the towerContext*/}
            <TowerList towers={towerContext} selected={towerId} 
                onClick={(clickedTower) => {navigate(`/channels/${clickedTower}`)}}
                onUserIconSelected={(t) => {navigate(`/me`)}}
            />
            <Outlet/>
        </div>
    );
}