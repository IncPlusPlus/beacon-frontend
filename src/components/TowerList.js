import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {TowerContext} from "../context/towerContext";
import {useEffectOnce} from "react-use";
import {TowerListElement} from "./TowerListElement";
import {SignInContext} from '../context/signInContext';
import {UserContext} from '../context/userContext';
import default_avatar from "../assets/default-avatar.png";

export const TowerList = observer(function TowerList(props) {
    const {towers, updateTowers} = useContext(TowerContext);

    const {accountId} = useContext(SignInContext);
    const {getAvatarUrl} = useContext(UserContext);

    // Update the towers ONCE upon mounting this component. We should make a better system for determining when to
    // update the Towers list at some point.
    useEffectOnce(() => updateTowers());

    const currentAvatarUrl = getAvatarUrl(accountId) || default_avatar;

    // Determine color of tower list
    const selectedTower = towers.get(props.selectedTowerId);
    const selectedTowerPrimaryColor = selectedTower && selectedTower.primaryColor ? selectedTower.primaryColor : 'FFD800';

    return (
        <ol id='towerList'  style={{backgroundColor:'#'+selectedTowerPrimaryColor}}>
            {/*User profile selector*/}
            <li className={'towerIcon' + (props.selected === "USER" ? ' selected' : '')}
                key='USER'
                onClick={() => props.onUserIconSelected()}>
                <img src={currentAvatarUrl} alt="Your Profile"/>
            </li>
            <hr/>

            {/*Map towers*/}
            {Array.from(towers.values()).map(tower => {
                return <TowerListElement
                    selected={tower.id === props.selectedTowerId}
                    key={tower.id}
                    onClick={() => props.onClick(tower.id)}
                    tower={tower}>
                </TowerListElement>
            })}

            {/*Join new tower button*/}
            <hr/>
            <li className={'towerIcon'}
                key='JOIN'
                onClick={() => props.onJoinTowerSelected()}>
                <span>Join new Tower</span>
            </li>
            <li className={'towerIcon'}
                key='CREATE'
                onClick={() => props.onCreateNewTowerSelected()}>
                <span>Create new Tower</span>
            </li>
        </ol>
    );
});