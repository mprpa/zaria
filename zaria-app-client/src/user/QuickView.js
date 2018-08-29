import React, {Component} from 'react';
import './ProductList.css';
import {Modal, InputNumber, Tag, Cascader} from "antd";

class QuickView extends Component{
    constructor(props){
        super(props);
        this.state = {
            selectedProduct: {},
            value: 1,
            size: "",
            color: ""
        };
    }

    onChange = (value) => {
        this.setState ({
            value: value
        });
    }

    onChangeChoice = (value) => {
        this.setState ({
            size: value[0],
            color: value[1],
        });
    }

    displayRender = (labels, selectedOptions) => labels.map((label, i) => {
        const option = selectedOptions[i];
        return <span key={option.value}>{label} / </span>;
    });

    addToCart = () =>{
        this.setState({
            selectedProduct: {
                image: this.props.item.imagePath,
                name: this.props.item.name,
                code: this.props.item.code,
                color: this.state.color,
                size: this.state.size,
                price: this.props.isLegal ? this.props.item.wholesalePrice : this.props.item.retailPrice,
                id: this.props.item.code + this.state.size + this.state.color,
                quantity: this.state.value
            }
        }, function(){
            this.setState({
                value: 1,
                size: "",
                color: "",
            });
            this.props.onAddToCart(this.state.selectedProduct);
            this.props.onCancel();
        })
    }

    render() {
        const { visible, onCancel, item } = this.props;

        let available = true;
        let options;

        if(item == null || (!this.props.isLegal && item.availabilities == null)) {
            options = <div>Sorry, not available right now </div>
            available = false;
        } else {
            let values = [];
            if(this.props.isLegal) {
                values = [{
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
                let colors = [];
                for (let i = 0; item != null && i < item.colors.length; i++) {
                    let color = {
                        value: item.colors[i],
                        label: <Tag color={item.colors[i]}>{item.colors[i]}</Tag>
                    };
                    colors.push(color);
                }
                values.forEach(function(value) {
                    value.children.push(colors)
                });
            } else {
                let sizes = [...new Set(item.availabilities.map(item => item.size))];
                sizes.forEach(function(size) {
                    let value = {
                        value: size,
                        label: size,
                        children: [],
                    };
                    let colors = item.availabilities.filter(x => x.size === size);
                    colors = [...new Set(colors.map(item => item.color))];
                    colors.forEach(function (color) {
                        let colorChild = {
                            value: color,
                            label: <Tag color={color}>color</Tag>
                        };
                        value.children.push(colorChild);
                    });
                    values.push(value);
                });
            }
            options = <div>
                <Cascader options={values} onChange={this.onChangeChoice} displayRender={this.displayRender} placeholder="Please select" />
                <InputNumber min={1} max={50} defaultValue={1} onChange={this.onChange} />
            </div>
        }

        return (
            item != null ?
                <Modal
                    visible={visible}
                    title={item.name}
                    okText="Add to cart"
                    onCancel={onCancel}
                    onOk={this.addToCart}
                    okButtonProps={{ disabled: !available }}
                >
                    <div className="product">
                        <div className="product-image">
                            <img src={process.env.PUBLIC_URL + item.imagePath.substring(63)}
                                 alt={item.name}/>
                        </div>
                        <h4 className="product-name">{item.name}</h4>
                        <p className="product-price">{this.props.isLegal ? item.wholesalePrice : item.retailPrice}</p>
                        {options}
                    </div>
                </Modal>
                : null
        );
    }
}

export default QuickView;