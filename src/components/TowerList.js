import React from 'react';
import default_avatar from '../assets/default-avatar.png';

export const TowerList = (props) => {

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
            {Object.values(props.towers).map(tower => {
                return <li 
                    className={'towerIcon' + (tower.id === props.selected ? ' selected' : '')}
                    key={tower.id}
                    onClick={() => props.onClick(tower.id)}>
                        {tower.iconUrl === '' ? <span>{tower.name}</span> : <img src={tower.iconUrl} alt={tower.name}/>}
                    </li>
            })}
        </ol>
    );
}