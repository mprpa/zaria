import React, { Component } from 'react';
import './App.css';
import {
    Route,
    withRouter,
    Switch
} from 'react-router-dom';

import { getCurrentUser, getNumUnreadMessages, readMessages } from '../util/APIUtils';
import { ACCESS_TOKEN } from '../constants';

import Login from '../user/login/Login';
import Signup from '../user/signup/Signup';
import SignupLegal from '../user/signup/SignupLegal';
import Profile from '../user/profile/Profile';
import EditProfile from '../user/profile/EditProfile';
import AboutUs from '../user/AboutUs';
import NewArticle from '../user/admin/NewArticle';
import Messages from '../user/admin/Messages';
import AppHeader from '../common/AppHeader';
import NotFound from '../common/NotFound';
import LoadingIndicator from '../common/LoadingIndicator';

import { Layout, notification } from 'antd';
const { Content } = Layout;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            isAuthenticated: false,
            isAdmin: false,
            isLoading: false,
            messages: 0,
            messagesList: null
        }
        this.handleLogout = this.handleLogout.bind(this);
        this.loadCurrentUser = this.loadCurrentUser.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.getUnreadMessages = this.getUnreadMessages.bind(this);
        this.handleReadMessages = this.handleReadMessages.bind(this);

        notification.config({
            placement: 'topRight',
            top: 70,
            duration: 3,
        });
    }

    loadCurrentUser() {
        this.setState({
            isLoading: true
        });
        getCurrentUser()
            .then(response => {
                this.setState({
                    currentUser: response,
                    isAuthenticated: true,
                    isAdmin: response.admin,
                    isLoading: false
                });
            }).catch(error => {
            this.setState({
                isLoading: false
            });
        });
    }

    getUnreadMessages() {
        getNumUnreadMessages()
            .then(response => {
                this.setState({
                    messages: response.countUnseen,
                    messagesList: response.messageList
                });
            }).catch(error => {
            this.setState({
                isLoading: false
            });
        });
    }

    componentWillMount() {
        this.loadCurrentUser();
        this.getUnreadMessages();
    }

    // Handle Logout, Set currentUser and isAuthenticated state which will be passed to other components
    handleLogout(redirectTo = "/", notificationType = "success", description = "You're successfully logged out.") {
        localStorage.removeItem(ACCESS_TOKEN);

        this.setState({
            currentUser: null,
            isAuthenticated: false,
            isAdmin: false
        });

        this.props.history.push(redirectTo);

        notification[notificationType]({
            message: 'Zaria fashion',
            description: description,
        });
    }

    /*
     This method is called by the Login component after successful login
     so that we can load the logged-in user details and set the currentUser &
     isAuthenticated state, which other components will use to render their JSX
    */
    handleLogin() {
        notification.success({
            message: 'Zaria fashion',
            description: "You're successfully logged in.",
        });
        this.loadCurrentUser();
        this.props.history.push("/");
    }

    handleReadMessages() {
        readMessages()
            .then(response => {
                this.setState({
                    messages: 0
                });
            }).catch(error => {
            this.setState({
                isLoading: false
            });
        });
    }

    render() {
        if (this.state.isLoading) {
            return <LoadingIndicator/>
        }
        return (
            <Layout className="app-container">
                <AppHeader isAuthenticated={this.state.isAuthenticated}
                           isAdmin={this.state.isAdmin}
                           numUnreadMessages={this.state.messages}
                           currentUser={this.state.currentUser}
                           onLogout={this.handleLogout}
                           onMessages={this.handleReadMessages}/>

                <Content className="app-content">
                    <div className="container">
                        <Switch>
                            {/*<Route exact path="/"*/}
                                   {/*render={(props) => <PollList isAuthenticated={this.state.isAuthenticated}*/}
                                                                {/*currentUser={this.state.currentUser}*/}
                                                                {/*handleLogout={this.handleLogout} {...props} />}>*/}
                            {/*</Route>*/}
                            <Route path="/login" render={(props) => <Login onLogin={this.handleLogin} {...props} />}/>
                            <Route path="/signup" component={Signup}/>
                            <Route path="/signuplegal" component={SignupLegal}/>
                            <Route path="/aboutus"
                                   render={(props) => <AboutUs currentUser={this.state.currentUser} {...props} />}>
                            </Route>
                            <Route path="/users/:username/edit"
                                   render={(props) => <EditProfile isAuthenticated={this.state.isAuthenticated}
                                                                   currentUser={this.state.currentUser} {...props} />}>
                            </Route>
                            <Route path="/users/:username"
                                   render={(props) => <Profile isAuthenticated={this.state.isAuthenticated}
                                                               currentUser={this.state.currentUser} {...props} />}>
                            </Route>
                            <Route path="/article/new"
                                   render={(props) => <NewArticle isAuthenticated={this.state.isAuthenticated}
                                                                  isAdmin={this.state.isAdmin}
                                                                  currentUser={this.state.currentUser} {...props} />}>
                            </Route>
                            <Route path="/admin/messages"
                                   render={(props) => <Messages isAuthenticated={this.state.isAuthenticated}
                                                                isAdmin={this.state.isAdmin}
                                                                messagesList={this.state.messagesList}
                                                                currentUser={this.state.currentUser} {...props} />}>
                            </Route>
                            <Route component={NotFound} />
                        </Switch>
                    </div>
                </Content>
            </Layout>
        );
    }
}

export default withRouter(App);
