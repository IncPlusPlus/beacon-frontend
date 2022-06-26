import {TowerDetails} from '../components/TowerDetails.js';
import React, {useContext, useState, useRef} from 'react';
import {Outlet, useNavigate, useParams} from 'react-router-dom';
import {TowerContext} from "../context/towerContext";
import {observer} from "mobx-react-lite";
import Modal from 'react-modal';

export const Channels = observer((props) => {
    let {towerId, channelId} = useParams();
    let navigate = useNavigate();
    const {towers, createChannel} = useContext(TowerContext);
    const [createChannelModalOpen,setCreateChannelModalOpen] = useState(false);
    const channelNameInputField = useRef();

    const tryCreateChannel = () => {
        const name = channelNameInputField.current.value;
        if (name.length > 0) {
            createChannel(towerId,name)
            setCreateChannelModalOpen(false);
        }
    };

    return <>{
        <>

        {/* Channel creation modal*/}
        <Modal
                isOpen={createChannelModalOpen}
                onRequestClose={() => setCreateChannelModalOpen(false)}
                contentLabel="Create Channel"
                className="Modal"
                overlayClassName="Overlay">

                <h1>Enter new channel name</h1>
                {/*TODO: prevent user from inputting invalid characters*/}
                <input className='bigTexInput' type='text' ref={channelNameInputField} placeholder="general" maxLength={64} onKeyDown={(e) => {if (e.key === 'Enter') tryCreateChannel()}}></input>
                <div>
                    <button onClick={tryCreateChannel}>Create Channel</button>
                </div>

            </Modal>

            {/* The towerContext may be empty at this time (might have only just initialized */}
            {towers.get(towerId) ? <>
                <TowerDetails tower={towers.get(towerId)}
                            selected={channelId}
                            onClick={(clickedChannel) => {
                                navigate(`/channels/${towerId}/${clickedChannel}`)
                            }}
                            createChannel = {() => setCreateChannelModalOpen(true)}
                />
                <Outlet/>
            </> : <div>Tower not found!</div>}
        </>
        
    }</>;
});