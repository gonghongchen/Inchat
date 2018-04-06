/**
 * @description 群聊页面
 * @author ghc
 */

import * as React from 'react';
import * as ReactDOM from "react-dom";
import "../css/minireset.css";
import "../css/style.css";

import Nav from "../module/nav/nav";
import "../css/chat.css";
import { Avatar, Button, Icon, Popover } from 'antd';
import { Ajax, toURL } from "../module/common";
import PopupTitle from "../module/popupTitle/popupTitle";

const express = require("../config/config.express.json");

interface initProps {};
interface initState {};

export default class Chat extends React.Component < initProps, initState > {
    state = {
        isFollow: false
    }
    isFollow = false
    chatId = 0
    chatInfor = (() => {
        let chatInfor = null,
            pageURL = window.location.href,
            chatId = Number(pageURL.substring(pageURL.indexOf("chatId=") + 7)); //此聊天室的ID号
        this.chatId = chatId;

        if (typeof chatId === "number") {
            Ajax({
                url: "selectChatInfor.php",
                data: {
                    chatId
                },
                success(data) {
                    if (data === "noData") {
                        PopupTitle.show({
                            content: "此群不存在",
                            cate: "error"
                        });
                        setTimeout(toURL("index"), 2000);
                        return false;
                    }
                    chatInfor = JSON.parse(data);
                },
                error(status) {
                    console.log("error: ", status);
                }
            });
        } else {
            toURL("index"); //如果URL地址中的chatId异常则直接跳转到首页
        }
        
        let chatFollow = chatInfor && chatInfor.chatFollow || null;
        if (chatFollow) {   //判断是否关注了此群聊
            let userId = JSON.parse(localStorage.userInfor).userId;
            if (chatFollow.includes(userId)) {
                this.isFollow = true;
            }
        }
        return chatInfor;
    })()
    componentWillMount() {
        this.setState({
            isFollow: this.isFollow
        });
    }
    /**
     * @description 处理点击【表情 | 图片】等icon时的事件
     * @param event 
     */
    doClickIcon(event) {
        if (event.target.tagName === "I") {
            event.stopPropagation();
            console.log(event.target.getAttribute("data-type"));
        }
    }
    /**
     * @description 设置聊天室的颜文字表情
     */
    setExpress() {
        const values = express.values;

        return (
            <ul className="express" onClick={this.addExpress.bind(this)}>
                {
                    values.map(item => (
                        <li key={Math.random()}>{item}</li>
                    ))
                }
            </ul>
        );
    }
    /**
     * @description 点击颜文字添加表情
     * @param event 
     */
    addExpress(event) {
        if (event.target.tagName === "LI") {
            event.stopPropagation();
            console.log(event.target.innerText);
        }
    }
    sendMess() {

    }
    follow(isFollow: boolean) {
        let that = this,
            isSuccess = false;

        Ajax({
            url: "followChat.php",
            method: "post",
            data: {
                chatId: that.chatId,
                isFollow
            },
            success(data) {
                if (data === "success") {
                    PopupTitle.show({
                        content: (isFollow ? "已关注" : "已取消关注"),
                        seconds: 2
                    });
                    isSuccess = true;
                } else {
                    PopupTitle.show({
                        content: (isFollow ? "关注失败，请重试" : "取消关注失败，请重试"),
                        seconds: 3,
                        cate: "error"
                    });
                }
            },
            error(status) {
                PopupTitle.show({
                    content: (isFollow ? "关注失败，请重试" : "取消关注失败，请重试"),
                    seconds: 3,
                    cate: "error"
                });
                console.log("error: ", status);
            }
        });
        
        if (isSuccess) {
            this.setState({
                isFollow
            });
        }
    }
    render(): JSX.Element {
        const chatInfor = this.chatInfor,
            isFollow = this.state.isFollow;

        return (
            <div className="max-width chat-box">
                <div className="chat-title">
                    {chatInfor.chatName}
                    {
                        isFollow ? 
                        <Icon type="heart" onClick={this.follow.bind(this, false)} title="取消关注" style={{color: "rgb(239, 83, 80)", marginLeft: 10, cursor: "pointer"}} /> : 
                        <Icon type="heart-o" onClick={this.follow.bind(this, true)} title="关注" style={{color: "#fff", marginLeft: 10, cursor: "pointer"}} />
                    }
                    {/* <Icon type={isFollow ? "heart" : "heart-o"} onClick={this.follow.bind(this, isFollow)} title={isFollow ? "取消关注" : "关注"} style={{color: `${isFollow ? "rgb(239, 83, 80)" : "#fff"}`, marginLeft: 10, cursor: "pointer"}} /> */}
                </div>
                <div className="chat-window">
                    <ul className="chat-window-mess">
                        <li>
                            <Avatar src={require("../res/img/avatar/1.jpg")} size="large" />
                            <div className="infor">
                                <span>林允儿</span>
                                <p>林允儿林允儿林允儿林允儿林允儿林允儿林允儿林允儿林允儿林允儿林允儿林允儿林允儿林允儿林允儿林允儿林允儿林允儿林允儿林允儿林允儿林允儿林允儿林允儿林允儿</p>
                            </div>
                        </li>
                        <li className="right">
                            <Avatar src={require("../res/img/avatar/1.jpg")} size="large" />
                            <div className="infor">
                                <span>林允儿</span>
                                <p>林允儿林允儿林允儿林允儿林允儿林允儿林允儿林允儿林允儿林允儿林允儿林允儿林允儿林允儿林允儿林允儿林允儿林允儿林允儿林允儿林允儿林允儿林允儿林允儿林允儿</p>
                            </div>
                        </li>
                    </ul>
                    <div className="chat-window-edit">
                        <div className="icons" onClick={this.doClickIcon.bind(this)}>
                            <Popover content={this.setExpress.bind(this)()}>
                                <Icon type="smile-o" data-type="express" />
                            </Popover>
                            
                            <Icon type="picture" data-type="picture" />
                        </div>
                        <textarea></textarea>
                        <div className="buttons">
                            <Button type="primary" onClick={this.sendMess.bind(this)}>
                                <Icon type="rocket" />发送
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="chat-infor">
                    <div className="chat-infor-des">
                        <p className="module-title">简介</p>
                        <p>{chatInfor.chatIntro}</p>
                    </div>
                    <div className="chat-infor-notice">
                        <p className="module-title">公告</p>
                        <ul>
                            <li>
                                <p>公告标题</p>
                                <p>公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容</p>
                                <p>3-28 17:28</p>
                            </li>
                            <li>
                                <p>公告标题</p>
                                <p>公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容</p>
                                <p>3-28 17:28</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="chat-members">
                    <p className="module-title">关注</p>
                    <ul>
                        <li>
                            <Avatar src={require("../res/img/avatar/1.jpg")} size="large" />
                            <div>
                                <span>林允儿</span>
                                <p>允儿林允儿林允儿儿林允儿允儿林允儿林允儿儿林允儿</p>
                            </div>
                        </li>
                        <li>
                            <Avatar src={require("../res/img/avatar/1.jpg")} size="large" />
                            <div>
                                <span>林允儿</span>
                                <p>允儿林允儿林允儿儿林允儿允儿林允儿林允儿儿林允儿</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <Nav />,
    document.getElementById("nav")
);

ReactDOM.render(
    <Chat />,
    document.getElementById("page")
);