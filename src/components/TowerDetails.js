import React, { useContext } from 'react';
import {observer} from "mobx-react-lite";
import {useEffectOnce} from "react-use";
import {TowerContext} from "../context/towerContext";

export const TowerDetails = observer(function TowerDetails(props) {
    // Load channels of a Tower when viewing that tower. useEffectOnce runs when the component is mounted.
    useEffectOnce(() => props.tower.refreshChannels());

    const {generateInviteCode} = useContext(TowerContext);

    let channels = [];
    Array.from(props.tower.channels.values()).sort((a, b) => a.order - b.order).forEach(channel => {
        let displayedName = channel.name;
        // create list element
        channels.push(<li className={'channelIcon' + (channel.id === props.selected ? ' selected' : '')}
                          key={channel.id}
                          onClick={() => props.onClick(channel.id)}>
            {displayedName}
        </li>);
    })

    // Called when the 'invite people' button is pressed
    const inviteHandler = () => {
        // Get an invite code from the tower
        generateInviteCode(props.tower.id).then(invite => {
            navigator.clipboard.writeText(invite.inviteCode);
            alert("Invite copied to clipboard! This will expire in one hour");
        });
    };

    return (
        <div className='serverDetailsPanel'>
            <div className='title'>
                <h2>{props.tower.name}</h2>
                <div onClick={inviteHandler} className='inviteButton'>+ Invite others!</div>
            </div>
            <ol className='channelList'>
                {channels}
            </ol>
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