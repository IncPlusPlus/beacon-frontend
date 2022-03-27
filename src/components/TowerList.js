import React, {useContext} from 'react';
import default_avatar from '../assets/default-avatar.png';
import {observer} from "mobx-react-lite";
import {TowerContext} from "../context/towerContext";
import {useEffectOnce} from "react-use";

export const TowerList = observer(function TowerList(props) {
    const {towers, updateTowers} = useContext(TowerContext);

    // Update the towers ONCE upon mounting this component. We should make a better system for determining when to
    // update the Towers list at some point.
    useEffectOnce(() => updateTowers());

    return (
        <ol className='towerList'>
            {/*User profile selector*/}
            <li className={'towerIcon' + (props.selected === "USER" ? ' selected' : '')}
                key='USER'
                onClick={() => props.onUserIconSelected()}>
                <img src={default_avatar} alt="Your Profile"/>
            </li>
            <hr/>

            {/*Map towers*/}
            {Array.from(towers.values()).map(tower => {
                return <li
                    className={'towerIcon' + (tower.id === props.selected ? ' selected' : '')}
                    key={tower.id}
                    onClick={() => props.onClick(tower.id)}>
                    {tower.iconUrl ? <img src={tower.iconUrl} alt={tower.name}/> : <span>{tower.name}</span>}
                </li>
            })}
        </ol>
    );
});