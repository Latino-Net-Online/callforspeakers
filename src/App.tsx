import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import CallForSpeakersPage from "./pages/CallForSpeakersPage";
import "react-advanced-cropper/dist/style.css";
import { AuthProvider, AuthProviderProps } from "oidc-react";
import CallbackPage from "./pages/CallbackPage";
import SignOutRedirectPage from "./pages/SignOutRedirectPage";
import { AppContextProvider } from "./data/AppContext";
import ThankYouPage from "./pages/ThankYouPage";
import { config } from "./config/EnvConfig";

const oidcConfig: AuthProviderProps = {
  authority: "https://ids.latinonet.online",
  clientId: config.clientId,
  redirectUri: config.redirectUri,
  scope: "openid profile email email_user roles latinonetonline_api",
  responseType: "code",
  postLogoutRedirectUri: config.postLogoutRedirectUri,
  autoSignIn: false,
  loadUserInfo: true,
};

console.log("config", config);
const App = () => {
  return (
    <AuthProvider {...oidcConfig}>
      <AppContextProvider>
        <div id="app_container">
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Routes>
              <Route path="/" element={<CallForSpeakersPage />}></Route>
              <Route path="/callback" element={<CallbackPage />}></Route>
              <Route path="/thank-you" element={<ThankYouPage />}></Route>
              <Route
                path="/signout-redirect"
                element={<SignOutRedirectPage />}
              ></Route>
            </Routes>
          </BrowserRouter>
        </div>
      </AppContextProvider>
    </AuthProvider>
  );
};

export default App;
