import React, { useContext } from "react";
import default_avatar from '../assets/default-avatar.png';
import { TowerContext } from "../context/towerContext";

export const UserDetails = (props) => {

    const {currentUsername} = useContext(TowerContext);

    return (
        <div className='userDetailsPane'>
            <div className='userDetails'>
                <img alt="Your Avatar" src={default_avatar}/>
                <div className='username'>{currentUsername}</div>
            </div>
        </div>
    );
};