import {TowerList} from "../components/TowerList";
import {Outlet, useNavigate, useParams} from "react-router-dom";
import React, {useContext, useRef, useState} from 'react';
import {TowerContext} from "../context/towerContext";
import {observer} from "mobx-react-lite";
import Modal from 'react-modal';

export const Towers = observer((props) => {
    const {joinTower, createTower} = useContext(TowerContext);
    const [isJoinTowerModalOpen,setJoinTowerModalOpen] = useState(false);
    const [isCreateTowerModalOpen,setCreateTowerModalOpen] = useState(false);
    let {towerId} = useParams();

    const codeInputField = useRef();
    const towerNameInputField = useRef();
    const towerCityUrlInputField = useRef();

    let navigate = useNavigate();

    const DEFAULT_CITY_URL = "https://beacon-city-main-staging.herokuapp.com";

    return (
        <div className='appContainer'>

            {/* Join tower modal */}
            <Modal
                isOpen={isJoinTowerModalOpen}
                onRequestClose={() => setJoinTowerModalOpen(false)}
                contentLabel="Join New Tower"
                className="Modal"
                overlayClassName="Overlay">

                <h1>Join New Tower</h1>
                <input className='bigTextInput' type='text' ref={codeInputField} placeholder="Enter Code" maxLength={8}></input>
                <div>
                    <button onClick={() => {
                        const code = codeInputField.current.value;
                        joinTower(code);
                        setJoinTowerModalOpen(false);
                    }}>Join Tower</button>
                </div>

            </Modal>

            {/* Create tower modal */}
            <Modal
                isOpen={isCreateTowerModalOpen}
                onRequestClose={() => setCreateTowerModalOpen(false)}
                contentLabel="Create New Tower"
                className="Modal"
                overlayClassName="Overlay">

                <h1>Create a Tower</h1>
                <input className='bigTextInput' type='text' ref={towerNameInputField} placeholder="Name your Tower"/>
                <input className='smallTextInput' type='text' ref={towerCityUrlInputField} placeholder="Optional: Enter City URL to host from"/>
                <div>
                    <button onClick={() => {
                        const url = towerCityUrlInputField.current.value.length === 0 ? DEFAULT_CITY_URL : towerCityUrlInputField.current.value;
                        createTower(towerNameInputField.current.value,url);
                        window.location.reload();
                        setJoinTowerModalOpen(false);
                    }}>Create</button>
                </div>

            </Modal>

            {/*TODO: Show something if there are no towers in the towerContext*/}
            <TowerList selectedTowerId={towerId}
                       onClick={(clickedTower) => {
                           navigate(`/channels/${clickedTower}`)
                       }}
                       onUserIconSelected={(t) => {
                           navigate(`/me`)
                       }}
                       onJoinTowerSelected={() => {
                           setJoinTowerModalOpen(true);
                       }}
                       onCreateNewTowerSelected={() => {
                            setCreateTowerModalOpen(true);
                       }}
            />
            <Outlet/>
        </div>
    );
});