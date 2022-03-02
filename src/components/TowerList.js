import React from 'react';

class TowerList extends React.Component {

    render() {

        // build server list
        let towers = [];

        Object.values(this.props.towers).forEach(tower => {
            let displayedName = tower.name;
            // create list element
            towers.push(<li className={'towerIcon' + (tower.id === this.props.selected ? ' selected' : '')}
                key={tower.id} onClick={() => this.props.onClick(tower.id)}>{displayedName}</li>);
        })

        return (
            <ul className='towerList'>
                {towers}
            </ul>
        );
    }
}

export default TowerList;