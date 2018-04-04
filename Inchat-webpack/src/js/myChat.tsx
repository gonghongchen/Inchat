/**
 * @description 我的群聊
 * @author ghc
 */

import * as React from 'react';
import * as ReactDOM from "react-dom";
import "../css/minireset.css";
import "../css/style.css";

import Nav from "../module/nav/nav";
import "../css/myChat.css";
import { Avatar, Button, Icon, Card, Modal, Form, Input, Upload } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import { Ajax, toURL, doSelectPic, checkLogin } from "../module/common";
import PopupTitle from "../module/popupTitle/popupTitle";

const { Meta } = Card,
    { TextArea } = Input;

interface initProps {};
interface initState {};

class MyChat extends React.Component < initProps, initState > {
    state = {
        modalVisible: false
    }
    showModal(modalVisible: boolean) {
        this.setState({
            modalVisible
        });
    }
    /**
     * @description 从数据库获取到的各个群聊卡片的内容数据
     */
    chatData = (() => {
        let chatData = null;

        Ajax({
            url: "selectChat.php",
            data: {
                target: "user", //查询的对象是某个确定的用户
                userId: "current"   //此用户就是当前登录的用户
            },
            method: "post",
            success(data) {
                data = JSON.parse(data);
                if (data.mark === "haveData") {
                    chatData = data.value;
                }
            },
            error(status) {
                console.log("error: ", status);
            }
        });

        return chatData;
    })()
    /**
     * @description 跳转到点击的群聊页面
     * @param chatId 对应群聊的ID号
     */
    toDetailPage(chatId: number) {
        console.log("chatId: ", chatId);
        toURL(`chat.html?chatId=${chatId}`, true);
    }
    /**
     * @description 跳转到【管理 | 数据统计】页面
     * @param cate 点击的按钮类别
     */
    doChat(cate: string, event) {
        event.stopPropagation();

        console.log(cate);
        return false;
    }
    createNewChat() {
        console.log("点击创建新的群聊");
    }
    render(): JSX.Element {
        const chatData = this.chatData,
            chatCardList = chatData ? ( //封装群聊卡片列表数据
                chatData.map(item => (
                    <li onClick={this.toDetailPage.bind(this, item.chatId)} key={ item.chatId }>
                        <Card
                            style={{ width: 250 }}
                            cover={ <div className="chatCoverPic" style={{backgroundImage: `url(${item.chatCoverPicURL})`}}></div> }
                            hoverable={true}
                            bodyStyle={{padding: 20}}
                            actions={[<span onClick={this.doChat.bind(this, "setting")}><Icon type="setting" />&nbsp;管理</span>, <span onClick={this.doChat.bind(this, "chart")}><Icon type="bar-chart" />&nbsp;数据统计</span>]}
                        >
                            <Meta
                                avatar={<Avatar src={require("../res/img/avatar/1.jpg")} size="large" />}
                                title={ item.chatName }
                                description={ item.chatIntro.length > 30 ? item.chatIntro.substr(0, 28) + "……" : item.chatIntro }
                                style={{ height: 80 }}
                            />
                        </Card>
                    </li>
                ))
            ) : (
                <li>现在没有内容哦</li>
            );

        return (
            <div className="max-width chat-box">
                <div className="chat-left">
                    <div className="chat-self">
                        <Avatar size="large" src={require("../res/img/avatar/1.jpg")} />
                        <h3>林允儿</h3>
                        <div className="chat-num">
                            <span><i>9</i>创建</span>
                            <span>|</span>
                            <span><i>99</i>加入</span>
                        </div>
                        <div className="chat-style">
                            <span>吃货</span><span>颜控</span><span>吃货</span><span>颜控</span><span>吃货</span><span>颜控</span>
                        </div>
                        <CreateChatForm modalVisible={this.state.modalVisible} />
                    </div>
                    <div className="chat-self">
                        <Button type="primary" onClick={this.showModal.bind(this, true)}>
                            <Icon type="plus" />创建新群聊
                        </Button>
                    </div>
                </div>
                <div className="chat-right">
                    <div className="chat-cate">
                        <span className="cate-title">我创建的</span>
                        <ul className="chat-list">
                            {
                                chatCardList
                            }
                        </ul>
                    </div>
                    <div className="chat-cate">
                        <span className="cate-title">我关注的</span>
                        <ul className="chat-list">
                            {
                                chatCardList
                            }
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

/**
 * 创建新群聊的弹出框
 */
interface initProps2 {
    modalVisible: boolean
}

class CreateChat extends React.Component<initProps2 & FormComponentProps, {}> {
    state = {
        chatCoverPicURL: "",
        modalVisible: false,
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
        this.setState({ modalVisible: nextProps.modalVisible });
    }
    showPreViewPic(chatCoverPicURL): void {
        this.setState({
            chatCoverPicURL
        });
    }
    doClickSelPic(fileInput) {
        fileInput.click();
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
                
                values.chatCoverPicURL = this.state.chatCoverPicURL;
                console.log('Received values of form: ', values);
                Ajax({
                    url: "createChat.php",
                    data: values,
                    method: "post",
                    success(val) {
                        if(val) {   //创建成功
                            window.location.reload();
                        } else {
                            PopupTitle.show({
                                content: "创建失败，请重试",
                                cate: "error"
                            });
                        }
                    },
                    error(status) {
                        PopupTitle.show({
                            content: "创建失败，请重试",
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
            FormItem = Form.Item,
            uploadButton = (
                <div>
                  <Icon type="plus" />
                  <div className="ant-upload-text">上传封面图片</div>
                </div>
            );

        return (
            <Modal
                title="创建新群聊"
                visible={this.state.modalVisible}
                onOk={this.handleSubmit.bind(this)}
                onCancel={this.setModalVisible.bind(this, false)}
                wrapClassName="vertical-center-modal"
                maskClosable={false}
                cancelText="取消"
                okText="创建"
                width="360px"
                >
                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem>
                        {getFieldDecorator('chatName', {
                            rules: [{ required: true, whitespace:true, min:2, message: '请输入正确的群名字！' }],
                        })(
                            <Input size="large" placeholder="群名字（大于2个字符）" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('chatIntro', {
                            rules: [{ required: true, whitespace:true, min:20, message: '请输入正确的群简介！' }],
                        })(
                            <TextArea autosize={{ minRows: 3, maxRows: 5 }} placeholder="群简介（大于20个字符）" />
                        )}
                    </FormItem>
                    <FormItem className="upload-cover-pic">
                        {getFieldDecorator('chatCoverPicURL', {
                            rules: [{ required: true, whitespace:true, min:20, message: '请选择封面图片！' }],
                        })(
                            <Button onClick={ () => { this.doClickSelPic.bind(this)(this.refs.fileInput) } }>
                                <Icon type="upload" />上传封面图片
                                <input type="file" onChange={doSelectPic.bind(null, this.showPreViewPic.bind(this), 400)} ref="fileInput" style={{ display: "none" }} />
                            </Button>
                        )}
                    </FormItem>
                    {
                        this.state.chatCoverPicURL ? <img src={this.state.chatCoverPicURL} /> : ""
                    }
                </Form>
            </Modal>
        )
    }
}
const CreateChatForm = Form.create<initProps2>()(CreateChat);


ReactDOM.render(
    <Nav />,
    document.getElementById("nav")
);

ReactDOM.render(
    <MyChat />,
    document.getElementById("page")
);