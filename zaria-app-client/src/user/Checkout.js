import React, { Component } from 'react';
import './Checkout.css';

import {Steps, Button, notification, List, Avatar, Tag, Input, Form, Radio} from 'antd';
import {placeOrder} from "../util/APIUtils";

const Step = Steps.Step;
const FormItem = Form.Item;

const steps = [{
    title: 'Review items',
    content: function (props, f) {
        return (
            <div>
                <List
                    itemLayout="horizontal"
                    dataSource={props.cartItems}
                    renderItem={item => (
                        <List.Item
                            key={item.id}
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
                            <div>
                                <div className="product-total">
                                    <p className="quantity">{item.quantity} {item.quantity > 1 ? "Nos." : "No."} </p>
                                    <p className="amount">{item.quantity * item.price}</p>
                                </div>
                            </div>
                        </List.Item>
                    )}
                />
                <div className="action-block">
                    <p className="quantity">Total number of items: {props.totalItems} </p>
                    Total amount: <p className="amount">{props.totalAmount}</p>
                </div>
            </div>
        )
    },
}, {
    title: 'Shipping info',
    content: function (props, f) {
        return (
            <Form>
                <FormItem
                    label="Name">
                    <Input
                        size="large"
                        name="shippingName"
                        autoComplete="off"
                        placeholder="Shipping name"
                        value={props.currentUser.name}
                        onChange={(event) => f(event)}/>
                </FormItem>
                <FormItem
                    label="Address">
                    <Input
                        size="large"
                        name="shippingAddress"
                        autoComplete="off"
                        placeholder="Shipping address"
                        value={props.currentUser.address}
                        onChange={(event) => f(event)}/>
                </FormItem>
                <FormItem
                    label="Phone">
                    <Input
                        size="large"
                        name="shippingPhone"
                        autoComplete="off"
                        placeholder="Phone for shipping"
                        value={props.currentUser.phone}
                        onChange={(event) => f(event)}/>
                </FormItem>
            </Form>
        )
    },
}, {
    title: 'Done',
    content: function (props, f) {
        return (
            props.isLegal ? <Radio>Payment through the account</Radio> : <Radio>Cash on delivery</Radio>
        )
    },
}];

class Checkout extends Component{
    constructor(props){
        super(props);
        this.state = {
            current: 0,
            shippingAddress: props.currentUser.address,
            shippingName: props.currentUser.name,
            shippingPhone: props.currentUser.phone
        };
    }

    saveFormItems = (event) => {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;
        this.setState({
            [inputName]: inputValue
        })
    };

    next() {
        const current = this.state.current + 1;
        this.setState({ current });
    }

    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }

    save = () => {
        const orderInfo = {
            username: this.props.currentUser.username,
            items: this.props.cartItems
        };
        placeOrder(orderInfo)
            .then(response => {
                notification.success({
                    message: 'Zaria fashion',
                    description: "Order sent!"
                });
                this.props.clearCart();
                this.props.history.push("/");
            }).catch(error => {
            notification.error({
                message: 'Zaria fashion',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });
        });
    };

    render() {
        const { current } = this.state;
        return (
            <div>
                <Steps current={current}>
                    {steps.map(item => <Step key={item.title} title={item.title} />)}
                </Steps>
                <div className="steps-content">{steps[current].content(this.props, this.saveFormItems)}</div>
                <div className="steps-action">
                    {
                        current < steps.length - 1
                        && <Button type="primary" onClick={() => this.next()}>Next</Button>
                    }
                    {
                        current === steps.length - 1
                        && <Button type="primary" onClick={() => this.save()}>Done</Button>
                    }
                    {
                        current > 0
                        && (
                            <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                                Previous
                            </Button>
                        )
                    }
                </div>
            </div>
        );
    }
}

export default Checkout;