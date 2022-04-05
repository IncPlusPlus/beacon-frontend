import {observer} from "mobx-react-lite";
import {TowerContext} from "../context/towerContext";
import SockJsClient from "react-stomp";
import {useContext, useRef, useState} from "react";
import {TopicForPath} from "../util/WebsocketHelper";

/**
 * This returns just the <li> list item for the tower list. This component also has another component sorta attached
 * to it such that we have a websocket connection for each Tower the user is a member of.
 */
export const TowerListElement = observer(function TowerListElement(props) {
    const tower = props.tower;
    const {currentUsername, currentPassword} = useContext(TowerContext);
    const wsSourceUrl = tower.cityConfig(tower.id).basePath + "/beacon-ws";
    // connected will be true if we have a working websocket connection
    const [connected, setConnected] = useState(false);
    // TODO: Can this be const?
    let stompClientRef = useRef(null);
    const messageEvents = Array.from(tower.channels.values())
        // For each channel, create the string for its respective /messages topic
        .map(existingChannel => "/topic/tower/" + tower.id + "/channel/" + existingChannel.id + "/message");
    const topicsToSubscribeTo = [
        // Events related to any tower (unused for now)
        "/topic/tower",
        // Events related to channels
        "/topic/tower/" + tower.id + "/channel",
        // Message events for known channels
        ...messageEvents,
    ];
    const onMessageReceive = (msg, topic) => {
        // Check topic for relevant entity (tower,channel,message)
        switch (TopicForPath(topic)) {
            case 'message':
                onMessageEvent(msg);
                break;
            case 'channel':
                onChannelEvent(msg);
                break;
            case 'tower':
                // Tower events are unused at the moment
                break;
            default:
                // no-op. Might be useful to log something here so that we might notice garbage coming from the server
                break;
        }
    };

    const onMessageEvent = (messageEvent) => {
        switch (messageEvent.type) {
            case 'CREATED':
                // Check if channel is undefined and if not, add this new message to the state
                tower.channels.get(messageEvent.message.channel_id)?.handleMessageCreated(messageEvent.message);
                break;
            case 'EDITED':
                // Check if channel is undefined and if not, add delete this message from the state
                tower.channels.get(messageEvent.message.channel_id)?.handleMessageEdited(messageEvent.message);
                break;
            case 'DELETED':
                // Check if channel is undefined and if not, add delete this message from the state
                tower.channels.get(messageEvent.message.channel_id)?.handleMessageDeleted(messageEvent.message);
                break;
            default:
                console.log(`Received a message event from the server of unknown type '${messageEvent.type}'.`);
                break;
        }
    }

    const onChannelEvent = (channelEvent) => {
        switch (channelEvent.type) {
            case 'CREATED':
                tower.handleChannelCreated(channelEvent.channel);
                break;
            case 'EDITED':
                tower.handleChannelEdited(channelEvent.channel);
                break;
            case 'DELETED':
                tower.handleChannelDeleted(channelEvent.channel);
                break;
            default:
                console.log(`Received a channel event from the server of unknown type '${channelEvent.type}'.`);
                break;
        }
    }

    return <>
        <li
            className={'towerIcon' + (props.selected ? ' selected' : '')}
            onClick={() => props.onClick(tower.id)}>
            {tower.iconUrl ? <img src={tower.iconUrl} alt={tower.name}/> : <span>{tower.name}</span>}
        </li>

        <SockJsClient url={wsSourceUrl} topics={topicsToSubscribeTo}
                      headers={{
                          "Authorization": `Basic ${btoa(`${currentUsername}:${currentPassword}`)}`
                      }}
                      onMessage={onMessageReceive} ref={stompClientRef}
                      onConnect={() => setConnected(true)}
                      onDisconnect={() => {
                          setConnected(false)
                      }}
                      debug={false}/>
    </>;
});

