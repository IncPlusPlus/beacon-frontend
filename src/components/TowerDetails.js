import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {TowerContext} from "../context/towerContext";

export const TowerDetails = observer(function TowerDetails(props) {
    // Load channels of a Tower when viewing that Tower
    useEffect(() => {
        props.tower.initializeChannels();
    }, [props.tower]);

    const {generateInviteCode} = useContext(TowerContext);
    const [inviteButtonState, setInviteButtonState] = useState(0);

    const INVITE_INACTIVE = 0;
    const INVITE_WAITING = 1;
    const INVITE_COPIED = 2;

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
        setInviteButtonState(INVITE_WAITING);
        generateInviteCode(props.tower.id).then(invite => {
            navigator.clipboard.writeText(invite.inviteCode);
            setInviteButtonState(INVITE_COPIED);
            //alert("Invite copied to clipboard! This will expire in one hour");
        });
    };

    return (
        <div id='towerDetailsPanel'>
            <div className='title'>
                <h2>{props.tower.name}</h2>
                <div onClick={inviteHandler} onMouseLeave={() => setInviteButtonState(INVITE_INACTIVE)} id='inviteButton'>
                    <div id='inviteButtonText' className={inviteButtonState === INVITE_COPIED ? 'selected' : ''}>
                        <div>{inviteButtonState === INVITE_WAITING ? "Generating invite..." : "+ Invite others!"}</div>
                        <div>Code Copied!</div>
                    </div>
                </div>
            </div>
            <ol id='channelList'>
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