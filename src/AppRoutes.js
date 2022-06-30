import {
  createSearchParams,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Towers } from "./routes/towers";
import { Channels } from "./routes/channels";
import { Messages } from "./routes/messages";
import { UserDetails } from "./routes/user";
import { SignInContext } from "./context/signInContext";
import { useContext } from "react";
import { LoginPage } from "./routes/LoginPage";
import { SignupPage } from "./routes/SignupPage";

export const AppRoutes = (props) => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route
      path="/"
      element={
        // https://reactrouter.com/docs/en/v6/upgrading/v5#refactor-custom-routes
        <RequireAuth redirectTo="/login">
          <Towers />
        </RequireAuth>
      }
    >
      <Route path="/channels/:towerId" element={<Channels />}>
        <Route path=":channelId" element={<Messages />} />
      </Route>
      <Route path="/me" element={<UserDetails />} />
    </Route>
  </Routes>
);

function RequireAuth({ children, redirectTo }) {
  const { signedIn } = useContext(SignInContext);
  const loc = useLocation();
  const params = createSearchParams({
    resumePath: loc.pathname,
    resumeSearch: loc.search,
  });
  return signedIn ? children : <Navigate to={redirectTo + "?" + params} />;
}
