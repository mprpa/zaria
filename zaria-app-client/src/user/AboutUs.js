import React, { Component } from 'react';

import './AboutUs.css';
import image from '../resources/3.png';
import {Form, Row, Col, Card, Icon, Input, Button, notification} from 'antd';
import {sendMessage, getUserProfile} from "../util/APIUtils";
import {EMAIL_MAX_LENGTH} from "../constants";
const FormItem = Form.Item;
const { TextArea } = Input;

class AboutUs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: {
                value: ''
            },
            email:  {
                value: ''
            },
            message:  {
                value: ''
            }
        }
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
                    name: {
                        value: response.name,
                        validateStatus: 'success'
                    },
                    email:  {
                        value: response.email,
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

    componentDidMount() {
        if(this.props.currentUser != null) {
            const username = this.props.currentUser.username;
            this.loadUserProfile(username);
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.currentUser != null) {
            if(this.props.currentUser == null || this.props.currentUser.username !== nextProps.currentUser.username) {
                this.loadUserProfile(nextProps.currentUser.username);
            }
        }

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

        const messageRequest = {
            name: this.state.name.value,
            email: this.state.email.value,
            message: this.state.message.value
        };

        sendMessage(messageRequest)
            .then(response => {
                notification.success({
                    message: 'Zaria fashion',
                    description: "Message sent!",
                });
            }).catch(error => {
            notification.error({
                message: 'Zaria fashion',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });
        });
    }

    isFormInvalid() {
        return !(this.state.email.validateStatus === 'success' &&
            this.state.name.validateStatus === 'success' &&
            this.state.message.validateStatus === 'success'
        );
    }

    validateEmail = (email) => {
        if(!email) {
            return {
                validateStatus: 'error',
                errorMsg: 'Email may not be empty'
            }
        }

        const EMAIL_REGEX = RegExp('[^@ ]+@[^@ ]+\\.[^@ ]+');
        if(!EMAIL_REGEX.test(email)) {
            return {
                validateStatus: 'error',
                errorMsg: 'Email not valid'
            }
        }

        if(email.length > EMAIL_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Email is too long (Maximum ${EMAIL_MAX_LENGTH} characters allowed)`
            }
        }

        return {
            validateStatus: 'success',
            errorMsg: null
        }
    }

    validateName = (name) => {
        if(!name) {
            return {
                validateStatus: 'error',
                errorMsg: 'Name may not be empty'
            }
        }

        return {
            validateStatus: 'success',
            errorMsg: null
        }
    }

    validateMessage = (message) => {
        if(!message) {
            return {
                validateStatus: 'error',
                errorMsg: 'Name may not be empty'
            }
        }

        return {
            validateStatus: 'success',
            errorMsg: null
        }
    }

    render() {
        return (
            <div>
                <div>
                    <Row>
                        <Col span={8}>
                            <img className="aboutus_image" src={image} alt=""/>
                        </Col>
                        <Col span={16}>
                            <h1 className="page-title">About Us</h1>

                            <Card style={{width: 600}}>
                                <p>Zaria fashion house D.O.O. from Pozega produces knitted garments. This is a family
                                    company 100% privately owned. We have modern computerized knitting machines from
                                    German brand STOLL, and for the production of our products, we use the highest
                                    quality imported and domestic materials.</p>
                                <p> Production program :</p>
                                <ul>
                                    <li>
                                        Women's knitwear (jackets, blouses, tunics, sets)
                                    </li>
                                    <li>
                                        Men's knitwear (sweaters, sweatshirts)
                                    </li>
                                    <li>
                                        Children's knitwear (sweatshirts, dresses, jeans, shirts, jackets)
                                    </li>
                                </ul>
                                <p> A new collection of our products is made twice a year.</p>
                                <p>In accordance with the requirements of the market of knitwear, Zaria keeps up with
                                    the modern way of production and sales and has the plan for further procurement of
                                    modern equipment, training of employees and diversified sales network in the
                                    country and abroad.</p>
                            </Card>

                            <h2 className="page-title">Contact</h2>

                            <Card style={{width: 600}}>
                                <Icon type="mail"/> trikotazazaria@gmail.com <br/>
                                <Icon type="phone"/> +381 31 812 381<br/>
                                <Icon type="printer"/> +381 31 812 381<br/>
                                <Icon type="environment-o"/>
                                Kralja MIlutina BB
                                31210, Požega
                                Srbija
                                <p>We are located in Pozega, the city of western Serbia,
                                    on the main road between Cacak and Uzice.</p>
                            </Card>

                            <h2 className="page-title">Contact Us</h2>

                            <Card style={{width: 600}}>
                                <Form onSubmit={this.handleSubmit} className="contact-form">
                                    <FormItem
                                        label="Name">
                                        <Input
                                            size="large"
                                            name="name"
                                            autoComplete="off"
                                            placeholder="Your name"
                                            value={this.state.name.value}
                                            onChange={(event) => this.handleInputChange(event, this.validateName)}/>
                                    </FormItem>
                                    <FormItem
                                        label="Email"
                                        hasFeedback
                                        validateStatus={this.state.email.validateStatus}
                                        help={this.state.email.errorMsg}>
                                        <Input
                                            size="large"
                                            name="email"
                                            type="email"
                                            autoComplete="off"
                                            placeholder="Your email"
                                            value={this.state.email.value}
                                            onBlur={this.validateEmailAvailability}
                                            onChange={(event) => this.handleInputChange(event, this.validateEmail)} />
                                    </FormItem>
                                    <FormItem
                                        label="Message">
                                        <TextArea rows={5}
                                                  name="message"
                                                  autoComplete="off"
                                                  value={this.state.message.value}
                                                  onChange={(event) => this.handleInputChange(event, this.validateMessage)} />
                                    </FormItem>
                                    <FormItem>
                                        <Button type="primary"
                                                htmlType="submit"
                                                size="large"
                                                className="contact-form-button"
                                                disabled={this.isFormInvalid()}>Send message</Button>
                                    </FormItem>
                                </Form>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}


export default AboutUs;