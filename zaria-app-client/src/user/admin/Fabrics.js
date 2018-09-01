import React, { Component } from 'react';
import LoadingIndicator from "../../common/LoadingIndicator";
import {Collapse, notification, Card, Col, Row, Input} from "antd";
import ServerError from "../../common/ServerError";
import {getAllFabrics, updateFabricState} from "../../util/APIUtils";

const Panel = Collapse.Panel;
const Search = Input.Search;

class Fabrics extends Component{
    constructor(props){
        super(props);
        this.state = {
            fabrics: null,
            isLoading: false
        }
    }

    loadAllFabrics = () => {
        this.setState({
            isLoading: true
        });

        getAllFabrics()
            .then(response => {
                this.setState({
                    fabrics: response,
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

    updateAmount = (fabricId, stateId, value) => {
        if(isNaN(value)) {
            notification.error({
                message: 'Zaria fashion',
                description: 'You must insert a number!'
            });
        } else {
            updateFabricState(stateId, value)
                .then(response => {
                    let fabric = this.state.fabrics.find(obj => {
                        return obj.id === fabricId
                    })
                    let updatedOrders = fabric.colors.filter((el) => {
                        if(el.id === stateId) {
                            el.amount = el.amount + Number(value);
                        }
                        return el;
                    });
                    this.setState({
                        orders: updatedOrders
                    });
                    notification.success({
                        message: 'Zaria fashion',
                        description: 'Order updated!'
                    });
                }).catch(error => {
                notification.error({
                    message: 'Zaria fashion',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });
            });
        }
    };

    componentDidMount() {
        this.loadAllFabrics();
    }

    render () {
        if(this.state.isLoading) {
            return <LoadingIndicator />;
        }

        if(this.state.serverError) {
            return <ServerError />;
        }

        let panels = [];
        if(this.state.fabrics) {
            this.state.fabrics.forEach((fabric) => {
                let values = [];
                fabric.colors.forEach((color) => {
                    const customPanelStyle = {
                        background: color.code,
                        borderRadius: 4,
                        marginBottom: 24,
                        border: 0,
                        overflow: 'hidden',
                        paddingBottom: 22
                    };
                    let value = (
                        <Panel header="" style={customPanelStyle} key={color.code}>
                            <div style={{padding: '20px'}}>
                                <Row gutter={16}>
                                    <Col span={8}>
                                        <Card title="Available" bordered={false}
                                              style={{textAlign: 'center'}}>{color.amount}</Card>
                                    </Col>
                                    <Col span={8}>
                                        <Card title="Reserved" bordered={false}
                                              style={{textAlign: 'center'}}>{color.reserved}</Card>
                                    </Col>
                                    <Col span={8}>
                                        <Card title="Add fabric" bordered={false} style={{textAlign: 'center'}}>
                                            <Search type="number" enterButton="Add" style={{ width: 100 }}
                                                    onSearch={(value) => this.updateAmount(fabric.id, color.id, value)}/>
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                        </Panel>
                    );
                    values.push(value);
                });
                let panel = (
                    <Panel header={fabric.composition} key={fabric.id}>
                        <Collapse accordion>
                            {values}
                        </Collapse>
                    </Panel>
                );
                panels.push(panel);
            });
        }

        return (
            <div style={{margin: "20px 0 0 0"}}>
                {this.state.fabrics ? (
                    <Collapse accordion>
                        {panels}
                    </Collapse>
                ) : null}
            </div>
        )
    }
}

export default Fabrics;