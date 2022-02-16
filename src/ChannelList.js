import React from 'react';

class ChannelList extends React.Component {
    render() {

        let channels = [];
        Object.values(this.props.channels).forEach(channel => {
            let displayedName = channel.name;
            if (channel.id === this.props.selectedChannelId) {
                displayedName = ">" + displayedName;
            }
            // create list element
            channels.push(<li key={channel.id} class='channelIcon' onClick={() => this.props.onClick(channel.id)}>{displayedName}</li>);
        })

        return (
            <ul>
                {channels}
            </ul>
        );
    }
}

export default ChannelList;