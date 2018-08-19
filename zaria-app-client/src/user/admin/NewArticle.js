import React, { Component } from 'react';
import "./NewArticle.css";

import {Input, Form, Select, Button, Switch, Icon} from "antd";
import {checkArticleCodeAvailability, uploadArticleImage} from "../../util/APIUtils";
import ColorPaletteComponent from './ColorPaletteComponent';
import {uniqueId} from 'lodash';
import {colorsList} from "../../constants";

const FormItem = Form.Item;
const Option = Select.Option;

class NewArticle extends Component {
    constructor(props) {
        super(props);
        let colors = [];
        colorsList.forEach(function (color) {
            colors.push({
                id: uniqueId('color'),
                code: color,
                name: color,
                selected: false,
                hovered: false
            });
        });
        this.state = {
            code: {
                value: ''
            },
            name: {
                value: ''
            },
            gender: {
                value: ''
            },
            forChildren: {
                value: false
            },
            retailPrice: {
                value: ''
            },
            wholesalePrice: {
                value: ''
            },
            currencyRP: {
                value: 'eur'
            },
            currencyWP: {
                value: 'eur'
            },
            weight: {
                value: ''
            },
            weightType: {
                value: 'kg'
            },
            fabric: {
                value: ''
            },
            colors: colors,
            image: null,
            selectedFile: null
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSwitchChange = this.handleSwitchChange.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateCodeAvailability = this.validateCodeAvailability.bind(this);
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

    handleSwitchChange(value) {
        this.setState({
            forChildren : {
                value: value
            }
        })
    }

    handleSelectChange = (value) => {
        this.setState({
            gender : {
                value: value,
                validateStatus: 'success'
            }
        })
    }

    getColorById(colorId) {
        var arr = this.state.colors.find(color => color.id === colorId);
        return arr;
    }

    getSelectedColors() {
        return this.state.colors.filter(color => color.selected);
    }

    handleColorClick(colorId) {
        let color = this.getColorById(colorId);
        let selected = !color.selected;
        color.selected = selected;
        this.forceUpdate();
    }

    handleMouseEnterColor(colorId) {
        let color = this.getColorById(colorId);
        color.hovered = true;
        this.forceUpdate();
    }

    handleMouseLeaveColor(colorId) {
        let color = this.getColorById(colorId);
        color.hovered = false;
        this.forceUpdate();
    }


    handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append('file', this.state.selectedFile, this.state.selectedFile.name);

        uploadArticleImage(formData);

        // const signupRequest = {
        //     name: this.state.name.value,
        //     email: this.state.email.value,
        //     username: this.state.username.value,
        //     password: this.state.password.value,
        //     address: this.state.address.value,
        //     phoneNumber: this.state.phoneNumber.value
        // };
        //
        // signup(signupRequest)
        //     .then(response => {
        //         notification.success({
        //             message: 'Zaria fashion',
        //             description: "Thank you! You're successfully registered. Please Login to continue!",
        //         });
        //         this.props.history.push("/login");
        //     }).catch(error => {
        //     notification.error({
        //         message: 'Zaria fashion',
        //         description: error.message || 'Sorry! Something went wrong. Please try again!'
        //     });
        // });
    }

    isFormInvalid() {
        var colorsSuccess = this.getSelectedColors().length > 0;
        return !(this.state.code.validateStatus === 'success' &&
            this.state.name.validateStatus === 'success' &&
            this.state.gender.validateStatus === 'success' &&
            this.state.retailPrice.validateStatus === 'success' &&
            this.state.wholesalePrice.validateStatus === 'success' &&
            this.state.weight.validateStatus === 'success' &&
            this.state.fabric.validateStatus === 'success' &&
            colorsSuccess &&
            this.state.selectedFile !== null
        );
    }

    handleImageChange = (event) => {
        this.setState({
            image: URL.createObjectURL(event.target.files[0])
        })
        this.setState({
            selectedFile: event.target.files[0]
        })
    }

    render() {

        return (
            <div className="new-article-container">
                <h1 className="page-title">Create Article</h1>
                <div className="new-article-content">
                    <Form onSubmit={this.handleSubmit} className="create-article-form">
                        <FormItem
                            className="article-form-row"
                            label="Code"
                            validateStatus={this.state.code.validateStatus}
                            help={this.state.code.errorMsg}>
                            <Input
                                size="large"
                                name="code"
                                autoComplete="off"
                                placeholder="Code"
                                value={this.state.code.value}
                                onChange={(event) => this.handleInputChange(event, this.validateCode)} />
                        </FormItem>
                        <FormItem
                            className="article-form-row"
                            label="Name"
                            validateStatus={this.state.name.validateStatus}
                            help={this.state.name.errorMsg}>
                            <Input
                                size="large"
                                name="name"
                                autoComplete="off"
                                placeholder="Name"
                                value={this.state.name.value}
                                onChange={(event) => this.handleInputChange(event, this.validateName)} />
                        </FormItem>
                        <FormItem
                            className="article-form-row"
                            label="Gender"
                            validateStatus={this.state.gender.validateStatus}
                            help={this.state.gender.errorMsg}>
                            <Select
                                name="gender"
                                placeholder="Select gender"
                                onChange={this.handleSelectChange}>
                                <Option value="male">Male</Option>
                                <Option value="female">Female</Option>
                            </Select>
                        </FormItem>
                        <FormItem
                            className="article-form-row"
                            label="Children">
                            <Switch
                                value={this.state.forChildren.value}
                                onChange={this.handleSwitchChange} />
                        </FormItem>
                        <FormItem
                            className="article-form-row"
                            label="Retail price">
                            <Input
                                type="number"
                                step="0.01"
                                size="large"
                                name="retailPrice"
                                value={this.state.retailPrice.value}
                                onChange={(event) => this.handleInputChange(event, this.validateRetailPrice)}
                                style={{ width: '65%', marginRight: '3%' }} />
                            <Select
                                value={this.state.currencyRP.value}
                                size="large"
                                style={{ width: '32%' }} >
                                <Option value="eur">EUR</Option>
                            </Select>
                        </FormItem>
                        <FormItem
                            className="article-form-row"
                            label="Wholesale price">
                            <Input
                                type="number"
                                step="0.01"
                                size="large"
                                name="wholesalePrice"
                                value={this.state.wholesalePrice.value}
                                onChange={(event) => this.handleInputChange(event, this.validateWholesalePrice)}
                                style={{ width: '65%', marginRight: '3%' }} />
                            <Select
                                value={this.state.currencyWP.value}
                                size="large"
                                style={{ width: '32%' }} >
                                <Option value="eur">EUR</Option>
                            </Select>
                        </FormItem>
                        <FormItem
                            className="article-form-row"
                            label="Weight">
                            <Input
                                type="number"
                                step="0.01"
                                size="large"
                                name="weight"
                                value={this.state.weight.value}
                                onChange={(event) => this.handleInputChange(event, this.validateWeight)}
                                style={{ width: '65%', marginRight: '3%' }} />
                            <Select
                                value={this.state.weightType.value}
                                size="large"
                                style={{ width: '32%' }} >
                                <Option value="kg">KG</Option>
                            </Select>
                        </FormItem>
                        <FormItem
                            className="article-form-row"
                            label="Fabric composition"
                            validateStatus={this.state.fabric.validateStatus}
                            help={this.state.fabric.errorMsg}>
                            <Input
                                size="large"
                                name="fabric"
                                autoComplete="off"
                                placeholder="Fabric composition"
                                value={this.state.fabric.value}
                                onChange={(event) => this.handleInputChange(event, this.validateFabric)} />
                        </FormItem>
                        <FormItem
                            className="article-form-row"
                            label="Fabric colors">
                            <ColorPaletteComponent
                                colors={this.state.colors}
                                onColorClick={this.handleColorClick.bind(this)}
                            />
                        </FormItem>
                        <FormItem
                            className="article-form-row"
                            label="Image">
                            <label htmlFor="file-upload" className="ant-btn">
                                <Icon type="upload"/> Upload Image
                            </label>
                            <input type="file" id="file-upload" style={{display: "none"}} onChange={this.handleImageChange}/>
                            {this.state.image ? <img src={this.state.image} className="article-image"/> : null}
                        </FormItem>
                        <FormItem className="article-form-row">
                            <Button type="primary"
                                    htmlType="submit"
                                    size="large"
                                    disabled={this.isFormInvalid()}
                                    className="create-article-form-button">Create Article</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }

    validateCode = (code) => {
        if(!code) {
            return {
                validateStatus: 'error',
                errorMsg: 'Code may not be empty'
            }
        }

        return {
            validateStatus: 'success',
            errorMsg: null
        }
    }

    validateCodeAvailability() {
        const codeValue = this.state.code.value;
        const codeValidation = this.validateCode(codeValue);

        if(codeValidation.validateStatus === 'error') {
            this.setState({
                code: {
                    value: codeValue,
                    ...codeValidation
                }
            });
            return;
        }

        this.setState({
            code: {
                value: codeValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        checkArticleCodeAvailability(codeValue)
            .then(response => {
                if(response.available) {
                    this.setState({
                        code: {
                            value: codeValue,
                            validateStatus: 'success',
                            errorMsg: null
                        }
                    });
                } else {
                    this.setState({
                        username: {
                            value: codeValue,
                            validateStatus: 'error',
                            errorMsg: 'This code is already taken'
                        }
                    });
                }
            }).catch(error => {
                this.setState({
                    username: {
                        value: codeValue,
                        validateStatus: 'success',
                        errorMsg: null
                    }
                });
        });
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

    validateRetailPrice = (retailPrice) => {
        if(!retailPrice) {
            return {
                validateStatus: 'error',
                errorMsg: 'Retail price may not be empty'
            }
        }

        return {
            validateStatus: 'success',
            errorMsg: null
        }
    }

    validateWholesalePrice = (wholesalePrice) => {
        if(!wholesalePrice) {
            return {
                validateStatus: 'error',
                errorMsg: 'Wholesale price may not be empty'
            }
        }

        return {
            validateStatus: 'success',
            errorMsg: null
        }
    }

    validateWeight = (weight) => {
        if(!weight) {
            return {
                validateStatus: 'error',
                errorMsg: 'Weight may not be empty'
            }
        }

        return {
            validateStatus: 'success',
            errorMsg: null
        }
    }

    validateFabric = (fabric) => {
        if(!fabric) {
            return {
                validateStatus: 'error',
                errorMsg: 'Fabric may not be empty'
            }
        }

        return {
            validateStatus: 'success',
            errorMsg: null
        }
    }
}


export default NewArticle;