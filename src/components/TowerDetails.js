import React, { useContext, useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { TowerContext } from "../context/towerContext";
import { CreateInviteExpiryTimeUnitEnum } from "beacon-city";
import Modal from "react-modal";

export const TowerDetails = observer(function TowerDetails(props) {
  // Load channels of a Tower when viewing that Tower
  useEffect(() => {
    props.tower.initializeChannels();
  }, [props.tower]);

  const { generateInviteCode } = useContext(TowerContext);
  const [inviteButtonState, setInviteButtonState] = useState(0);
  const [isInviteCustomizerOpen, setIsInviteCustomizerOpen] = useState(false);

  const inputInviteDuration = useRef();
  const inputInviteUses = useRef();

  const INVITE_INACTIVE = 0;
  const INVITE_WAITING = 1;
  const INVITE_COPIED = 2;

  const AVAILABLE_EXPIRY_TIMES = [
    {
      display: "Never",
      time: 0,
      units: CreateInviteExpiryTimeUnitEnum.Hours,
    },
    {
      display: "30 Minutes",
      time: 30,
      units: CreateInviteExpiryTimeUnitEnum.Minutes,
    },
    {
      display: "1 Hour",
      time: 1,
      units: CreateInviteExpiryTimeUnitEnum.Hours,
    },
    {
      display: "6 Hours",
      time: 6,
      units: CreateInviteExpiryTimeUnitEnum.Hours,
    },
    {
      display: "1 Day",
      time: 1,
      units: CreateInviteExpiryTimeUnitEnum.Days,
    },
    {
      display: "1 Week",
      time: 7,
      units: CreateInviteExpiryTimeUnitEnum.Days,
    },
  ];

  let channels = [];
  Array.from(props.tower.channels.values())
    .sort((a, b) => a.order - b.order)
    .forEach((channel) => {
      let displayedName = channel.name;
      // create list element
      channels.push(
        <li
          className={
            "channelIcon" + (channel.id === props.selected ? " selected" : "")
          }
          key={channel.id}
          onClick={() => props.onClick(channel.id)}
        >
          #{displayedName}
        </li>
      );
    });

  // Called when the 'invite people' button is pressed
  const inviteHandler = () => {
    // Get an invite code from the tower
    setInviteButtonState(INVITE_WAITING);
    setIsInviteCustomizerOpen(true);
  };

  // Called when we finish configuring the invite
  const generateInvite = () => {
    const { time, units } =
      AVAILABLE_EXPIRY_TIMES[parseInt(inputInviteDuration.current.value) || 0];
    const selectedUses = parseInt(inputInviteUses.current.value) || 0;

    setInviteButtonState(INVITE_WAITING);
    setIsInviteCustomizerOpen(false);

    generateInviteCode(props.tower.id, time, units, selectedUses).then(
      (invite) => {
        navigator.clipboard.writeText(invite.inviteCode);
        setInviteButtonState(INVITE_COPIED);
      }
    );
  };

  return (
    <div id="towerDetailsPanel">
      <Modal
        isOpen={isInviteCustomizerOpen}
        onRequestClose={() => setIsInviteCustomizerOpen(false)}
        contentLabel="Create Invite"
        className="Modal"
        overlayClassName="Overlay"
      >
        <h1>
          Invite someone to <i>{props.tower.name}</i>
        </h1>
        <div>When should the invite expire?</div>
        <select ref={inputInviteDuration}>
          {AVAILABLE_EXPIRY_TIMES.map((val, idx) => {
            return (
              <option value={idx} key={idx}>
                {val.display}
              </option>
            );
          })}
        </select>

        <div>How many times can it be used? Set to 0 for no limit</div>
        <input ref={inputInviteUses} type="number" min="0"></input>
        <div>
          <button onClick={generateInvite}>Create Invite</button>
        </div>
      </Modal>

      <div className="title">
        <h2>{props.tower.name}</h2>
        <div
          onClick={inviteHandler}
          onMouseLeave={() => setInviteButtonState(INVITE_INACTIVE)}
          id="inviteButton"
        >
          <div
            id="inviteButtonText"
            className={inviteButtonState === INVITE_COPIED ? "selected" : ""}
          >
            <div>
              {inviteButtonState === INVITE_WAITING
                ? "Generating invite..."
                : "+ Invite others!"}
            </div>
            <div>Code Copied!</div>
          </div>
        </div>
      </div>
      <ol id="channelList">
        {channels}
        <li
          className="channelIcon"
          key="CREATE_NEW"
          onClick={props.createChannel}
        >
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
});
