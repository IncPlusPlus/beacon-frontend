import {Route, Routes} from "react-router-dom";
import {Towers} from "./routes/towers";
import {Channels} from "./routes/channels";
import {Messages} from "./routes/messages";
import {UserDetails} from "./routes/user"

export const AppRoutes = (props) => <Routes>
    <Route path="/" element={<Towers/>}>
        <Route path="/channels/:towerId" element={<Channels/>}>
            <Route path=":channelId" element={<Messages/>}/>
        </Route>
        <Route path="/me" element={<UserDetails/>}/>
    </Route>
</Routes>;