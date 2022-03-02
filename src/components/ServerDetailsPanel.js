import React from 'react';

class ServerDetailsPanel extends React.Component {
    render() {

        let channels = [];
        Object.values(this.props.channels).forEach(channel => {
            let displayedName = channel.name;
            // create list element
            channels.push(<li className={'channelIcon' + (channel.id === this.props.selected ? ' selected' : '')} 
                key={channel.id} onClick={() => this.props.onClick(channel.id)}>{displayedName}</li>);
        })

        return (
            <div className='serverDetailsPanel'>
                <h2>{this.props.serverName}</h2>
                <ul className='channelList'> 
                    {channels}
                </ul>
            </div>
        );
    }
}

export default ServerDetailsPanel;