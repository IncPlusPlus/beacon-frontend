import React from 'react';

class TowerList extends React.Component {

    render() {

        // build server list
        let towers = [];

        Object.values(this.props.towers).forEach(tower => {
            let displayedName = tower.name;
            if (tower.id === this.props.selected) {
                displayedName = ">" + displayedName;
            }
            // create list element
            towers.push(<li key={tower.id} class='serverIcon' onClick={() => this.props.onClick(tower.id)}>{displayedName}</li>);
        })

        return (
            <ul>
                {towers}
            </ul>
        );
    }
}

export default TowerList;