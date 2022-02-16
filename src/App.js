import './App.css';

import './ServerList.js';
import ServerList from './ServerList.js';
import ChannelList from './ChannelList.js';
import React from 'react';

const DUMMY_DATA = {
  towers: {
    "00000000":{
      id: "00000000",
      name: "Cool Tower",
      channels: {
        "00000006":{
          id: "00000006",
          name: "general",
          messages: [
            {
              id: "00000000",
              author: "000000000",
              content: "Hello, world!"
            }
          ]
        }
      },
      members: [
        "00000000",
        "00000001",
        "00000002",
      ]
    },
    "00000069":{
      id: "00000069",
      name: "Cool Tower 2",
      channels: {
        "00000008":{
          id: "00000008",
          name: "memes",
          messages: [
            {
              id: "00000000",
              author: "000000000",
              content: "Hello, world!"
            }
          ]
        }
      },
      members: [
        "00000000",
        "00000001",
        "00000002",
      ]
    }
  }
}

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      serverId: "",
      channelId: ""
    }

    // selectors
    this.selectServer = (id) => {
      this.setState({
        serverId: id,
        channelId: ""
      });
    }
    this.selectChannel = (id) => {
      this.setState({
        serverId: this.state.serverId,
        channelId: id
      });
    }

  }

  render() {
    return (
      <div>
        <ServerList servers={DUMMY_DATA.towers} selectedServerId={this.state.serverId} onClick={this.selectServer}/>
        <ChannelList channels={this.state.serverId == "" ? [] : DUMMY_DATA.towers[this.state.serverId].channels} selectedChannelId={this.state.channelId} onClick={this.selectChannel}/>
      </div>
    );
  }

}

export default App;
