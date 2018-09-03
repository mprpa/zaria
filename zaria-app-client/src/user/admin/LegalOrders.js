import React, { Component } from 'react';
import {Avatar, List, Tag} from "antd";
import {formatDate} from "../../util/Helpers";

class LegalOrders extends Component{

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
                    dataSource={this.props.orders}
                    renderItem={order => (
                        <List.Item
                            key={order.id}
                            actions={[`Total price: ${order.totalPrice} EUR`, `Total paid: ${order.paid} EUR`]}
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
        );
    }
}

export default LegalOrders;