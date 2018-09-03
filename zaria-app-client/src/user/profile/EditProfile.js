import React, { Component } from 'react';
import {getUserProfile, editProfile} from '../../util/APIUtils';
import {Avatar, Button, Form, Input, notification, Select} from 'antd';
import { getAvatarColor } from '../../util/Colors';
import { formatDate } from '../../util/Helpers';
import LoadingIndicator  from '../../common/LoadingIndicator';
import './Profile.css';
import '../signup/Signup.css';
import NotFound from '../../common/NotFound';
import ServerError from '../../common/ServerError';
import {
    ADDRESS_MAX_LENGTH,
    ADDRESS_MIN_LENGTH, PASSWORD_MAX_LENGTH,
    PASSWORD_MIN_LENGTH,
    PHONENUM_MAX_LENGTH,
    PHONENUM_MIN_LENGTH
} from "../../constants";

const FormItem = Form.Item;
const Option = Select.Option;

class EditProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: false,
            password: {
                value: ''
            },
            address:  {
                value: ''
            },
            phoneNumber:  {
                value: ''
            }
        };
        this.loadUserProfile = this.loadUserProfile.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
    }

    loadUserProfile(username) {
        this.setState({
            isLoading: true
        });

        getUserProfile(username)
        .then(response => {
            this.setState({
                user: response,
                isLoading: false,
                address: {
                    value: response.address,
                    validateStatus: 'success'
                },
                phoneNumber:  {
                    value: response.phoneNumber,
                    validateStatus: 'success'
                }
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

        const signupRequest = {
            name: this.state.user.name,
            email: this.state.user.email,
            username: this.state.user.username,
            password: this.state.password.value,
            address: this.state.address.value,
            phoneNumber: this.state.phoneNumber.value,
            tin: this.state.user.tin
        };

        const username = signupRequest.username;

        editProfile(username, signupRequest)
            .then(response => {
                notification.success({
                    message: 'Zaria fashion',
                    description: "Successfully changed info!",
                });
                this.props.history.push("/users/" + this.state.user.username);
            }).catch(error => {
            notification.error({
                message: 'Zaria fashion',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });
        });
    }

    isFormInvalid() {
        return !(this.state.password.validateStatus === 'success' &&
            this.state.address.validateStatus === 'success' &&
            this.state.phoneNumber.validateStatus === 'success'
        );
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
            <div>
                {
                    this.state.user ? (
                        <div>
                            <div className="profile">
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
                                </div>
                            </div>
                            <div className="signup-container">
                                <h1 className="page-title">Change info</h1>
                                <div className="signup-content">
                                    <Form onSubmit={this.handleSubmit} className="signup-form">
                                        <FormItem
                                            label="Address"
                                            validateStatus={this.state.address.validateStatus}
                                            help={this.state.address.errorMsg}>
                                            <Input
                                                size="large"
                                                name="address"
                                                autoComplete="off"
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
                                                value={this.state.phoneNumber.value}
                                                onChange={(event) => this.handleInputChange(event, this.validatePhoneNumber)} />
                                        </FormItem>
                                        <FormItem
                                            label="Password"
                                            validateStatus={this.state.password.validateStatus}
                                            help={this.state.password.errorMsg}>
                                            <Input
                                                size="large"
                                                name="password"
                                                type="password"
                                                autoComplete="off"
                                                placeholder="New password between 6 to 20 characters"
                                                value={this.state.password.value}
                                                onChange={(event) => this.handleInputChange(event, this.validatePassword)} />
                                        </FormItem>
                                        <FormItem>
                                            <Button type="primary"
                                                    htmlType="submit"
                                                    size="large"
                                                    className="signup-form-button"
                                                    disabled={this.isFormInvalid()}>Save changes</Button>
                                        </FormItem>
                                    </Form>
                                </div>
                            </div>
                        </div>

                    ): null               
                }
            </div>
        );
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
    };

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
    };

    validatePassword = (password) => {
        if(password.length < PASSWORD_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Password is too short (Minimum ${PASSWORD_MIN_LENGTH} characters needed.)`
            }
        } else if (password.length > PASSWORD_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Password is too long (Maximum ${PASSWORD_MAX_LENGTH} characters allowed.)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            };
        }
    }

}

const WrappedEditForm = Form.create()(EditProfile);

export default WrappedEditForm;