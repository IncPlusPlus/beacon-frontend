import React, {useContext, useState} from "react";
import default_avatar from '../assets/default-avatar.png';
import {TowerContext} from "../context/towerContext";
import {SignInContext} from "../context/signInContext";
import {UserContext} from "../context/userContext";
import {AccountManagementApi} from "beacon-central-identity-server";
import Modal from 'react-modal';
import {observer} from "mobx-react-lite";

export const UserDetails = observer(function UserDetails(props) {

    const {currentUsername} = useContext(TowerContext);
    const {accountId} = useContext(SignInContext);
    const {getAvatarUrl, updateAvatarUrl, cisConfig} = useContext(UserContext);
    const {invalidateSession} = useContext(SignInContext);

    const [isAvatarConfirmModalVisible, setIsAvatarConfirmModalVisible] = useState(false);

    const openFilePicker = () => {
        document.getElementById('f').click();
    }

    const onNewAvatarSelected = (e) => {
        const img = e.target.files[0];
        if (img) {
            setIsAvatarConfirmModalVisible(true);
            new AccountManagementApi(cisConfig).updateProfilePicture({picture: img})
                .then((res) => {
                    updateAvatarUrl(accountId, res.profilePictureUrl);
                })
                .catch(reason => {
                    console.log("Error updating pfp");
                    if (reason instanceof Response) {
                        reason.json().then(value => {
                            console.log(value);
                        });
                    }
                }).finally(() => setIsAvatarConfirmModalVisible(false));
        }
    }

    const currentAvatarUrl = getAvatarUrl(accountId) || default_avatar;

    return (
        <div id='userDetailsPane'>

            <Modal
                isOpen={isAvatarConfirmModalVisible}
                onRequestClose={() => setIsAvatarConfirmModalVisible(false)}
                contentLabel="Avatar Updated"
                className="Modal"
                overlayClassName="Overlay">
                <h1>Avatar updated!</h1>
                <h2>It may take a moment for changes to show</h2>
            </Modal>

            <input id="f" style={{display: 'none'}} type='file' accept='image/png' onChange={onNewAvatarSelected}/>
            <div id='userDetails'>
                <div id="avatarContainer" onClick={openFilePicker}>
                    <img id='userAvatar' alt="Your Avatar" src={currentAvatarUrl}/>
                    <div id='avatarEdit'><span>Edit</span></div>
                </div>
                <div className='username'>{currentUsername}</div>
                <button onClick={() => invalidateSession()}>Sign Out</button>
            </div>
        </div>
    );
});