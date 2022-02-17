import './App.css';

import TowerList from './components/TowerList.js';
import ChannelList from './components/ChannelList.js';
import React from 'react';
import MessagePane from './components/MessagePane';

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
      towerId: "",
      channelId: "",
      selectedChannelCache: {}
    }

    // selectors
    this.selectTower = (id) => {
      this.setState({
        towerId: id,
        channelId: (id in this.state.selectedChannelCache ? this.state.selectedChannelCache[id] : ""),
        selectedChannelCache: this.state.selectedChannelCache
      });
    }
    
    this.selectChannel = (id) => {
      // Mark this channel as being the last one selected for this server
      let cache = this.state.selectedChannelCache;
      cache[this.state.towerId] = id;

      this.setState({
        towerId: this.state.towerId,
        channelId: id,
        selectedChannelCache: cache
      });
    }

  }

  render() {

    // only show the channel list when valid
    const channelList = this.state.towerId !== "" ? 
    <ChannelList channels={DUMMY_DATA.towers[this.state.towerId].channels} selected={this.state.channelId} onClick={this.selectChannel}/>
      : (<div></div>);

      console.log(2);
    const messagePane = this.state.towerId !== "" && this.state.channelId !== "" ? 
      <MessagePane messages={DUMMY_DATA.towers[this.state.towerId].channels[this.state.channelId].messages}/>
      : <div></div>

    return (
      <div>
        <TowerList towers={DUMMY_DATA.towers} selected={this.state.towerId} onClick={this.selectTower}/>
        {channelList}
        {messagePane}
      </div>
    );
  }

}

export default App;
