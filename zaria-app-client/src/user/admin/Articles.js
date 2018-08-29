import React, { Component } from 'react';
import '../ProductList.css';
import QuickView from "./QuickView";
import {Layout, List, Card, Input, notification} from 'antd';
import {updateArticleState} from "../../util/APIUtils";
const { Header, Content } = Layout;
const { Search } = Input

class Articles extends Component {

    constructor(props){
        super(props);
        this.state = {
            visible: false,
            selectedItem: null
        };
    }

    showModal = (event, item) => {
        if(this.props.isAuthenticated) {
            this.setState({
                visible: true,
                selectedItem : item
            });
        }
    }

    handleCancel = () => {
        this.setState({
            visible: false,
            selectedItem : null
        });
    }

    handleUpdate = (selectedProduct) => {
        const articleInfo = {
            article: selectedProduct.code,
            size: selectedProduct.size,
            color: selectedProduct.color,
            amount: selectedProduct.quantity,
        }
        updateArticleState(articleInfo)
            .then(response => {
                notification.success({
                    message: 'Zaria fashion',
                    description: "Article state updated!"
                });
            }).catch(error => {
            notification.error({
                message: 'Zaria fashion',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });
        });
    }

    render(){
        let productsData;
        let term = this.props.searchTerm;
        let x;

        function searchingFor(term){
            return function(x){
                return x.name.toLowerCase().includes(term.toLowerCase()) || !term;
            }
        }
        productsData = this.props.productsList.filter(searchingFor(term));

        return(
            <Layout>
                <Header className="content-layout-header">
                    <Search
                        placeholder="Input search text"
                        onSearch={value => console.log(value)}
                        onChange={this.props.handleSearch}
                        enterButton
                    />
                </Header>
                <Content>
                    <List
                        grid={{gutter: 1, xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 3}}
                        pagination={{
                            onChange: (page) => {
                                console.log(page);
                            },
                            pageSize: 6,
                        }}
                        dataSource={productsData}
                        renderItem={item => (
                            <a href="#" onClick={(event) => this.showModal(event, item)}>
                                <List.Item
                                    key={item.code}>
                                    <Card
                                        hoverable
                                        title={item.name}
                                        style={{width: 300}}
                                        cover={<div className="product-image-actions">
                                            <img src={process.env.PUBLIC_URL + item.imagePath.substring(63)}
                                                 alt={item.name}/>
                                        </div>}>
                                    </Card>
                                </List.Item>
                            </a>
                        )}
                    />
                    <QuickView
                        visible={this.state.visible}
                        onCancel={this.handleCancel}
                        onUpdate={this.handleUpdate}
                        item={this.state.selectedItem}
                        isLegal={this.props.isLegal}
                    />
                </Content>
            </Layout>
        )
    }
}

export default Articles;