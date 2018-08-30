import React, { Component } from 'react';
import LoadingIndicator from "../../common/LoadingIndicator";
import {Tabs, notification} from "antd";
import ServerError from "../../common/ServerError";
import {getAllOrders} from "../../util/APIUtils";
import LegalOrders from "./LegalOrders";
import OrdersFromState from "./OrdersFromState";
import OrdersByUsers from "./OrdersByUsers";
import OrdersByArticle from "./OrdersByArticle";

const TabPane = Tabs.TabPane;

class AdminIndex extends Component{
    constructor(props){
        super(props);
        this.state = {
            orders: null,
            isLoading: false
        }
    }

    loadAllOrders = () => {
        this.setState({
            isLoading: true
        });

        getAllOrders()
            .then(response => {
                this.setState({
                    orders: response,
                    isLoading: false
                });
            }).catch(error => {
            this.setState({
                serverError: true,
                isLoading: false
            });
            notification.error({
                message: 'Zaria fashion',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });
        });
    };

    componentDidMount() {
        this.loadAllOrders();
    }

    render () {
        if(this.state.isLoading) {
            return <LoadingIndicator />;
        }

        if(this.state.serverError) {
            return <ServerError />;
        }

        const tabBarStyle = {
            textAlign: 'center'
        };

        return (
            <div className="admin-index">
                {this.state.orders ? (
                    <Tabs defaultActiveKey="1"
                          animated={false}
                          tabBarStyle={tabBarStyle}
                          size="large"
                          className="profile-tabs">
                        <TabPane tab={`Orders from legal users`} key="1">
                            <LegalOrders orders={this.state.orders.legalUserOrders}/>
                        </TabPane>
                        <TabPane tab={`Orders for available articles`} key="2">
                            <OrdersFromState orders={this.state.orders.orderFromState}/>
                        </TabPane>
                        <TabPane tab={`Orders by users`} key="3">
                            <OrdersByUsers orders={this.state.orders.ordersByUser}/>
                        </TabPane>
                        <TabPane tab={`Orders by articles`} key="4">
                            <OrdersByArticle orders={this.state.orders.ordersByArticle}/>
                        </TabPane>
                    </Tabs>
                ) : null}
            </div>
        )
    }
}

export default AdminIndex;