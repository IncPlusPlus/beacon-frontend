import {makeAutoObservable, observable} from "mobx"
import {MessagesApi} from "beacon-city";
import {ObservableMessage} from "./ObservableMessage";

export class ObservableChannel {
    cityConfig
    id
    towerId
    name = "UNKNOWN NAME"
    order = -1
    messages = observable.map()

    constructor(cityConfig, id, towerId, name, order, messages) {
        makeAutoObservable(this,
            {},
            // https://mobx.js.org/actions.html#actionbound to allow for "this" in actions
            {autoBind: true}
        );
        this.cityConfig = cityConfig;
        this.id = id;
        this.towerId = towerId;
        this.name = name;
        this.order = order;
        this.messages = observable.map(messages);
    }

    * fetchMessages() {
        console.log(`Refreshing messages for tower ${this.towerId}, channel ${this.id}.`);
        // TODO: Find a way to lock this flow from being called if it is already pending for this channel.
        //  Right now, this is being done inside messages.js and it's really ugly. We could prob just add a "pending"
        //  property to this class and check that before proceeding.
        try {
            const respone = yield new MessagesApi(this.cityConfig(this.towerId)).getMessages({
                towerId: this.towerId,
                channelId: this.id
            });
            this.messages.clear();
            respone.forEach(message => {
                this.messages.set(message.id, new ObservableMessage(this.cityConfig, message.id, message.channelId, message.towerId, message.senderId, message.sentTime, message.messageBody, message.attachments));
            });
            console.log(`Updated messages for tower ${this.towerId}, and channel ${this.id}`);
        } catch (error) {
            // TODO: Make this a snackbar with notistack
            //  see https://github.com/iamhosseindhv/notistack
            console.log(`fetchMessages error: ${error}`);
            throw error;
        }
    }
}