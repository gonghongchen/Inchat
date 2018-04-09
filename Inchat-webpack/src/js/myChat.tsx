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
import { Ajax, toURL, doSelectPic } from "../module/common";
import PopupTitle from "../module/popupTitle/popupTitle";

let { Meta } = Card,
    { TextArea } = Input,
    createdChatData = null,
    initChatConfig = {
        modalVisible: false,
        titleText: "",
        chatName: "",
        chatIntro: "",
        chatCoverPicURL: "",
        okBtnText: "",
        submitURL: "",
        errorText: "",
        mustChatCoverPicURL: true
    },
    createChatConfig = {
        modalVisible: true,
        titleText: "创建新群聊",
        chatName: "",
        chatIntro: "",
        chatCoverPicURL: "",
        okBtnText: "创建",
        submitURL: "createChat.php",
        errorText: "创建失败，请重试",
        mustChatCoverPicURL: true
    },
    updateChatConfig = {
        modalVisible: true,
        titleText: "修改群聊资料",
        chatName: "",
        chatIntro: "",
        chatCoverPicURL: "",
        okBtnText: "修改",
        submitURL: "updateChat.php",
        errorText: "修改失败，请重试",
        mustChatCoverPicURL: false
    },
    oldChatInfor = null;

interface initProps {};
interface initState {};

class MyChat extends React.Component < initProps, initState > {
    state = {
        chatModalConfig: null
    }
    /**
     * @description //获取用户资料
     */
    userInfor = (() => {
        let userInfor = null;

        Ajax({  
            url: "selectUserInfor.php",
            data: {
                userId: 0
            },
            success(data) {
                userInfor = JSON.parse(data);
            },
            error(status) {
                window.location.reload();
            }
        });

        return userInfor;
    })()
    /**
     * @description 从数据库获取到的创建的群聊的内容数据
     */
    createChatData = (() => {
        let chatData = null;

        Ajax({
            url: "selectChat.php",
            data: {
                target: "user", //查询的对象是某个确定的用户
                userId: "current"   //此用户就是当前登录的用户
            },
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

        createdChatData = chatData;

        return chatData;
    })()
    /**
    * @description 从数据库获取到的关注的群聊的内容数据
    */
    followChatData = (() => {
        let followChatId = this.userInfor.followChat,
            chatData = null;

        if (followChatId) {
            Ajax({
                url: "selectFollowChat.php",
                data: {
                    target: "current"
                },
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
        }

        return chatData;
    })()
    /**
     * @description 显示创建/修改群聊的弹出框
     */
    showModal() {
        this.setState({
            chatModalConfig: createChatConfig
        });
    }
    /**
     * @description 跳转到点击的群聊页面
     * @param chatId 对应群聊的ID号
     */
    toDetailPage(chatId: number) {
        toURL(`chat.html?chatId=${chatId}`, true);
    }
    /**
     * @description 访问用户主页
     * @param userId 访问的用户的Id
     */
    toVisitorPage(userId: number,event) {
        event.stopPropagation();
        toURL("visitor.html?userId=" + userId, true);
    }
    /**
     * @description 点击【修改资料 | 数据统计】的操作
     * @param cate 点击的按钮类别
     */
    doAction(cate: string, chatId, event) {
        event.stopPropagation();

        if (cate === "setting") {   //修改资料
            for (const item of createdChatData) {   //初始化弹出框的内容
                if (item.chatId === chatId) {
                    updateChatConfig.chatName = item.chatName;
                    updateChatConfig.chatIntro = item.chatIntro;
                    updateChatConfig.chatCoverPicURL = item.chatCoverPicURL;

                    oldChatInfor = {    //存储更新前的群聊资料
                        chatName: item.chatName,
                        chatIntro: item.chatIntro,
                        chatCoverPicURL: item.chatCoverPicURL,
                        chatId
                    };

                    break;
                }
            }
            this.setState({
                chatModalConfig: updateChatConfig
            });
        }
    }
    render(): JSX.Element {
        const userInfor = this.userInfor,
            createChatData = this.createChatData,
            followChatData = this.followChatData,
            createChatCardList = createChatData ? ( //封装群聊卡片列表数据
                createChatData.map(item => (
                    <li onClick={this.toDetailPage.bind(this, item.chatId)} key={ item.chatId }>
                        <Card
                            style={{ width: 250 }}
                            cover={ <div className="chatCoverPic" style={{backgroundImage: `url(${item.chatCoverPicURL})`}}></div> }
                            hoverable={true}
                            bodyStyle={{padding: 20}}
                            actions={[<span onClick={this.doAction.bind(this, "setting", item.chatId)}><Icon type="setting" />&nbsp;修改资料</span>, <span onClick={this.doAction.bind(this, "chart", item.chatId)}><Icon type="bar-chart" />&nbsp;数据统计</span>]}
                        >
                            <Meta
                                avatar={<Avatar src={userInfor.avatar} size="large" />}
                                title={ item.chatName }
                                description={ item.chatIntro.length > 30 ? item.chatIntro.substr(0, 28) + "……" : item.chatIntro }
                                style={{ height: 80 }}
                            />
                        </Card>
                    </li>
                ))
            ) : (
                <li>现在没有内容哦，赶快去创建吧</li>
            ),
            followChatCardList = followChatData ? ( //封装群聊卡片列表数据
                followChatData.map(item => (
                    <li onClick={this.toDetailPage.bind(this, item.chatId)} key={ item.chatId } title="进入群聊">
                        <Card
                            style={{ width: 250 }}
                            cover={ <div className="chatCoverPic" style={{backgroundImage: `url(${item.chatCoverPicURL})`}}></div> }
                            hoverable={true}
                            bodyStyle={{padding: 20}}
                            actions={[<span title="关注量" style={{cursor: "default"}}><Icon type="heart-o" />&nbsp;{ item.chatFollowNum }</span>, <span title="访问量" style={{cursor: "default"}}><Icon type="eye-o" />&nbsp;{ item.chatVisitNum }</span>]}
                        >
                            <Meta
                                avatar={<span onClick={this.toVisitorPage.bind(this, item.userId)} title="访问主页" ><Avatar src={item.avatar} size="large" /></span>}
                                title={ item.chatName }
                                description={ item.chatIntro.length > 30 ? item.chatIntro.substr(0, 28) + "……" : item.chatIntro }
                                style={{ height: 80 }}
                            />
                        </Card>
                    </li>
                ))
            ) : (
                <li>现在没有内容哦，去关注看看吧</li>
            );

        return (
            <div className="max-width chat-box">
                <div className="chat-left">
                    <div className="chat-self">
                        <Avatar size="large" src={userInfor.avatar} />
                        <h3>{userInfor.username}</h3>
                        <div className="chat-num">
                            <span><i>{userInfor.createChatNum}</i>创建</span>
                            <span>|</span>
                            <span><i>{userInfor.followChatNum}</i>关注</span>
                        </div>
                        <CreateChatForm config={this.state.chatModalConfig} />
                    </div>
                    <div className="chat-self">
                        <Button type="primary" onClick={this.showModal.bind(this)}>
                            <Icon type="plus" />创建新群聊
                        </Button>
                    </div>
                </div>
                <div className="chat-right">
                    <div className="chat-cate">
                        <span className="cate-title">我创建的</span>
                        <ul className="chat-list">
                            {
                                createChatCardList
                            }
                        </ul>
                    </div>
                    <div className="chat-cate">
                        <span className="cate-title">我关注的</span>
                        <ul className="chat-list">
                            {
                                followChatCardList
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
interface config {
    modalVisible: boolean,
    titleText: string,
    chatName: string,
    chatIntro: string,
    chatCoverPicURL: string,
    okBtnText: string,
    submitURL: string,
    errorText: string,
    mustChatCoverPicURL: boolean
}
interface initProps2 {
    config: config
}

class CreateChat extends React.Component<initProps2 & FormComponentProps, {}> {
    state = initChatConfig
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
        console.log("nextProps", nextProps);
        this.setState(nextProps.config);
    }
    showPreViewPic(chatCoverPicURL): void {
        createChatConfig.chatCoverPicURL = chatCoverPicURL; //将createChatConfig.chatCoverPicURL的数据实时更新，以避免当父组件render后导致弹出框里面没有刚刚选择的图片数据，下同
        updateChatConfig.chatCoverPicURL = chatCoverPicURL;
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
        const self = this;

        event.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.chatCoverPicURL = this.state.chatCoverPicURL;
                
                if (oldChatInfor) { //表示更新群数据，且在更新群聊资料时需要做数据是否修改的判断，并把chatId封装到数据中去
                    values.chatId = oldChatInfor.chatId;
                    //由于执行了validateFields方法后，各个输入框里面的值就会被固定，导致点击修改其它群聊的时候初始化显示的内容有误，故在没有想到解决方法之前这里现在还不能做判断
                    if (JSON.stringify(oldChatInfor) === JSON.stringify(values)) {  //没有修改任何内容
                        // PopupTitle.show({
                        //     content: "没有修改任何内容",
                        //     cate: "warning"
                        // });
                        values.hasModify = "no" ;

                        // return false;
                    } else {
                        values.hasModify = "yes" ;
                    }
                }

                event.target.disabled = true;
                Ajax({
                    url: self.state.submitURL,
                    data: values,
                    method: "post",
                    success(val) {
                        if(val === "success") {   //创建/修改成功
                            window.location.reload();
                        } else {
                            PopupTitle.show({
                                content: self.state.errorText,
                                cate: "error"
                            });
                            event.target.disabled = false;
                        }
                    },
                    error(status) {
                        PopupTitle.show({
                            content: self.state.errorText,
                            cate: "error"
                        });
                        console.log("error status: ", status);
                        event.target.disabled = false;
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
                title={this.state.titleText}
                visible={this.state.modalVisible}
                onOk={this.handleSubmit.bind(this)}
                onCancel={this.setModalVisible.bind(this, false)}
                wrapClassName="vertical-center-modal"
                maskClosable={false}
                cancelText="取消"
                okText={this.state.okBtnText}
                width="360px"
                >
                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem>
                        {getFieldDecorator('chatName', {
                            rules: [{ required: true, whitespace:true, min:2, message: '请输入正确的群名字！' }],
                            initialValue: this.state.chatName
                        })(
                            <Input size="large" placeholder="群名字（大于2个字符）" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('chatIntro', {
                            rules: [{ required: true, whitespace:true, min:20, message: '请输入正确的群简介！' }],
                            initialValue: this.state.chatIntro
                        })(
                            <TextArea autosize={{ minRows: 3, maxRows: 5 }} placeholder="群简介（大于20个字符）" />
                        )}
                    </FormItem>
                    <FormItem className="upload-cover-pic">
                        {getFieldDecorator('chatCoverPicURL', {
                            rules: [{ required: this.state.mustChatCoverPicURL, whitespace:true, min:20, message: '请选择封面图片！' }],
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