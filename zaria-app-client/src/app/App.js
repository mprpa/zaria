import React, { Component } from 'react';
import './App.css';
import {
    Route,
    withRouter,
    Switch
} from 'react-router-dom';

import { getCurrentUser, getNumUnreadMessages, readMessages, getProducts } from '../util/APIUtils';
import { ACCESS_TOKEN } from '../constants';

import IndexPage from './IndexPage';
import Login from '../user/login/Login';
import Signup from '../user/signup/Signup';
import SignupLegal from '../user/signup/SignupLegal';
import Profile from '../user/profile/Profile';
import EditProfile from '../user/profile/EditProfile';
import AboutUs from '../user/AboutUs';
import NewArticle from '../user/admin/NewArticle';
import Messages from '../user/admin/Messages';
import Checkout from '../user/Checkout';
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
            isLegal: false,
            isLoading: false,
            messages: 0,
            messagesList: null,
            products: [],
            cart: [],
            totalItems: 0,
            totalAmount: 0,
            term: '',
            category: ''
        }
        this.handleLogout = this.handleLogout.bind(this);
        this.loadCurrentUser = this.loadCurrentUser.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.getUnreadMessages = this.getUnreadMessages.bind(this);
        this.handleReadMessages = this.handleReadMessages.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleCategory = this.handleCategory.bind(this);
        this.handleAddToCart = this.handleAddToCart.bind(this);
        this.sumTotalItems = this.sumTotalItems.bind(this);
        this.sumTotalAmount = this.sumTotalAmount.bind(this);
        this.checkProduct = this.checkProduct.bind(this);
        this.handleRemoveProduct = this.handleRemoveProduct.bind(this);
        this.handleCheckout = this.handleCheckout.bind(this);
        this.clearCart = this.clearCart.bind(this);

        notification.config({
            placement: 'topRight',
            top: 70,
            duration: 3,
        });
    }

    getProducts() {
        getProducts()
            .then(response => {
                this.setState({
                    products: response
                })
            }).catch(error => {
            this.setState({
                isLoading: false
            });
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
                    isLegal: response.legal,
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
        this.getProducts();
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

    // Search by Keyword
    handleSearch(event){
        this.setState({term: event.target.value});
    }
    // Filter by Category
    handleCategory(event){
        this.setState({category: event.target.value});
        console.log(this.state.category);
    }
    // Add to Cart
    handleAddToCart(selectedProducts){
        let cartItem = this.state.cart;
        let productID = selectedProducts.id;
        let productQty = selectedProducts.quantity;
        if(this.checkProduct(productID)){
            let index = cartItem.findIndex((x => x.id === productID));
            cartItem[index].quantity = Number(cartItem[index].quantity) + Number(productQty);
            this.setState({
                cart: cartItem
            })
        } else {
            cartItem.push(selectedProducts);
        }
        this.setState({
            cart : cartItem
        });
        setTimeout(function(){
            this.setState({
                quantity: 1
            });
        }.bind(this),1000);
        this.sumTotalItems(this.state.cart);
        this.sumTotalAmount(this.state.cart);
    }
    handleRemoveProduct(id, e){
        let cart = this.state.cart;
        let index = cart.findIndex((x => x.id === id));
        cart.splice(index, 1);
        this.setState({
            cart: cart
        })
        this.sumTotalItems(this.state.cart);
        this.sumTotalAmount(this.state.cart);
        e.preventDefault();
    }
    checkProduct(productID){
        let cart = this.state.cart;
        return cart.some(function(item) {
            return item.id === productID;
        });
    }
    sumTotalItems(){
        let total = 0;
        let cart = this.state.cart;
        total = cart.length;
        this.setState({
            totalItems: total
        })
    }
    sumTotalAmount(){
        let total = 0;
        let cart = this.state.cart;
        for (var i=0; i<cart.length; i++) {
            total += cart[i].price * parseInt(cart[i].quantity);
        }
        this.setState({
            totalAmount: total
        })
    }

    handleCheckout() {
        this.props.history.push("/checkout");
    }

    clearCart() {
        this.setState({
            cart: this.state.cart.splice(0, this.state.cart.length),
            totalItems: 0,
            totalAmount: 0,
            term: '',
            category: ''
        })
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
                           onMessages={this.handleReadMessages}
                           totalItems={this.state.totalItems}
                           totalAmount={this.state.totalAmount}
                           cartItems={this.state.cart}
                           removeProduct={this.handleRemoveProduct}
                           onCheckout={this.handleCheckout}
                />

                <Content className="app-content">
                    <div className="container">
                        <Switch>
                            <Route exact path="/"
                                   render={(props) => <IndexPage isAuthenticated={this.state.isAuthenticated}
                                                                 isAdmin={this.state.isAdmin}
                                                                 isLegal={this.state.isLegal}
                                                                 currentUser={this.state.currentUser}
                                                                 productsList={this.state.products}
                                                                 searchTerm={this.state.term}
                                                                 handleCategory={this.handleCategory}
                                                                 categoryTerm={this.state.category}
                                                                 addToCart={this.handleAddToCart}
                                                                 handleSearch={this.handleSearch} {...props} />}>
                            </Route>
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
                                                                currentUser={this.state.currentUser}
                                                                getUnreadMessages={this.getUnreadMessages} {...props} />}>
                            </Route>
                            <Route path="/checkout"
                                   render={(props) => <Checkout isAuthenticated={this.state.isAuthenticated}
                                                                currentUser={this.state.currentUser}
                                                                isLegal={this.state.isLegal}
                                                                cartItems={this.state.cart}
                                                                totalItems={this.state.totalItems}
                                                                totalAmount={this.state.totalAmount}
                                                                clearCart={this.clearCart} {...props} />}>
                            </Route>
                            <Route component={NotFound}/>
                        </Switch>
                    </div>
                </Content>
            </Layout>
        );
    }
}

export default withRouter(App);
