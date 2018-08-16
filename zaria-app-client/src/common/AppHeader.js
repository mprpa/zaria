import React, { Component } from 'react';
import {
    Link,
    withRouter
} from 'react-router-dom';
import './AppHeader.css';
import logo from '../logo.png';
import { Layout, Menu, Dropdown, Icon } from 'antd';
const Header = Layout.Header;
const SubMenu = Menu.SubMenu;
    
class AppHeader extends Component {
    constructor(props) {
        super(props);   
        this.handleMenuClick = this.handleMenuClick.bind(this);   
    }

    handleMenuClick({ key }) {
      if(key === "logout") {
        this.props.onLogout();
      }
    }

    render() {
        let menuItems;
        if (this.props.currentUser) {
            if (this.props.isAdmin) {
                menuItems = [
                    <Menu.Item key="/">
                        <Link to="/">
                            <Icon type="home" className="nav-icon"/>
                        </Link>
                    </Menu.Item>,
                    <Menu.Item key="/article/new">
                        <Link to="/article/new">
                            <Icon type="file-add" className="nav-icon"/>
                        </Link>
                    </Menu.Item>,
                    <Menu.Item key="logout"
                               onClick={this.props.onLogout}>
                        Logout
                    </Menu.Item>
                ];
            } else {
                menuItems = [
                    <Menu.Item key="/">
                        <Link to="/">
                            <Icon type="home" className="nav-icon"/>
                        </Link>
                    </Menu.Item>,
                    <Menu.Item key="/poll/new">
                        <Link to="/poll/new">
                            {/*<img src={pollIcon} alt="poll" className="poll-icon"/>*/}
                        </Link>
                    </Menu.Item>,
                    <Menu.Item key="/profile" className="profile-menu">
                        <ProfileDropdownMenu
                            currentUser={this.props.currentUser}
                            handleMenuClick={this.handleMenuClick}/>
                    </Menu.Item>,
                    <Menu.Item key="/aboutus">
                        <Link to="/aboutus">About us</Link>
                    </Menu.Item>
                ];
            }
        } else {
            menuItems = [
                <Menu.Item key="/login">
                    <Link to="/login">Login</Link>
                </Menu.Item>,
                <SubMenu title={<span>Register</span>} key="/register">
                    <Menu.Item key="/signup">
                        <Link to="/signup">Register user</Link>
                    </Menu.Item>
                    <Menu.Item key="/signuplegal">
                        <Link to="/signuplegal">Register company</Link>
                    </Menu.Item>
                </SubMenu>,
                <Menu.Item key="/aboutus">
                    <Link to="/aboutus">About us</Link>
                </Menu.Item>

            ];
        }

        return (
            <Header className="app-header">
            <div className="container">
              <div className="app-title" >
                <Link to="/">
                    <img src={logo} alt="logo" className="poll-icon"/>
                </Link>
              </div>
              <Menu
                className="app-menu"
                mode="horizontal"
                selectedKeys={[this.props.location.pathname]}
                style={{ lineHeight: '64px' }} >
                  {menuItems}
              </Menu>
            </div>
          </Header>
        );
    }
}

function ProfileDropdownMenu(props) {
  const dropdownMenu = (
    <Menu onClick={props.handleMenuClick} className="profile-dropdown-menu">
      <Menu.Item key="user-info" className="dropdown-item" disabled>
        <div className="user-full-name-info">
          {props.currentUser.name}
        </div>
        <div className="username-info">
          @{props.currentUser.username}
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="profile" className="dropdown-item">
        <Link to={`/users/${props.currentUser.username}`}>Profile</Link>
      </Menu.Item>
        <Menu.Item key="edit" className="dropdown-item">
            <Link to={`/users/${props.currentUser.username}/edit`}>Edit profile</Link>
        </Menu.Item>
      <Menu.Item key="logout" className="dropdown-item">
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown 
      overlay={dropdownMenu} 
      trigger={['click']}
      getPopupContainer = { () => document.getElementsByClassName('profile-menu')[0]}>
      <a className="ant-dropdown-link">
         <Icon type="user" className="nav-icon" style={{marginRight: 0}} /> <Icon type="down" />
      </a>
    </Dropdown>
  );
}


export default withRouter(AppHeader);