import {TowerList} from "../components/TowerList";
import {Outlet, useNavigate, useParams} from "react-router-dom";
import React, {useContext, useRef, useState} from 'react';
import {TowerContext} from "../context/towerContext";
import {observer} from "mobx-react-lite";
import Modal from 'react-modal';

export const Towers = observer((props) => {
    const {joinTower} = useContext(TowerContext);
    const [isJoinTowerModalOpen,setJoinTowerModalOpen] = useState(false);
    let {towerId} = useParams();
    const codeInputField = useRef();
    let navigate = useNavigate();

    return (
        <div className='appContainer'>

            <Modal
                isOpen={isJoinTowerModalOpen}
                onRequestClose={() => setJoinTowerModalOpen(false)}
                contentLabel="Join New Tower"
                className="Modal"
                overlayClassName="Overlay">

                <h1>Join New Tower</h1>
                <input className='bigTexInput' type='text' ref={codeInputField} placeholder="Enter Code" maxLength={8}></input>
                <div>
                    <button onClick={() => {
                        const code = codeInputField.current.value;
                        joinTower(code);
                        setJoinTowerModalOpen(false);
                    }}>Join Tower</button>
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
                           // TODO implement cool modals or something
                           /*const code = prompt("Enter the code for the tower you want to join");
                           if (towerId !== null) {
                               joinTower(code);
                           }*/
                           setJoinTowerModalOpen(true);
                       }}
            />
            <Outlet/>
        </div>
    );
});