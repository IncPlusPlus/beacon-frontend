import React, { useContext } from "react";
import default_avatar from '../assets/default-avatar.png';
import { TowerContext } from "../context/towerContext";
import { SignInContext } from "../context/signInContext";

export const UserDetails = (props) => {

    const {currentUsername} = useContext(TowerContext);
    const {invalidateSession} = useContext(SignInContext);

    return (
        <div className='userDetailsPane'>
            <div className='userDetails'>
                <img alt="Your Avatar" src={default_avatar}/>
                <div className='username'>{currentUsername}</div>
                <button onClick={() => invalidateSession()}>Sign Out</button>
            </div>
        </div>
    );
};