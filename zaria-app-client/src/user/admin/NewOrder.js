import React, { Component } from 'react';
import './NewOrder.css'
import {Form, Icon, Button, Select, Tag, InputNumber, Cascader, notification} from 'antd';
import {placeOrder} from "../../util/APIUtils";

const FormItem = Form.Item;
const Option = Select.Option;

let uuid = 0;
class NewOrder extends Component {
    constructor(props){
        super(props);
        this.state = {
            user: "",
            order: []
        };
    }

    onUserChange = (value) => {
        this.setState ({
            user: value
        });
    };

    displayRender = (labels, selectedOptions) => labels.map((label, i) => {
        const option = selectedOptions[i];
        if (i === labels.length - 1) {
            return (
                <span key={option.value}>{label}</span>
            );
        }
        return <span key={option.value}>{label} / </span>;
    });

    remove = (k) => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        if (keys.length === 1) {
            return;
        }

        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    };

    add = () => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(uuid);
        uuid++;
        form.setFieldsValue({
            keys: nextKeys,
        });
    };

    checkProduct = (productID) => {
        let order = this.state.order;
        return order.some(function(item) {
            return item.id === productID;
        });
    };

    sendOrder = (values) => {
        let everythingOk = true;
        if(this.state.user == null || this.state.user === "") {
            everythingOk = false;
        }
        if(values.keys != null && values.keys.length > 0) {
            values.keys.forEach((key) => {
                let orderItem = this.state.order;
                if(values.items[key] == null || values.values[key] == null) {
                    everythingOk = false;
                } else {
                    let productID = values.items[key][0] + values.items[key][1] + values.items[key][2];
                    let productQty = values.values[key];
                    if (this.checkProduct(productID)) {
                        let index = orderItem.findIndex((x => x.id === productID));
                        orderItem[index].quantity = Number(orderItem[index].quantity) + Number(productQty);
                        this.setState({
                            order: orderItem
                        })
                    } else {
                        let selectedProduct = {
                            id: productID,
                            code: values.items[key][0],
                            size: values.items[key][1],
                            color: values.items[key][2],
                            quantity: productQty
                        };
                        orderItem.push(selectedProduct);
                    }
                    this.setState({
                        order: orderItem
                    });
                }
            })
        } else {
            everythingOk = false;
        }
        if(everythingOk) {
            const orderInfo = {
                username: this.state.user,
                items: this.state.order
            };
            placeOrder(orderInfo)
                .then(response => {
                    notification.success({
                        message: 'Zaria fashion',
                        description: "Order sent!"
                    });
                    this.props.history.push("/");
                }).catch(error => {
                notification.error({
                    message: 'Zaria fashion',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });
            });
        } else {
            notification.error({
                message: 'Zaria fashion',
                description: 'Fill or fields or delete them!'
            });
        }
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.sendOrder(values);
                console.log('Received values of form: ', values.keys);
                console.log('Received values of form: ', values.items[0]);
                console.log('Received values of form: ', values.values[0]);
            }
        });
    };

    render() {
        try{
            const { getFieldDecorator, getFieldValue } = this.props.form;

            let options = [];
            this.props.usersList.forEach(function (user) {
                let option = <Option key={user.username} value={user.username}>{user.name}, {user.tin}</Option>;
                options.push(option);
            });
            let values = [];
            this.props.productsList.forEach(function (item) {
                let article = {
                    value: item.code,
                    label: item.name + ' (' + item.code + ')',
                    children: []
                };
                let sizes = [{
                    value: 'S',
                    label: 'S',
                    children: [],
                }, {
                    value: 'M',
                    label: 'M',
                    children: [],
                }, {
                    value: 'L',
                    label: 'L',
                    children: [],
                }, {
                    value: 'XL',
                    label: 'XL',
                    children: [],
                }, {
                    value: 'XXL',
                    label: 'XXL',
                    children: [],
                }];
                sizes.forEach(function (value) {
                    for (let i = 0; item != null && i < item.colors.length; i++) {
                        let color = {
                            value: item.colors[i],
                            label: <Tag color={item.colors[i]}>{item.colors[i]}</Tag>
                        };
                        value.children.push(color);
                    }
                });
                article.children = sizes;
                values.push(article);
            });
            const formItemLayout = {
                labelCol: {
                    xs: { span: 22 },
                    sm: { span: 3 },
                },
                wrapperCol: {
                    xs: { span: 25 },
                    sm: { span: 21 },
                },
            };
            const formItemLayoutWithOutLabel = {
                wrapperCol: {
                    xs: { span: 25, offset: 0 },
                    sm: { span: 21, offset: 3 },
                },
            };
            getFieldDecorator('keys', { initialValue: [] });
            const keys = getFieldValue('keys');
            const formItems = keys.map((k, index) => {
                return (
                    <FormItem
                        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                        label={index === 0 ? 'Items' : ''}
                        required={false}
                        key={k}
                    >
                        {getFieldDecorator(`items[${k}]`, {
                            validateTrigger: ['onChange', 'onBlur']
                        })(
                            <Cascader options={values} displayRender={this.displayRender}
                                      placeholder="Select article" style={{ width: '75%', marginRight: 2 }} />
                        )}
                        {getFieldDecorator(`values[${k}]`, {
                            validateTrigger: ['onChange', 'onBlur']
                        })(
                            <InputNumber min={1} max={500} style={{ width: '15%', marginRight: 4 }} />
                        )}
                        {keys.length > 1 ? (
                            <Icon
                                className="dynamic-delete-button"
                                type="minus-circle-o"
                                disabled={keys.length === 1}
                                onClick={() => this.remove(k)}
                            />
                        ) : null}
                    </FormItem>
                );
            });

            return (
                <div className="form-container">
                    <h1 className="page-title">Add order for user</h1>
                    <div className="form-content">
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem label="Buyer" {...formItemLayout}>
                                <Select onChange={this.onUserChange} placeholder="Select a buyer">
                                    {options}
                                </Select>
                            </FormItem>
                            {formItems}
                            <FormItem>
                                <Button type="dashed" onClick={this.add} style={{ width: '100%' }}>
                                    <Icon type="plus" /> Add item
                                </Button>
                            </FormItem>
                            <FormItem>
                                <Button className="form-form-button" type="primary" htmlType="submit">Submit</Button>
                            </FormItem>
                        </Form>
                    </div>
                </div>
            );
        } catch(exception) {
            console.log('exception: ', exception);
        }
    }
}

const WrappedNewOrderForm = Form.create()(NewOrder);
export default WrappedNewOrderForm;