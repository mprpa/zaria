import React, {Component} from 'react';
import '../ProductList.css';
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
        if (i === labels.length - 1) {
            return (
                <span key={option.value}>
                    {label} (<a>{option.available}</a>)
                </span>
            );
        }
        return <span key={option.value}>{label} / </span>;
    });

    saveArticleState = () =>{
        this.setState({
            selectedProduct: {
                code: this.props.item.code,
                color: this.state.color,
                size: this.state.size,
                quantity: this.state.value
            }
        }, function(){
            this.setState({
                value: 1,
                size: "",
                color: "",
            });
            this.props.onUpdate(this.state.selectedProduct);
            this.props.onCancel();
        })
    }

    render() {
        const {visible, onCancel, item} = this.props;

        let values = [{
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
        values.forEach(function (value) {
            for (let i = 0; item != null && i < item.colors.length; i++) {
                let available = item.availabilities != null ? item.availabilities.find(x => x.size === value.value && x.color === item.colors[i]) : null;
                let color = {
                    value: item.colors[i],
                    label: <Tag color={item.colors[i]}>{item.colors[i]}</Tag>,
                    available: available != null ? available.amount : 0
                };
                value.children.push(color);
            }
        });

        let options = <div>
            <Cascader options={values} onChange={this.onChangeChoice} displayRender={this.displayRender}
                      placeholder="Select size and color"/>
            <InputNumber min={1} max={500} defaultValue={1} onChange={this.onChange}/>
        </div>

        return (
            item != null ?
                <Modal
                    visible={visible}
                    title={item.name}
                    okText="Add available articles"
                    onCancel={onCancel}
                    onOk={this.saveArticleState}
                >
                    <div className="product">
                        <div className="product-image">
                            <img src={process.env.PUBLIC_URL + item.imagePath.substring(63)}
                                 alt={item.name}/>
                        </div>
                        <h4 className="product-name">{item.name}</h4>
                        <p className="product-price">Wholesale price: {item.wholesalePrice}</p>
                        <p className="product-price">Retail price: {item.retailPrice}</p>
                        {options}
                    </div>
                </Modal>
                : null
        );
    }
}

export default QuickView;