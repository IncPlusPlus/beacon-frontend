import React, { useContext } from "react";
import default_avatar from '../assets/default-avatar.png';
import { TowerContext } from "../context/towerContext";
import { SignInContext } from "../context/signInContext";
import { UserContext } from "../context/userContext";

export const UserDetails = (props) => {

    const {currentUsername} = useContext(TowerContext);
    const {accountId} = useContext(SignInContext);
    const {getAvatarUrl} = useContext(UserContext);
    const {invalidateSession} = useContext(SignInContext);

    return (
        <div id='userDetailsPane'>
            <div id='userDetails'>
                <div id="avatarContainer">
                    <img id='userAvatar' alt="Your Avatar" src={getAvatarUrl(accountId) || default_avatar}/>
                    <div id='avatarEdit'><span>Edit</span></div>
                </div>
                <div className='username'>{currentUsername}</div>
                <button onClick={() => invalidateSession()}>Sign Out</button>
            </div>
        </div>
    );
};