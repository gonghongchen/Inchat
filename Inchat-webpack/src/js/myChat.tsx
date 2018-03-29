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
import { Ajax, toURL } from "../module/common";
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
     * @description 从数据库获取到的各个卡片的内容数据
     */
    cardData = (() => {
        const data = [
            {
                chatId: 28,
                coverPic: "1.jpg",
                avatar: "1.jpg",
                title: "林允儿",
                description: "一个美丽可爱有趣的女孩子"
            }
        ];

        const tData = new Array(9);
        tData.fill(data[0]);
        return tData;
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
                        <Button type="primary" onClick={this.showModal.bind(this, true)}>
                            <Icon type="plus" />创建新群聊
                        </Button>
                        <CreateChatForm modalVisible={this.state.modalVisible} />
                    </div>
                </div>
                <div className="chat-right">
                    <div className="chat-cate">
                        <span className="cate-title">我创建的</span>
                        <ul className="chat-list">
                            {
                                this.cardData.map(item => (
                                    <li onClick={this.toDetailPage.bind(this, item.chatId)} key={ item.chatId + (Math.random()*1000).toFixed() }>
                                        <Card
                                            style={{ width: 250 }}
                                            cover={<img alt="example" src={require("../res/img/" + item.coverPic)} />}
                                            hoverable={true}
                                            bodyStyle={{padding: 20}}
                                            actions={[<span onClick={this.doChat.bind(this, "setting")}><Icon type="setting" />&nbsp;管理</span>, <span onClick={this.doChat.bind(this, "chart")}><Icon type="bar-chart" />&nbsp;数据统计</span>]}
                                        >
                                            <Meta
                                                avatar={<Avatar src={require("../res/img/avatar/" + item.avatar)} size="large" />}
                                                title={ item.title }
                                                description={ item.description }
                                                style={{ height: 80 }}
                                            />
                                        </Card>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <div className="chat-cate">
                        <span className="cate-title">我加入的</span>
                        <ul className="chat-list">
                            {
                                this.cardData.map(item => (
                                    <li onClick={this.toDetailPage.bind(this, item.chatId)} key={ item.chatId + (Math.random()*1000).toFixed() }>
                                        <Card
                                            style={{ width: 250 }}
                                            cover={<img alt="example" src={require("../res/img/" + item.coverPic)} />}
                                            hoverable={true}
                                            bodyStyle={{padding: 20}}
                                            actions={[<span title="关注量"><Icon type="heart-o" />&nbsp;99</span>, <span title="讨论量"><Icon type="message" />&nbsp;999+</span>]}
                                        >
                                            <Meta
                                                avatar={<Avatar src={require("../res/img/avatar/" + item.avatar)} size="large" />}
                                                title={ item.title }
                                                description={ item.description }
                                                style={{ height: 80 }}
                                            />
                                        </Card>
                                    </li>
                                ))
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
        modalVisible: false,
        previewVisible: false,
        previewImage: '',
        fileList: [{
            size: 1000,
            type: "png",
            uid: -1,
            name: 'xxx.png',
            status: "done",
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        }]
    }
    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }
      handleChange = ({ fileList }) => this.setState({ fileList })
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
    /**
     * @description 处理表单提交
     * @param event 
     */
    handleSubmit(event) {
        const that = this;

        event.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                Ajax({
                    url: "createChat.php",
                    data: values,
                    method: "post",
                    success(val) {
                        const data = JSON.parse(val),
                            mark = data.mark;

                        if(mark === "success") {
                            PopupTitle.show({
                                content: "创建成功"
                            });
                            // window.location.reload();
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
            { previewVisible, previewImage, fileList } = this.state,
            uploadButton = (
                <div>
                  <Icon type="plus" />
                  <div className="ant-upload-text">Upload</div>
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
                <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
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
                        {getFieldDecorator('coverPic', {
                            rules: [{ required: false, whitespace:true, min:20, message: '请输入正确的群简介！' }],
                        })(
                            <Button disabled>
                                <Icon type="upload" />上传封面图片
                            </Button>
                        )}
                    </FormItem>
                    <FormItem>
                        <Upload
                            action="//jsonplaceholder.typicode.com/posts/"
                            listType="picture-card"
                            // fileList={fileList}
                            onPreview={this.handlePreview}
                            onChange={this.handleChange}
                            >
                            {fileList.length >= 1 ? null : uploadButton}
                        </Upload>
                        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                    </FormItem>
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