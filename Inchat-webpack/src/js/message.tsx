/**
 * @description 私信页面
 * @author ghc
 */

import * as React from 'react';
import * as ReactDOM from "react-dom";
import "../css/minireset.css";
import "../css/style.css";

import Nav from "../module/nav/nav";
import "../css/message.css";
import { Avatar, Button, Icon, Form, Input, Modal } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import { Ajax, checkLogin, toURL } from "../module/common";
import PopupTitle from "../module/popupTitle/popupTitle";

let { TextArea } = Input;

interface initProps {};
interface initState {};

class Message extends React.Component < initProps, initState > {
    state = {
        config: {

        }
    }
    /**
     * @description 获取用户发送的私信
     */
    userSendMessage = (() => {
        let userSendMessage = null;

        Ajax({  
            url: "selectMessage.php",
            data: {
                cate: "send"
            },
            success(data) {
                userSendMessage = JSON.parse(data);
            },
            error(status) {
                window.location.reload();
            }
        });

        return userSendMessage.mark === "noData" ? false : userSendMessage.value.reverse();
    })()
    /**
     * @description 获取用户收到的私信
     */
    userReceiveMessage = (() => {
        let userReceiveMessage = null;

        Ajax({  
            url: "selectMessage.php",
            data: {
                cate: "receive"
            },
            success(data) {
                userReceiveMessage = JSON.parse(data);
            },
            error(status) {
                window.location.reload();
            }
        });

        return userReceiveMessage.mark === "noData" ? false : userReceiveMessage.value.reverse();
    })()
    /**
     * @description 删除指定的私信
     * @param messageId 被删除的私信ID号
     */
    deleteMessage(messageId: string) {
        console.log(messageId);
    }
    /**
     * @description 弹出详情框
     * @param config 传递过去的配置信息
     */
    showMessage(config) {
        this.setState({
            config
        });
    }
    /**
     * @description 访问用户主页
     * @param userId 访问的用户的Id
     */
    toVisitorPage(userId: number, event) {
        event.stopPropagation();
        toURL("visitor.html?userId=" + userId, true);
    }
    render(): JSX.Element {
        const userSendMess = this.userSendMessage,
            userRecMess = this.userReceiveMessage,
            sendMessList = userSendMess ? (
                userSendMess.map((item) => (
                    <li key={item.messageId}>
                        <span className="avatar" onClick={this.toVisitorPage.bind(this, item.receiverId)} title="访问主页"><Avatar src={item.avatar} /></span>
                        <span className="username">{item.username}</span>
                        <span className="messContent">{item.content}</span>
                        <span className="time">{item.time}</span>
                        <span className="operation">
                            <Button type="primary" size="small" onClick={this.showMessage.bind(this, {
                                modalVisible: true,
                                receiverId: item.receiverId, 
                                username: item.username, 
                                content: item.content,
                                reply: false
                            })}>
                                详细
                            </Button>
                            <Button type="danger" size="small" onClick={this.deleteMessage.bind(this, item.messageId)}>
                                删除
                            </Button>
                        </span>
                    </li>
                ))
            ) : (
                <li>你还没有发送过私信呢</li>
            ),
            recMessList = userRecMess ? (
                userRecMess.map((item) => (
                    <li key={item.messageId}>
                        <span className="avatar" onClick={this.toVisitorPage.bind(this, item.senderId)} title="访问主页"><Avatar src={item.avatar} /></span>
                        <span className="username">{item.username}</span>
                        <span className="messContent">{item.content}</span>
                        <span className="time">{item.time}</span>
                        <span className="operation">
                            <Button type="primary" size="small" onClick={this.showMessage.bind(this, {
                                modalVisible: true,
                                receiverId: item.senderId, 
                                username: item.username, 
                                content: item.content,
                                reply: true
                            })}>
                                详细
                            </Button>
                            <Button type="danger" size="small" onClick={this.deleteMessage.bind(this, item.messageId)}>
                                删除
                            </Button>
                        </span>
                    </li>
                ))
            ) : (
                <li>你还没有收到过私信哦，但可以先给别人发发私信哦</li>
            );

        return (
            <div className="max-width">
                <div className="message-cate">
                    <span className="message-title">我发送的</span>
                    <ul className="message-list">
                        {
                            sendMessList
                        }
                    </ul>
                </div>
                <div className="message-cate">
                    <span className="message-title">我收到的</span>
                    <ul className="message-list">
                        {
                            recMessList
                        }
                    </ul>
                </div>
                <SendMessageForm config={this.state.config} />
            </div>
        )
    }
}

/**
 * 发送私信的弹出框
 */
interface initProps2 {
    config: any
}

class SendMessage extends React.Component<initProps2 & FormComponentProps, {}> {
    state = {
        modalVisible: false,
        receiverId: 0,
        username: "",
        content: "",
        reply: false
    }
    /**
     * @description 设置state中的modalVisible值
     * @param modalVisible 显示与否
     */
    setModalVisible(modalVisible: boolean) {
        this.setState({ modalVisible });
    }
    /**
     * @description 接受父组件重新发送的props，并更新此组件（的state）
     * @param nextProps 父组件更新后的props的值
     */
    componentWillReceiveProps(nextProps) {
        let config = nextProps.config;
        this.setState({
            modalVisible: config.modalVisible,
            receiverId: config.receiverId,
            username: config.username, 
            content: config.content,
            reply: config.reply
        });
    }
    /**
     * @description 处理表单提交
     * @param event 
     */
    handleSubmit(event) {
        const that = this;

        event.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (!checkLogin()) {
                    PopupTitle.show({
                        content: "请重新登录！",
                        cate: "warning"
                    });
        
                    return false;
                }
                values.receiverId = that.state.receiverId;
                values.time = ((date) => {
                    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                })(new Date());
                console.log('Received values of form: ', values);
                Ajax({
                    url: "sendMessage.php",
                    data: values,
                    method: "post",
                    success(val) {
                        if(val === "success") {
                            PopupTitle.show({
                                content: "发送成功"
                            });
                            that.setModalVisible.bind(that)(false); //这个地方不知道什么原因导致虽然调用了setModalVisible方法，却改变不了state =======================
                            // window.location.reload();
                        } else {
                            PopupTitle.show({
                                content: "发送失败，请重试",
                                cate: "error"
                            });
                        }
                    },
                    error(status) {
                        PopupTitle.show({
                            content: "发送失败，请重试",
                            cate: "error"
                        });
                        console.log("error status: ", status);
                    }
                });
            }
        });
    }
    render(): JSX.Element {
        const { getFieldDecorator } = this.props.form,
            FormItem = Form.Item;

        return (
            <Modal
                title={this.state.reply ? `来自${this.state.username}的私信：` : `发送给${this.state.username}的私信：`}
                visible={this.state.modalVisible}
                onCancel={this.setModalVisible.bind(this, false)}
                wrapClassName="vertical-center-modal"
                footer={this.state.reply ? <Button type="primary" onClick={this.handleSubmit.bind(this)} >回复</Button> : null}
                maskClosable={false}
                width="360px"
                >
                <Form>
                    <FormItem>
                        {getFieldDecorator('content', {
                            rules: [{ required: true, whitespace:true, min:10, message: '请输入不小于10个字符的内容！' }],
                            initialValue: this.state.content
                        })(
                            <TextArea autosize={{ minRows: 5, maxRows: 10 }} placeholder="内容（大于10个字符）" />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}
const SendMessageForm = Form.create<initProps2>()(SendMessage);


ReactDOM.render(
    <Nav />,
    document.getElementById("nav")
);

ReactDOM.render(
    <Message />,
    document.getElementById("page")
);