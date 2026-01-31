import { Route, Switch } from "wouter";
import Index from "./pages/index";
import SignupPage from "./pages/signup";
import LoginPage from "./pages/login";
import ProfilePage from "./pages/profile";
import CuratorPage from "./pages/curator";
import { Provider } from "./components/provider";

function App() {
        return (
                <Provider>
                        <Switch>
                                <Route path="/" component={Index} />
                                <Route path="/signup" component={SignupPage} />
                                <Route path="/login" component={LoginPage} />
                                <Route path="/profile" component={ProfilePage} />
                                <Route path="/curator" component={CuratorPage} />
                        </Switch>
                </Provider>
        );
}

export default App;
