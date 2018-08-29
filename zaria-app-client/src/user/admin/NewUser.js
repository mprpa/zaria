import React, { Component } from 'react';
import { addNewUser } from '../../util/APIUtils';
import '../signup/Signup.css';
import { Link } from 'react-router-dom';
import {
    NAME_MIN_LENGTH, NAME_MAX_LENGTH,
    ADDRESS_MIN_LENGTH, ADDRESS_MAX_LENGTH,
    PHONENUM_MIN_LENGTH, PHONENUM_MAX_LENGTH,
    TIN_MIN_LENGTH, TIN_MAX_LENGTH
} from '../../constants';

import { Form, Input, Select, Button, notification } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

class NewUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: {
                value: ''
            },
            address: {
                value: ''
            },
            phoneNumber: {
                value: ''
            },
            tin : {
                value: ''
            }
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
    }

    handleInputChange(event, validationFun) {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        this.setState({
            [inputName] : {
                value: inputValue,
                ...validationFun(inputValue)
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        const newUserRequest = {
            name: this.state.name.value,
            address: this.state.address.value,
            phoneNumber: this.state.phoneNumber.value,
            tin: this.state.tin.value
        };

        addNewUser(newUserRequest)
            .then(response => {
                notification.success({
                    message: 'Zaria fashion',
                    description: "User successfully added!",
                });
                this.props.history.push("/");
            }).catch(error => {
            notification.error({
                message: 'Zaria fashion',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });
        });
    }

    isFormInvalid() {
        return !(this.state.name.validateStatus === 'success' &&
            this.state.address.validateStatus === 'success' &&
            this.state.phoneNumber.validateStatus === 'success'
        );
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '381',
        })(
            <Select style={{ width: 80 }}>
                <Option value="381">+381</Option>
                <Option value="382">+382</Option>
                <Option value="383">+383</Option>
                <Option value="385">+385</Option>
                <Option value="386">+386</Option>
                <Option value="387">+387</Option>
                <Option value="389">+389</Option>
            </Select>
        );

        return (
            <div className="signup-container">
                <h1 className="page-title">Create user</h1>
                <div className="signup-content">
                    <Form onSubmit={this.handleSubmit} className="signup-form">
                        <FormItem
                            label="Company Name"
                            validateStatus={this.state.name.validateStatus}
                            help={this.state.name.errorMsg}>
                            <Input
                                size="large"
                                name="name"
                                autoComplete="off"
                                placeholder="Company's full name"
                                value={this.state.name.value}
                                onChange={(event) => this.handleInputChange(event, this.validateName)} />
                        </FormItem>
                        <FormItem
                            label="Address"
                            validateStatus={this.state.address.validateStatus}
                            help={this.state.address.errorMsg}>
                            <Input
                                size="large"
                                name="address"
                                autoComplete="off"
                                placeholder="Company's registered address"
                                value={this.state.address.value}
                                onChange={(event) => this.handleInputChange(event, this.validateAddress)} />
                        </FormItem>
                        <FormItem
                            label="Phone number"
                            validateStatus={this.state.phoneNumber.validateStatus}
                            help={this.state.phoneNumber.errorMsg}>
                            <Input
                                addonBefore={prefixSelector}
                                size="large"
                                name="phoneNumber"
                                autoComplete="off"
                                placeholder="Company's phone number"
                                value={this.state.phoneNumber.value}
                                onChange={(event) => this.handleInputChange(event, this.validatePhoneNumber)} />
                        </FormItem>
                        <FormItem
                            label="Taxpayer Identification Number"
                            validateStatus={this.state.tin.validateStatus}
                            help={this.state.tin.errorMsg}>
                            <Input
                                size="large"
                                name="tin"
                                autoComplete="off"
                                placeholder="Taxpayer Identification Number"
                                value={this.state.tin.value}
                                onChange={(event) => this.handleInputChange(event, this.validateTin)} />
                        </FormItem>
                        <FormItem>
                            <Button type="primary"
                                    htmlType="submit"
                                    size="large"
                                    className="signup-form-button"
                                    disabled={this.isFormInvalid()}>Create</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }

    // Validation Functions

    validateName = (name) => {
        if(name.length < NAME_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Name is too short (Minimum ${NAME_MIN_LENGTH} characters needed.)`
            }
        } else if (name.length > NAME_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Name is too long (Maximum ${NAME_MAX_LENGTH} characters allowed.)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            };
        }
    }

    validateAddress= (address) => {
        if(address.length < ADDRESS_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Address is too short (Minimum ${ADDRESS_MIN_LENGTH} characters needed.)`
            }
        } else if (address.length > ADDRESS_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Address is too long (Maximum ${ADDRESS_MAX_LENGTH} characters allowed.)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            };
        }
    }

    validatePhoneNumber = (phoneNumber) => {
        if(phoneNumber.length < PHONENUM_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Phone number is too short (Minimum ${PHONENUM_MIN_LENGTH} characters needed.)`
            }
        } else if (phoneNumber.length > PHONENUM_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Phone number is too long (Maximum ${PHONENUM_MAX_LENGTH} characters allowed.)`
            }
        } else {
            const PHONENUM_REGEX = RegExp('[0-9]+$');
            if(!PHONENUM_REGEX.test(phoneNumber)) {
                return {
                    validateStatus: 'error',
                    errorMsg: 'Phone number not valid'
                }
            }
            return {
                validateStatus: 'success',
                errorMsg: null,
            };
        }
    }

    validateTin = (tin) => {
        if(tin.length < TIN_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Tax identification number is too short (Minimum ${TIN_MIN_LENGTH} characters needed.)`
            }
        } else if (tin.length > TIN_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Tax identification number is too long (Maximum ${TIN_MAX_LENGTH} characters allowed.)`
            }
        } else {
            const TIN_REGEX = RegExp('[0-9]{9}$');
            if(!TIN_REGEX.test(tin)) {
                return {
                    validateStatus: 'error',
                    errorMsg: 'Tax identification number not valid'
                }
            }
            return {
                validateStatus: 'success',
                errorMsg: null,
            };
        }
    }

}

const WrappedNewUserForm = Form.create()(NewUser);

export default WrappedNewUserForm;