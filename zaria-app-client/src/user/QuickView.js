import React, {Component} from 'react';
import './ProductList.css';
import {Modal, InputNumber, Select, Tag} from "antd";

const Option = Select.Option;

class QuickView extends Component{
    constructor(props){
        super(props);
        this.state = {
            selectedProduct: {},
            value: 1,
            size: "s",
            color: this.props.item != null ? this.props.item.colors[0] : ""
        };
    }

    onChange = (value) => {
        this.setState ({
            value: value
        });
    }

    handleSizeChange = (value) => {
        this.setState ({
            size: value
        });
    }

    handleColorChange = (value) => {
        this.setState ({
            color: value
        });
    }

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
            this.props.onAddToCart(this.state.selectedProduct);
            this.props.onCancel();
        })
    }

    render() {
        const { visible, onCancel, item } = this.props;

        let colors = [];
        for (let i = 0; item != null && i < item.colors.length; i++) {
            colors.push(<Option key={item.colors[i]} value={item.colors[i]}>
                            <Tag color={item.colors[i]}>{item.colors[i]}</Tag>
                        </Option>);
        }

        let options;
        if(this.props.isLegal) {
            options = <div>
                <Select defaultValue="s" className="selections" onChange={this.handleSizeChange}>
                    <Option value="s">S</Option>
                    <Option value="m">M</Option>
                    <Option value="l">L</Option>
                    <Option value="xl">XL</Option>
                    <Option value="xxl">XXL</Option>
                </Select>
                <Select defaultValue={this.state.color} style={{ width: 120 }} onChange={this.handleColorChange}>
                    {colors}
                </Select>
                <InputNumber min={1} max={10} defaultValue={1} onChange={this.onChange} />
            </div>
        } else {
            options = <div>
                <Select defaultValue="s" className="selections" onChange={this.handleSizeChange}>
                    <Option value="s">S</Option>
                    <Option value="m">M</Option>
                    <Option value="l">L</Option>
                    <Option value="xl">XL</Option>
                    <Option value="xxl">XXL</Option>
                </Select>
                <Select defaultValue={this.state.color} className="selections" onChange={this.handleColorChange}>
                    {colors}
                </Select>
                <InputNumber min={1} max={10} defaultValue={1} onChange={this.onChange} />
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