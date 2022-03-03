import React from 'react';

class TowerList extends React.Component {
    render() {
        return (
            <ol className='towerList'>

                <li className={'towerIcon' + (this.props.selected === "USER" ? ' selected' : '')}
                    key='USER'
                    onClick={() => this.props.onUserIconSelected()}>
                    <img src='https://sciman.info/assets/img/icon.png' alt="Your Profile"/>
                </li>
                <hr/>

                {Object.values(this.props.towers).map(tower => {
                    return <li 
                        className={'towerIcon' + (tower.id === this.props.selected ? ' selected' : '')}
                        key={tower.id}
                        onClick={() => this.props.onClick(tower.id)}>
                            {tower.iconUrl === '' ? <span>{tower.name}</span> : <img src={tower.iconUrl} alt={tower.name}/>}
                        </li>
                })}
            </ol>
        );
    }
}

export default TowerList;