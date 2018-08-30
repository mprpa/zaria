import React, { Component } from 'react';
import {Avatar, List, notification, Tag} from "antd";
import {formatDate} from "../../util/Helpers";
import {sendArticlesFromState} from "../../util/APIUtils";

class OrdersFromState extends Component{
    constructor(props){
        super(props);
        this.state = {
            orders: props.orders
        }
    }

    sendArticles = (order) => {
        sendArticlesFromState(order)
            .then(response => {
                let filteredOrders = this.state.orders.filter((el) => {
                    return el.id !== order;
                });
                this.setState({
                    orders: filteredOrders
                });
                notification.success({
                    message: 'Zaria fashion',
                    description: 'Order sent!'
                });
            }).catch(error => {
            notification.error({
                message: 'Zaria fashion',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });
        });
    };

    render () {
        return (
            <div>
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
                    dataSource={this.state.orders}
                    renderItem={order => (
                        <List.Item
                            key={order.id}
                            actions={[`Total price: ${order.totalPrice} EUR`, <a onClick={() => this.sendArticles(order.id)}>Send articles</a>]}
                        >
                            <List.Item.Meta
                                title={`Order #${order.id}`}
                                description={`Created at ${formatDate(order.creationDateTime)} by ${order.user.name} (${order.user.address}, ${order.user.phone})`}
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
        );
    }
}

export default OrdersFromState;