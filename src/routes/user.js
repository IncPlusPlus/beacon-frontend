import React from "react";
import default_avatar from '../assets/default-avatar.png';

export const UserDetails = (props) => {
    return (
        <div className='userDetailsPane'>
            <div className='userDetails'>
				<span className='username'>Username</span>
				<img alt="Your Avatar" src={default_avatar}/>
			</div>
        </div>
    );
}