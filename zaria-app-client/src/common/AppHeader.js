import React, { Component } from 'react';
import {
    Link,
    withRouter
} from 'react-router-dom';
import './AppHeader.css';
import InfiniteScroll from 'react-infinite-scroller';
import logo from '../logo.png';
import {Layout, Menu, Dropdown, Icon, Badge, Popover, Button, List, Spin, Avatar, Tag} from 'antd';
const Header = Layout.Header;
const SubMenu = Menu.SubMenu;
    
class AppHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showCart: false,
            cart: this.props.cartItems,
            cartLoading: false,
            hasMore: true
        };

        this.handleMenuClick = this.handleMenuClick.bind(this);   
    }

    handleCart  = (visible) => {
        this.setState({ showCart: visible });
    }

    handleInfiniteOnLoad = () => {
        let data = this.state.cart;
        this.setState({
            loading: true,
        });
        if (data.length > 0) {
            this.setState({
                hasMore: false,
                loading: false,
            });
        }
    }

    handleMenuClick({ key }) {
      if(key === "logout") {
        this.props.onLogout();
      }
      if(key === "/admin/messages") {
          this.props.onMessages();
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
                    <Menu.Item key="/admin/messages">
                        <Link to="/admin/messages">
                            <Badge count={this.props.numUnreadMessages}>
                                <Icon type="mail" className="nav-icon"/>
                            </Badge>
                        </Link>
                    </Menu.Item>,
                    <Menu.Item key="/articles">
                        <Link to="/articles">
                            <Icon type="tags-o" className="nav-icon"/>
                        </Link>
                    </Menu.Item>,
                    <Menu.Item key="/article/new">
                        <Link to="/article/new">
                            <Icon type="file-add" className="nav-icon"/>
                        </Link>
                    </Menu.Item>,
                    <Menu.Item key="/order/new">
                        <Link to="/order/new">
                            <Icon type="folder-add" className="nav-icon"/>
                        </Link>
                    </Menu.Item>,
                    <Menu.Item key="/user/new">
                        <Link to="/user/new">
                            <Icon type="user-add" className="nav-icon"/>
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
                    <Menu.Item key="shopping-cart">
                        <Popover
                            overlayClassName="cart"
                            placement="bottom"
                            content={
                                <div>
                                    <div className="demo-infinite-container">
                                        <InfiniteScroll
                                            initialLoad={false}
                                            pageStart={0}
                                            loadMore={this.handleInfiniteOnLoad}
                                            hasMore={!this.state.loading && this.state.hasMore}
                                            useWindow={false}
                                        >
                                            <List
                                                dataSource={this.state.cart}
                                                renderItem={item => (
                                                    <List.Item
                                                        key={item.id}
                                                        actions={[<a className="product-remove" href="#" onClick={this.props.removeProduct.bind(this, item.id)}>×</a>]}
                                                    >
                                                        <List.Item.Meta
                                                            avatar={<Avatar src={process.env.PUBLIC_URL + item.image.substring(63)} />}
                                                            title={item.name}
                                                            description={
                                                                <div className="product-info">
                                                                    <Tag color={item.color}> {item.size} </Tag>
                                                                    <p className="product-price">{item.price}</p>
                                                                </div>}
                                                        />
                                                        <div>
                                                            <div className="product-total">
                                                                <p className="quantity">{item.quantity} {item.quantity > 1 ?"Nos." : "No." } </p>
                                                                <p className="amount">{item.quantity * item.price}</p>
                                                            </div>
                                                        </div>
                                                    </List.Item>
                                                )}
                                            >
                                                {this.state.loading && this.state.hasMore && (
                                                    <div className="demo-loading-container">
                                                        <Spin />
                                                    </div>
                                                )}
                                            </List>
                                        </InfiniteScroll>
                                    </div>
                                    <div className="action-block">
                                        <p className="quantity">{this.props.totalItems} {this.props.totalItems > 1 ?"Nos." : "No." } </p>
                                        <p className="amount">{this.props.totalAmount}</p>
                                        <Button className="checkout"
                                                type="primary"
                                                disabled={!(this.state.cart.length > 0)}
                                                onClick={this.props.onCheckout}>
                                            Proceed to checkout
                                        </Button>
                                    </div>
                                </div>
                            }
                            title="Shopping cart"
                            trigger="click"
                            visible={this.state.showCart}
                            onVisibleChange={this.handleCart}
                        >
                            <Badge count={this.props.totalItems}>
                                <Icon type="shopping-cart" className="nav-icon" />
                            </Badge>
                        </Popover>
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
                    <img src={logo} alt="logo" className="my-icon"/>
                </Link>
              </div>
              <Menu
                className="app-menu"
                mode="horizontal"
                selectedKeys={[this.props.location.pathname]}
                style={{ lineHeight: '64px' }}
                onClick={this.handleMenuClick}>
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