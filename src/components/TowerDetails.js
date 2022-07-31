import React, {useContext, useEffect, useRef, useState} from 'react';
import {observer} from "mobx-react-lite";
import {TowerContext} from "../context/towerContext";
import {CreateInviteExpiryTimeUnitEnum} from 'beacon-city';
import Modal from 'react-modal';
import { darkenHex, getContrastingTextColor } from '../util/colorHelper';

export const TowerDetails = observer(function TowerDetails(props) {
    // Load channels of a Tower when viewing that Tower
    useEffect(() => {
        props.tower.initializeChannels();
    }, [props.tower]);

    const {generateInviteCode, updateTowerAppearance} = useContext(TowerContext);
    const [inviteButtonState, setInviteButtonState] = useState(0);
    const [isInviteCustomizerOpen, setIsInviteCustomizerOpen] = useState(false);

    const [isAppearanceCustomizerOpen, setIsAppearanceCustomizerOpen] = useState(false);

    const inputInviteDuration = useRef();
    const inputInviteUses = useRef();

    const primaryColorSelector = useRef();
    const secondaryColorSelector = useRef();

    const iconSelector = useRef();
    const bannerSelector = useRef();
    const towerNameInput = useRef();

    const INVITE_INACTIVE = 0;
    const INVITE_WAITING = 1;
    const INVITE_COPIED = 2;

    const AVAILABLE_EXPIRY_TIMES = [
        {
            display: 'Never',
            time: 0,
            units: CreateInviteExpiryTimeUnitEnum.Hours
        },
        {
            display: '30 Minutes',
            time: 30,
            units: CreateInviteExpiryTimeUnitEnum.Minutes
        },
        {
            display: '1 Hour',
            time: 1,
            units: CreateInviteExpiryTimeUnitEnum.Hours
        },
        {
            display: '6 Hours',
            time: 6,
            units: CreateInviteExpiryTimeUnitEnum.Hours
        },
        {
            display: '1 Day',
            time: 1,
            units: CreateInviteExpiryTimeUnitEnum.Days
        },
        {
            display: '1 Week',
            time: 7,
            units: CreateInviteExpiryTimeUnitEnum.Days
        },
    ];

    // Get colors
    //const towerPrimaryColor = props.tower && props.tower.primaryColor ? props.tower.primaryColor : 'a7942d';
    const towerSecondaryColorDefault = props.tower && props.tower.secondaryColor ? darkenHex(props.tower.secondaryColor) : '5e5d59';
    const towerSecondaryColorDarkened = props.tower && props.tower.secondaryColor ? props.tower.secondaryColor : '404040';
    const mainTextColor = props.tower && props.tower.secondaryColor ? getContrastingTextColor(towerSecondaryColorDarkened) : 'FFFFFF';

    let channels = [];
    Array.from(props.tower.channels.values()).sort((a, b) => a.order - b.order).forEach(channel => {
        let displayedName = channel.name;
        // create list element
        channels.push(<li className={'channelIcon' + (channel.id === props.selected ? ' selected' : '')}
                          key={channel.id}
                          onClick={() => props.onClick(channel.id)}
                          style={channel.id === props.selected ? {backgroundColor: '#'+towerSecondaryColorDefault} : {}}>
            #{displayedName}
        </li>);
    })

    // Called when the 'invite people' button is pressed
    const inviteHandler = () => {
        // Get an invite code from the tower
        setInviteButtonState(INVITE_WAITING);
        setIsInviteCustomizerOpen(true);
    };

    // Called when we finish configuring the invite
    const generateInvite = () => {
        const {time, units} = AVAILABLE_EXPIRY_TIMES[parseInt(inputInviteDuration.current.value) || 0];
        const selectedUses = parseInt(inputInviteUses.current.value) || 0;

        setInviteButtonState(INVITE_WAITING);
        setIsInviteCustomizerOpen(false);

        generateInviteCode(
            props.tower.id,
            time, units,
            selectedUses)
            .then(invite => {
                navigator.clipboard.writeText(invite.inviteCode);
                setInviteButtonState(INVITE_COPIED);
            })
    };


    // Call this to apply the current colors picked in 
    const applyNewAppearance = () => {

        // Get colors
        const primaryColor = primaryColorSelector.current.value.substring(1);
        const seconaryColor = secondaryColorSelector.current.value.substring(1);

        const icon = iconSelector.current.files.clear ? new Blob([]) : iconSelector.current.files[0];
        const banner = bannerSelector.current.files.clear ? new Blob([]) :  bannerSelector.current.files[0];

        iconSelector.current.files.clear = false;
        bannerSelector.current.files.clear = false;

        const name = towerNameInput.current.value;

        // Close ui
        setIsAppearanceCustomizerOpen(false);

        // Send request
        updateTowerAppearance(props.tower.id,name,primaryColor,seconaryColor,icon,banner).finally(() => {
            window.location.reload();
        });
    };

    return (
        <div id='towerDetailsPanel' style={{backgroundColor:'#'+towerSecondaryColorDarkened, color:'#'+mainTextColor}}>
		
			<Modal
                isOpen={isInviteCustomizerOpen}
                onRequestClose={() => setIsInviteCustomizerOpen(false)}
                contentLabel="Create Invite"
                className="Modal"
                overlayClassName="Overlay">

                <h1>Invite someone to <i>{props.tower.name}</i></h1>
                <div>When should the invite expire?</div>
                <select ref={inputInviteDuration}>
                    {
                        AVAILABLE_EXPIRY_TIMES.map((val, idx) => {
                            return (<option value={idx} key={idx}>{val.display}</option>)
                        })
                    }
                </select>

                <div>How many times can it be used? Set to 0 for no limit</div>
                <input ref={inputInviteUses} type="number" min="0"></input>
                <div>
                    <button onClick={generateInvite}>Create Invite</button>
                </div>
            </Modal>

            <Modal
                isOpen={isAppearanceCustomizerOpen}
                onRequestClose={() => setIsAppearanceCustomizerOpen(false)}
                onAfterOpen={() => {
                    towerNameInput.current.value = props.tower.name;
                    primaryColorSelector.current.value = '#'+props.tower.primaryColor;
                    secondaryColorSelector.current.value = '#'+props.tower.secondaryColor;
                }}
                contentLabel="Cuztomize your tower"
                className="Modal"
                overlayClassName="Overlay">

                <h2>Customize <i>{props.tower.name}</i></h2>
                
                <div id='customizer'>

                    <div>Name: <input ref={towerNameInput} type='text' placeholder='Tower Name'></input></div>
                    <div></div>

                    <div>
                        <input ref={primaryColorSelector} type='color' id='colPrimary'/>
                        <label htmlFor='colPrimary'>Primary Color</label>
                        <br/>
                        <button onClick={(e) => {primaryColorSelector.current.value = '#FFD800'}}>Reset to Default</button>
                    </div>

                    <div>
                        <input ref={secondaryColorSelector} type='color' id='colSecondary'/>
                        <label htmlFor='colSecondary'>Secondary Color</label>
                        <br/>
                        <button onClick={(e) => {secondaryColorSelector.current.value = '#404040'}}>Reset to Default</button>
                    </div>

                    <div>
                        Update icon
                        <input ref={iconSelector} type='file' accept='image/png'/>
                        <button onClick={(e) => {iconSelector.current.files.clear=true;}}>Clear Icon</button>
                    </div>

                    <div>
                        Update banner
                        <input ref={bannerSelector} type='file' accept='image/png'/>
                        <button onClick={(e) => {bannerSelector.current.files.clear=true;}}>Clear Banner</button>
                    </div>

                </div>

                <div>
                    <button onClick={applyNewAppearance}>Apply</button>
                </div>

            </Modal>
		
            <div id='bannerContainer' style={{height: props.tower.bannerUrl ? '10em' : 0}}>{props.tower.bannerUrl && <img id='banner' src={props.tower.bannerUrl} alt='Tower Banner'/>}</div>

            <div className='title'>
                <h2>{props.tower.name}</h2>
                <div id='towerControls'>
                    <div onClick={inviteHandler} onMouseLeave={() => setInviteButtonState(INVITE_INACTIVE)} className='towerControlButton' id='inviteButton'>
                        <div id='inviteButtonText' className={inviteButtonState === INVITE_COPIED ? 'selected' : ''}>
                            <div>{inviteButtonState === INVITE_WAITING ? "Generating invite..." : "+ Invite others!"}</div>
                            <div>Code Copied!</div>
                        </div>
                    </div>

                    <div className='towerControlButton' onClick={() => setIsAppearanceCustomizerOpen(true)}>
                        Edit
                    </div>
                </div>
            </div>
            <ol id='channelList'>
                {channels}
                <li className='channelIcon'
                          key='CREATE_NEW'
                          onClick={props.createChannel}>
                    + Create new channel
                </li>
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