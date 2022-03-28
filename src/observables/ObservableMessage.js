import {makeAutoObservable} from "mobx"
import {MessagesApi} from "beacon-city";

export class ObservableMessage {
    cityConfig
    id
    channelId
    towerId
    senderId
    sentTime
    messageBody
    attachments

    constructor(cityConfig, id, channelId, towerId, senderId, sentTime, messageBody, attachments) {
        makeAutoObservable(this,
            {},
            // https://mobx.js.org/actions.html#actionbound to allow for "this" in actions
            {autoBind: true}
        );
        this.cityConfig = cityConfig;
        this.id = id;
        this.channelId = channelId;
        this.towerId = towerId;
        this.senderId = senderId;
        this.sentTime = sentTime;
        this.messageBody = messageBody;
        this.attachments = attachments;
    }

    * deleteMessage() {
        console.log(`Deleting message ${this.id} in channel ${this.channelId} in tower ${this.towerId}`);
        try {
            yield new MessagesApi(this.cityConfig(this.towerId)).deleteMessage({
                towerId: this.towerId,
                channelId: this.channelId,
                messageId: this.id
            });
            console.log(`Deleted message ${this.id} in channel ${this.channelId} in tower ${this.towerId}`);
        } catch (error) {
            console.log(`deleteMessage error: ${error}`);
        }
    }
}