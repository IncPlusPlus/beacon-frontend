import {makeAutoObservable, observable} from "mobx"
import {MessagesApi} from "beacon-city";
import {ObservableMessage} from "./ObservableMessage";

export class ObservableChannel {
    cityConfig
    id
    towerId
    name
    order
    messages = observable.map()
    messagesLoadedOnce

    constructor(cityConfig, id, towerId, name, order) {
        this.cityConfig = cityConfig;
        this.id = id;
        this.towerId = towerId;
        this.name = name;
        this.order = order;
        this.messagesLoadedOnce = false;
        makeAutoObservable(this,
            {},
            // https://mobx.js.org/actions.html#actionbound to allow for "this" in actions
            {autoBind: true}
        );
    }

    * fetchMessages() {
        console.log(`Refreshing messages for tower ${this.towerId}, channel ${this.id}.`);
        // TODO: Find a way to lock this flow from being called if it is already pending for this channel.
        //  Right now, this is being done inside messages.js and it's really ugly. We could prob just add a "pending"
        //  property to this class and check that before proceeding.
        try {
            const response = yield new MessagesApi(this.cityConfig(this.towerId)).getMessages({
                towerId: this.towerId,
                channelId: this.id
            });
            this.messages.clear();
            response.forEach(message => {
                this.messages.set(message.id, new ObservableMessage(this.cityConfig, message.id, message.channelId, message.towerId, message.senderId, message.sentTime, message.messageBody, message.attachments));
            });
            this.messagesLoadedOnce = true;
            console.log(`Updated messages for tower ${this.towerId}, and channel ${this.id}`);
        } catch (error) {
            // TODO: Make this a snackbar with notistack
            //  see https://github.com/iamhosseindhv/notistack
            console.log(`fetchMessages error: ${error}`);
            throw error;
        }
    }

    /**
     * Update the state of this channel to include a new message. This action should be dispatched if the client
     * was notified of a new message.
     */
    handleMessageCreated(message) {
        console.log(`Received new message for tower ${this.towerId}, channel ${this.id}`);
        // Field names use snake_case for some reason when we receive objects through STOMP/Websockets
        this.messages.set(message.id, new ObservableMessage(this.cityConfig, message.id, message.channel_id, message.tower_id, message.sender_id, message.sent_time, message.message_body, message.attachments));
    }

    handleMessageEdited(message) {
        console.log(`Message ${message.id} for tower ${this.towerId}, channel ${this.id} has been edited`);
        // Field names use snake_case for some reason when we receive objects through STOMP/Websockets
        const existingMessage = this.messages.get(message.id);
        // Only the message body is editable
        existingMessage.messageBody = message.message_body;
    }

    handleMessageDeleted(message) {
        console.log(`Received message delete event for message`);
        this.messages.delete(message.id);
    }

    * sendMessage(messageBody) {
        console.log(`Sending message in tower ${this.towerId}, channel ${this.id}.`);

        try {
            const request = {
                towerId: this.towerId,
                channelId: this.id,
                message: {messageBody: messageBody}
            };
            yield new MessagesApi(this.cityConfig(this.towerId)).createMessage(request);
        } catch (error) {
            // TODO: Make this a snackbar with notistack
            //  see https://github.com/iamhosseindhv/notistack
            console.log(`sendMessage error: ${error}`);
            throw error;
        }
    }
}