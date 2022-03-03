import React from 'react';

export const TowerDetails = (props) => {

    let channels = [];
    Object.values(props.channels).forEach(channel => {
        let displayedName = channel.name;
        // create list element
        channels.push(<li className={'channelIcon' + (channel.id === props.selected ? ' selected' : '')} 
                            key={channel.id} 
                            onClick={() => props.onClick(channel.id)}>
                                {displayedName}
                        </li>);
    })

    return (
        <div className='serverDetailsPanel'>
                <h2>{props.serverName}</h2>
                <ul className='channelList'> 
                    {channels}
                </ul>
            </div>
    );
}