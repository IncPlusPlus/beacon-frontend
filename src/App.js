import TowerList from './components/TowerList.js';
import ServerDetailsPanel from './components/ServerDetailsPanel.js';
import UserDetailsPanel from './components/UserDetailsPanel.js';
import React from 'react';
import MessagePane from './components/MessagePane';

const DUMMY_DATA = {
  towers: {
    "00000000":{
      id: "00000000",
      name: "Cool Tower",
      iconUrl: "https://static01.nyt.com/images/2021/09/14/science/07CAT-STRIPES/07CAT-STRIPES-mediumSquareAt3X-v2.jpg",
      channels: {
        "00000006":{
          id: "00000006",
          name: "general",
          messages: [
            {
              id: "00000000",
              author: "000000000",
              content: "Hello, world!"
            },
            {
              id: "00000000",
              author: "000000000",
              content: "Hello, world!"
            },
            {
              id: "00000000",
              author: "000000000",
              content: "Hello, world!"
            },
            {
              id: "00000000",
              author: "000000000",
              content: "Hello, world!"
            },
            {
              id: "00000000",
              author: "000000000",
              content: "Hello, world!"
            },
            {
              id: "00000000",
              author: "000000000",
              content: "Hello, world!"
            },
            {
              id: "00000000",
              author: "000000000",
              content: "Hello, world!"
            },
            {
              id: "00000000",
              author: "000000000",
              content: "Hello, world!"
            },
            {
              id: "00000000",
              author: "000000000",
              content: "Hello, world!"
            },
          ]
        },
        "00000007":{
          id: "00000007",
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
      iconUrl: "",
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

    this.selectUserProfile = () => {
      this.setState({
        towerId: 'USER',
        channelId: '',
        selectedChannelCache: this.state.selectedChannelCache
      });
    }
    
    this.selectChannel = (id) => {
      // Mark this channel as being the last one selected for this server
      let cache = this.state.selectedChannelCache;
      cache[this.state.towerId] = id;

      // this is just a nice little feature
      document.title = '#' + DUMMY_DATA.towers[this.state.towerId].channels[id].name;

      this.setState({
        towerId: this.state.towerId,
        channelId: id,
        selectedChannelCache: cache
      });
    }

  }

  render() {

    // only show the channel list when valid
    const serverDetailsPanel = (this.state.towerId !== "" && this.state.towerId !== "USER")  ? 
    <ServerDetailsPanel serverName={DUMMY_DATA.towers[this.state.towerId].name} channels={DUMMY_DATA.towers[this.state.towerId].channels} selected={this.state.channelId} onClick={this.selectChannel}/>
      : (<div></div>);
    
      // Show user info or messages?
      const detailedPanel = (this.state.towerId === "USER")  ? 
      (<UserDetailsPanel/>)
      : (<MessagePane messages={(this.state.towerId !== "" && this.state.channelId !== "") ? DUMMY_DATA.towers[this.state.towerId].channels[this.state.channelId].messages : []}/>);

    return (
      <div className='appContainer'>
        <TowerList towers={DUMMY_DATA.towers} selected={this.state.towerId} onClick={this.selectTower} onUserIconSelected={this.selectUserProfile}/>
        {serverDetailsPanel}
        {detailedPanel}
      </div>
    );
  }

}

export default App;
