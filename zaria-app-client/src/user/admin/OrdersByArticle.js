import React, { Component } from 'react';
import {Avatar, notification, Tag, List, Collapse, Icon, Checkbox} from "antd";
import {deliverItem} from "../../util/APIUtils";

const Panel = Collapse.Panel;

class OrderItemsForArticle extends Component{
    constructor(props){
        super(props);
        this.state = {
            orderItems: props.orderItems
        }
    }

    onChange = (itemId) => {
        deliverItem(itemId)
            .then(response => {
                let updatedItems = this.state.orderItems.filter((el) => {
                    if (el.id === itemId) {
                        el.delivered = true;
                    }
                    return el;
                });
                this.setState({
                    orderItems: updatedItems
                });
                notification.success({
                    message: 'Zaria fashion',
                    description: 'Item delivered!'
                });
            }).catch(error => {
            notification.error({
                message: 'Zaria fashion',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });
        });

    };

    render () {
        let totalItems = 0;
        this.state.orderItems.forEach(function(item) {
            totalItems += item.quantity;
        });

        return (
            <div>
                <List
                    footer={<div>Total orders: {totalItems}</div>}
                    itemLayout="horizontal"
                    size="small"
                    dataSource={this.state.orderItems}
                    renderItem={item => (
                        <List.Item
                            key={item.id}
                            actions={[
                                <div>
                                    Delivered {item.delivered ? <Icon type="check"/> :
                                                                <Checkbox onChange={() => this.onChange(item.id)} />}
                                </div>
                            ]}
                        >
                            <List.Item.Meta
                                title={item.user + "(" + item.tin + ")"}
                            />
                            <div>{item.quantity} {item.quantity > 1 ? "Nos." : "No."}</div>
                        </List.Item>
                    )}
                />
            </div>
        );
    }
}

const divStyle = {
    float: "right",
    margin: "0 20px 0 0",
    color: "white"
};

class OrdersByArticle extends Component{
    constructor(props){
        super(props);
    }

    render () {
        let panels = [];
        let i = 1;
        this.props.orders.forEach((orderByArticle) => {
            let totalOrders = 0;
            let values = [];
            let colors = [...new Set(orderByArticle.pastOrderItems.map(item => item.color))];
            colors.forEach(function(color) {
                let totalOrders1 = 0;
                let children = [];
                let sizes = orderByArticle.pastOrderItems.filter(x => x.color === color);
                sizes = [...new Set(sizes.map(item => item.size))];
                sizes.forEach(function (size) {
                    let orderItems = orderByArticle.pastOrderItems.filter(x => x.color === color && x.size === size);
                    orderItems.forEach(function(item) {
                        totalOrders1 += item.quantity;
                    });
                    let panel = (
                        <Panel header={size} key={i + color + size}>
                            <OrderItemsForArticle orderItems={orderItems} />
                        </Panel>
                    );
                    children.push(panel);
                });
                let panel = (
                    <Panel header={<div>
                                        <Tag color={color}></Tag>
                                        <div style={divStyle}> Total orders: {totalOrders1}</div>
                                    </div>}
                           style={{background: color}}
                           key={i + color}>
                        <Collapse accordion>
                            {children}
                        </Collapse>
                    </Panel>
                );
                totalOrders += totalOrders1;
                values.push(panel);
            });

            let header = (<div>
                <Avatar src={process.env.PUBLIC_URL + orderByArticle.articleInfo.imagePath.substring(63)}/>
                {orderByArticle.articleInfo.name} ( {orderByArticle.articleInfo.code} , {orderByArticle.articleInfo.fabric} )
                <div style={divStyle}> Total orders: {totalOrders}</div>
            </div>);

            let panel = (
                <Panel header={header} key={i}>
                    <Collapse accordion>
                        {values}
                    </Collapse>
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

export default OrdersByArticle;