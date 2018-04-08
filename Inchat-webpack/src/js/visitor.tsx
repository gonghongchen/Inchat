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

let { Meta } = Card,
    { TextArea } = Input,
    pageURL = window.location.href,
    userId = Number(pageURL.substring(pageURL.indexOf("userId=") + 7)); //被访问者的ID号

interface initProps {};
interface initState {};

class MyChat extends React.Component < initProps, initState > {
    state = {
        modalVisible: false
    }
    /**
     * @description //获取用户资料
     */
    userInfor = (() => {
        let userInfor = null;

        Ajax({  
            url: "selectUserInfor.php",
            data: {
                userId
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
                userId   //查询当前访问的用户
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
                    target: userId
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
    showModal(modalVisible: boolean) {
        this.setState({
            modalVisible
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
     * @description 跳转到【管理 | 数据统计】页面
     * @param cate 点击的按钮类别
     */
    doChat(cate: string, event) {
        event.stopPropagation();

        console.log(cate);
        return false;
    }
    render(): JSX.Element {
        const userInfor = this.userInfor,
            createChatData = this.createChatData,
            followChatData = this.followChatData,
            ta = ((g) => {
                switch (g) {
                    case "保密":
                        return "TA";
                    case "女":
                        return "她";
                    case "男":
                        return "他";
                }
            })(userInfor.gender),
            createChatCardList = createChatData ? ( //封装群聊卡片列表数据
                createChatData.map(item => (
                    <li onClick={this.toDetailPage.bind(this, item.chatId)} key={ item.chatId }>
                        <Card
                            style={{ width: 250 }}
                            cover={ <div className="chatCoverPic" style={{backgroundImage: `url(${item.chatCoverPicURL})`}}></div> }
                            hoverable={true}
                            bodyStyle={{padding: 20}}
                            actions={[<span title="关注量"><Icon type="heart-o" />&nbsp;{ item.chatFollowNum }</span>, <span title="访问量"><Icon type="eye-o" />&nbsp;{ item.chatVisitNum }</span>]}
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
                <li>{ta}还没有创建过群聊哦</li>
            ),
            followChatCardList = followChatData ? ( //封装群聊卡片列表数据
                followChatData.map(item => (
                    <li onClick={this.toDetailPage.bind(this, item.chatId)} key={ item.chatId }>
                        <Card
                            style={{ width: 250 }}
                            cover={ <div className="chatCoverPic" style={{backgroundImage: `url(${item.chatCoverPicURL})`}}></div> }
                            hoverable={true}
                            bodyStyle={{padding: 20}}
                            actions={[<span title="关注量"><Icon type="heart-o" />&nbsp;{ item.chatFollowNum }</span>, <span title="访问量"><Icon type="eye-o" />&nbsp;{ item.chatVisitNum }</span>]}
                        >
                            <Meta
                                avatar={<Avatar src={item.avatar} size="large" />}
                                title={ item.chatName }
                                description={ item.chatIntro.length > 30 ? item.chatIntro.substr(0, 28) + "……" : item.chatIntro }
                                style={{ height: 80 }}
                            />
                        </Card>
                    </li>
                ))
            ) : (
                <li>{ta}还没有关注的群聊哦</li>
            ),
            gender = ((g) => {
                switch (g) {
                    case "保密":
                        return "性别保密";
                    case "女":
                        return <Icon type="woman" style={{color: "#ef5350"}} />;
                    case "男":
                        return <Icon type="man" style={{color: "#03a9f4"}} />;
                }
            })(userInfor.gender),
            year = ((b) => {
                /**
                 * @description 根据指定的秒速计算出到今天为止的年龄并格式化为指定的显示规则
                 * @param seconds 秒数
                 * @return "*岁"
                 */
                const formatYear = (seconds: number): string => {
                    /**
                     * @description 根据给定的日期对象，返回该对象的年月日
                     * @param seconds 秒数
                     * @return [年, 月, 日]
                     */
                    const getTime = (seconds? : number): number[] => {
                        let date = typeof seconds === "number" ? new Date(seconds) : new Date();
                        return [
                            date.getFullYear(),
                            date.getMonth() + 1,
                            date.getDate()
                        ];
                    };

                    let birthTime = getTime(seconds),
                        nowTime = getTime(),
                        spaceY = nowTime[0] - birthTime[0],
                        spaceM = nowTime[1] - birthTime[1],
                        spaceD = nowTime[2] - birthTime[2],
                        year = spaceM > 0 ? spaceY : (spaceM < 0 ? spaceY-1 : (spaceD >= 0 ? spaceY : spaceY-1));

                    return year + "岁";
                };

                b = Number.parseInt(b);

                return b === 0 ? "年龄未知" : formatYear(b);
            })(userInfor.birthday);

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
                        <div className="user-location">
                            {userInfor.location}
                        </div>
                        <div className="gender-year">
                            <span>{gender}</span>
                            <span>|</span>
                            <span>{year}</span>
                        </div>
                        <div>
                            {userInfor.intro}
                        </div>
                        <CreateChatForm modalVisible={this.state.modalVisible} />
                    </div>
                    <div className="chat-self">
                        <Button type="primary" onClick={this.showModal.bind(this, true)}>
                            <Icon type="rocket" />发送私信
                        </Button>
                    </div>
                </div>
                <div className="chat-right">
                    <div className="chat-cate">
                        <span className="cate-title">{ta}创建的</span>
                        <ul className="chat-list">
                            {
                                createChatCardList
                            }
                        </ul>
                    </div>
                    <div className="chat-cate">
                        <span className="cate-title">{ta}关注的</span>
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
 * 发送私信的弹出框
 */
interface initProps2 {
    modalVisible: boolean
}

class CreateChat extends React.Component<initProps2 & FormComponentProps, {}> {
    state = {
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

                console.log('Received values of form: ', values);
                Ajax({
                    url: "sendMessage.php",
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
            FormItem = Form.Item;

        return (
            <Modal
                title="发私信"
                visible={this.state.modalVisible}
                onOk={this.handleSubmit.bind(this)}
                onCancel={this.setModalVisible.bind(this, false)}
                wrapClassName="vertical-center-modal"
                maskClosable={false}
                cancelText="取消"
                okText="发送"
                width="360px"
                >
                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem>
                        {getFieldDecorator('chatIntro', {
                            rules: [{ required: true, whitespace:true, min:10, message: '请输入不小于10个字符的内容！' }],
                        })(
                            <TextArea autosize={{ minRows: 5, maxRows: 10 }} placeholder="内容（大于10个字符）" />
                        )}
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