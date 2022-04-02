import {makeAutoObservable, observable} from "mobx"
import {ChannelsApi} from "beacon-city";
import {ObservableChannel} from "./ObservableChannel";

export class ObservableTower {
    cityConfig
    id
    cityId
    name = "UNKNOWN NAME"
    adminAccountId = ""
    moderator_account_ids = observable.array()
    member_acount_ids = observable.array()
    channels = observable.map()

    constructor(cityConfig, id, cityId, name, adminAccountId, moderator_account_ids, member_account_ids, channels) {
        console.log('Making a new ObservableTower instance.');
        makeAutoObservable(this,
            {},
            // https://mobx.js.org/actions.html#actionbound to allow for "this" in actions
            {autoBind: true}
        );
        this.cityConfig = cityConfig;
        this.id = id;
        this.cityId = cityId;
        this.name = name;
        this.adminAccountId = adminAccountId;
        this.moderator_account_ids = observable.array(moderator_account_ids);
        this.member_account_ids = observable.array(member_account_ids);
        this.channels = observable.map(channels);
    }

    * refreshChannels() {
        console.log(`Refreshing channels for tower ${this.id}.`);
        const channelsIdsBeforeRefresh = Array.from(this.channels.keys());
        const channelIdsFromBackend = [];
        // TODO: Find a way to lock this flow from being called if it is already pending for this tower
        try {
            const channels = yield new ChannelsApi(this.cityConfig(this.id)).getChannels({towerId: this.id});
            channels.forEach(channel => {
                channelIdsFromBackend.push(channel.id);
                // If we already know about this channel
                if (this.channels.has(channel.id)) {
                    // Update channel info (UI will only refresh if this data (like the channel name) is new)
                    const existingChannel = this.channels.get(channel.id);
                    existingChannel.name = channel.name;
                    existingChannel.order = channel.order;
                } else {
                    // Add this as a new channel
                    this.channels.set(channel.id, new ObservableChannel(this.cityConfig, channel.id, channel.towerId, channel.name, channel.order, channel.message));
                }
            });
        } catch (error) {
            // TODO: Make this a snackbar with notistack
            //  see https://github.com/iamhosseindhv/notistack
            console.log(`fetchMessages error: ${error}`);
            throw error;
        }
        // Delete all channels that are present in our Map but don't exist in the list the backend returned
        channelsIdsBeforeRefresh
            .filter(channelId => !channelIdsFromBackend.includes(channelId))
            .forEach(idOfChannelToDelete => this.channels.delete(idOfChannelToDelete));
        console.log(`Finished refreshing channels for tower ${this.id}.`);
    }
}