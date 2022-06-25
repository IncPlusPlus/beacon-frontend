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
                <input className='bigTexInput' type='text' ref={channelNameInputField} placeholder="general" maxLength={64}></input>
                <div>
                    <button onClick={() => {
                        const name = channelNameInputField.current.value;
                        createChannel(towerId,name)
                        setCreateChannelModalOpen(false);
                    }}>Create Channel</button>
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