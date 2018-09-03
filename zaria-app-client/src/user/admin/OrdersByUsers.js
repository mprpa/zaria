import React, { Component } from 'react';
import {Avatar, notification, Tag, List, Collapse, Input, Icon} from "antd";
import {updateOrderPaidValue} from "../../util/APIUtils";
import {formatDate} from "../../util/Helpers";

const Search = Input.Search;
const Panel = Collapse.Panel;

class OrdersForUser extends Component{
    constructor(props){
        super(props);
        this.state = {
            orders: props.orders
        }
    }

    updatePaid = (order, value) => {
        if(isNaN(value)) {
            notification.error({
                message: 'Zaria fashion',
                description: 'You must insert a number!'
            });
        } else {
            updateOrderPaidValue(order, value)
                .then(response => {
                    let updatedOrders = this.state.orders.filter((el) => {
                        if(el.id === order) {
                            el.paid = (el.paid != null ? el.paid : 0) + Number(value);
                        }
                        return el;
                    });
                    this.setState({
                        orders: updatedOrders
                    });
                    notification.success({
                        message: 'Zaria fashion',
                        description: 'Order updated!'
                    });
                }).catch(error => {
                notification.error({
                    message: 'Zaria fashion',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });
            });
        }
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
                            actions={[`Total price: ${order.totalPrice} EUR`,
                                `Total paid: ${order.paid != null ? order.paid : 0} EUR`,
                                <Search type="number" enterButton="Add to paid" onSearch={(value) => this.updatePaid(order.id, value)}/>
                            ]}
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
                                                        Delivered {item.delivered ? <Icon type="check" /> : <Icon type="close" />}
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

class OrdersByUsers extends Component{

    render () {
        let panels = [];
        let i = 1;
        this.props.orders.forEach((orderByUser) => {
            let header = orderByUser.userSummary.name + " (" + orderByUser.userSummary.address + ", " + orderByUser.userSummary.phone + ", " + orderByUser.userSummary.tin + ")";
            let panel = (
                <Panel header={header} key={i}>
                    <OrdersForUser orders={orderByUser.pastOrders} />
                </Panel>
            );
            panels.push(panel);
            i++;
        });
        return (
            <Collapse accordion>
                {panels}
            </Collapse>
        );
    }
}

export default OrdersByUsers;