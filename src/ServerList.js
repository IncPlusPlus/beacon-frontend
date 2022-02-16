import React from 'react';

class ServerList extends React.Component {

    render() {

        // build server list
        let servers = [];

        Object.values(this.props.servers).forEach(serv => {
            let displayedName = serv.name;
            if (serv.id === this.props.selectedServerId) {
                displayedName = ">" + displayedName;
            }
            // create list element
            servers.push(<li key={serv.id} class='serverIcon' onClick={() => this.props.onClick(serv.id)}>{displayedName}</li>);
        })

        return (
            <ul>
                {servers}
            </ul>
        );
    }
}

export default ServerList;