import React, { Component } from 'react';
import { getUserProfile } from '../../util/APIUtils';
import {Avatar, List, Tag} from 'antd';
import { getAvatarColor } from '../../util/Colors';
import { formatDate } from '../../util/Helpers';
import LoadingIndicator  from '../../common/LoadingIndicator';
import './Profile.css';
import NotFound from '../../common/NotFound';
import ServerError from '../../common/ServerError';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: false
        };
        this.loadUserProfile = this.loadUserProfile.bind(this);
    }

    loadUserProfile(username) {
        this.setState({
            isLoading: true
        });

        getUserProfile(username)
        .then(response => {
            this.setState({
                user: response,
                isLoading: false
            });
        }).catch(error => {
            if(error.status === 404) {
                this.setState({
                    notFound: true,
                    isLoading: false
                });
            } else {
                this.setState({
                    serverError: true,
                    isLoading: false
                });        
            }
        });        
    }
      
    componentDidMount() {
        const username = this.props.match.params.username;
        if(this.props.currentUser.username !== username) {
            this.setState({
                serverError: true,
                isLoading: false
            });
        } else {
            this.loadUserProfile(username);
        }
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.match.params.username !== nextProps.match.params.username) {
            this.loadUserProfile(nextProps.match.params.username);
        }        
    }

    render() {
        if(this.state.isLoading) {
            return <LoadingIndicator />;
        }

        if(this.state.notFound) {
            return <NotFound />;
        }

        if(this.state.serverError) {
            return <ServerError />;
        }

        return (
            <div className="profile">
                { 
                    this.state.user ? (
                        <div className="user-profile">
                            <div className="user-details">
                                <div className="user-avatar">
                                    <Avatar className="user-avatar-circle" style={{ backgroundColor: getAvatarColor(this.state.user.name)}}>
                                        {this.state.user.name[0].toUpperCase()}
                                    </Avatar>
                                </div>
                                <div className="user-summary">
                                    <div className="full-name">{this.state.user.name}</div>
                                    <div className="username">@{this.state.user.username}</div>
                                    <div className="user-joined">
                                        Joined {formatDate(this.state.user.joinedAt)}
                                    </div>
                                </div>
                            </div>
                            <div className="user-order-details">
                                <List
                                    itemLayout="vertical"
                                    size="large"
                                    bordered
                                    pagination={{
                                        onChange: (page) => {
                                            console.log(page);
                                        },
                                        pageSize: 3,
                                    }}
                                    dataSource={this.state.user.pastOrders}
                                    renderItem={order => (
                                        <List.Item
                                            key={order.id}
                                            actions={[`Total price: ${order.totalPrice} EUR`]}
                                        >
                                            <List.Item.Meta
                                                title={`Order #${order.id}`}
                                                description={`Created at ${formatDate(order.creationDateTime)}`}
                                            />
                                            <div className="user-order-detail">
                                            <List
                                                itemLayout="horizontal"
                                                size="small"
                                                dataSource={order.items}
                                                renderItem={item => (
                                                    <List.Item
                                                        key={item.code + item.color + item.size}
                                                        extra={
                                                            <div>
                                                                <div className="product-total">
                                                                    <p className="quantity">{item.quantity} {item.quantity > 1 ? "Nos." : "No."} </p>
                                                                    <p className="amount">{item.quantity * item.price}</p>
                                                                </div>
                                                            </div>}
                                                    >
                                                        <List.Item.Meta
                                                            avatar={<Avatar src={process.env.PUBLIC_URL + item.image.substring(63)}/>}
                                                            title={item.name}
                                                            description={
                                                                <div className="product-info">
                                                                    <Tag color={item.color}> {item.size} </Tag>
                                                                    <p className="product-price">{item.price}</p>
                                                                </div>}
                                                        />
                                                    </List.Item>
                                                )}
                                            />
                                            </div>
                                        </List.Item>
                                    )}
                                />
                            </div>
                        </div>  
                    ): null               
                }
            </div>
        );
    }
}

export default Profile;