import {useContext} from 'react';
import { observer } from "mobx-react-lite";
import { UserContext } from "../context/userContext";
import default_avatar from "../assets/default-avatar.png";

export const MemberList = observer(function MemberList(props) {
	const {getUsername, getAvatarUrl} = useContext(UserContext);

	const members = props.tower && props.tower.member_account_ids ? 
		props.tower.member_account_ids.map(id => {

			const username = getUsername(id);
			const pfp = getAvatarUrl(id);

			return <li key={id}><img src={pfp ? pfp : default_avatar} alt={username}/><span>{username}</span></li>
		}) : [];

    return (
		<div id="memberList">
			<strong>Members</strong>
			<ol>
				{members}
			</ol>
		</div>
    );
})