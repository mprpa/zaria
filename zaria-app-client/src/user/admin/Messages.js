import React, { Component } from 'react';

import {List, Input, Form, Button, Modal, notification} from "antd";
import {sendResponse} from "../../util/APIUtils";

const FormItem = Form.Item;

const action_btn = {
    border: "none"
};

const CreateAnswerForm = Form.create()(
    class extends React.Component {
        render() {
            const { visible, onCancel, onSend, form } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Modal
                    visible={visible}
                    title="Reply to message"
                    okText="Send"
                    onCancel={onCancel}
                    onOk={onSend}
                >
                    <Form layout="vertical">
                        <FormItem label="Title">
                            {getFieldDecorator('title', {
                                rules: [{ required: true, message: 'Please input the title of message!' }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem label="Message">
                            {getFieldDecorator('description')(<Input type="textarea" />)}
                        </FormItem>
                    </Form>
                </Modal>
            );
        }
    }
);

class Messages extends Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            selectedIndex: -1,
            messagesList: props.messagesList
        };
    }

    showModal = (event, index) => {
        this.setState({
            visible: true,
            selectedIndex : index
        });
    };

    handleCancel = () => {
        this.setState({
            visible: false,
            selectedIndex : -1
        });
    };

    handleSend = () => {
        const form = this.formRef.props.form;
        const id = this.formRef.props.id;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            const messageResponse = {
                id: id,
                title: values.title,
                description: values.description
            };
            sendResponse(messageResponse)
                .then(response => {
                    notification.success({
                        message: 'Zaria fashion',
                        description: response.message,
                    });
                    this.props.getUnreadMessages();
                }).catch(error => {
                notification.error({
                    message: 'Zaria fashion',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                })
            });

            form.resetFields();

            this.setState({
                visible: false,
                selectedIndex : -1,
                messagesList: this.state.messagesList.filter((message) => message.id !== id)
            });
        });
    };

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    };

    render() {

        return (
            <div>
                <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                        onChange: (page) => {
                            console.log(page);
                        },
                        pageSize: 3,
                    }}
                    dataSource={this.state.messagesList}
                    renderItem={item => (
                        <List.Item
                            key={item.name}
                            actions={[<Button style={action_btn} type="dashed" shape="circle" icon="message" onClick={(event) => this.showModal(event, item.id)}/>]}
                        >
                            <List.Item.Meta
                                title={item.name}
                                description={item.email}
                            />
                            {item.message}
                        </List.Item>
                    )}
                />
                <CreateAnswerForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onSend={this.handleSend}
                    id={this.state.selectedIndex}
                />
            </div>
        );
    }
}

export default Messages;