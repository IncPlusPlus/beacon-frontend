import React from 'react';
import {observer} from "mobx-react-lite";
import {useEffectOnce} from "react-use";

export const TowerDetails = observer(function TowerDetails(props) {
    // Load channels of a Tower when viewing that tower. useEffectOnce runs when the component is mounted.
    useEffectOnce(() => props.tower.refreshChannels())

    let channels = [];
    Array.from(props.tower.channels.values()).forEach(channel => {
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
            <h2>{props.tower.name}</h2>
            <ul className='channelList'>
                {channels}
            </ul>
        </div>
    );

    // This could potentially be done in a much more functional way like the following snippet.
    //
    // return (
    //     <div className='serverDetailsPanel'>
    //         <h2>{props.serverName}</h2>
    //         <ul className='channelList'>
    //             {
    //                 Array.from(props.channels.values()).map(channel => {
    //                     return <li className={'channelIcon' + (channel.id === props.selected ? ' selected' : '')}
    //                                key={channel.id}
    //                                onClick={() => props.onClick(channel.id)}>
    //                         {channel.name}
    //                     </li>
    //                 })
    //             }
    //         </ul>
    //     </div>
    // );
})