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
import { Ajax, toURL, doSelectPic, checkLogin } from "../module/common";
import PopupTitle from "../module/popupTitle/popupTitle";

const express = require("../config/config.express.json");

if (!checkLogin()) {
    PopupTitle.show({
        content: "请您登录后再访问本页面",
        cate: "error"
    });
    setTimeout(toURL("index"), 2000);
}

interface initProps {};
interface initState {};

export default class Chat extends React.Component < initProps, initState > {
    state = {
        isFollow: false,    //是否关注的标识
        uploadPopVisible: false,    //上传图片的气泡卡片是否可见
        selectedPic: "",    //选择的图片数据
        chatContentList: [] //聊天内容列表
    }
    isFollow = false
    chatId = 0
    addChatConWS = null
    chatContentListUL = null
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
    updateChatConList(chatContentList) {
        this.setState({
            chatContentList
        });

        let chatContentListUL = this.chatContentListUL;
        chatContentListUL["scrollTop"] = chatContentListUL["scrollHeight"]; //更新消息列表后跳转到列表页面底部
    }
    /**
     * @description 创建查询聊天记录的websocket
     */
    createSelChatConWS() {
        let ws = new WebSocket('ws://localhost:8082/'),		//对应的【websocket】服务器地址， 【select-data.php】。
            self = this,
            currentUserId = this.chatInfor.currentUserId;
        
        ws.onopen = function() {
            ws.send(JSON.stringify({	//建立连接后先把对应的数据表ID发送过去，以便获取对应的数据内容。
                chatId: self.chatInfor.chatId
            }));
        };
        //接收到消息
        ws.onmessage = function(event) {
            let data = (() => {
                    try {
                        return JSON.parse(event.data);
                    } catch (error) {
                        return event.data;
                    }
                })(),
                chatContentList = self.state.chatContentList,
                htmlDecode = (str) => {
                    let s = str.replace(/&amp;/g, "&"); 
                    s = s.replace(/&lt;/g, "<"); 
                    s = s.replace(/&gt;/g, ">"); 
                    s = s.replace(/&nbsp;/g, " "); 
                    s = s.replace(/&#39;/g, "\'"); 
                    s = s.replace(/&quot;/g, "\""); 
                    s = s.replace(/<br>/g, "\n"); 
                    return s; 
                };
            console.log("data:   ", data);

            if(data instanceof Array) {
                let newConList = data.map((item) => {
                    return (
                        <li key={Math.random()} className={(item.userId === currentUserId ? "right" : "") + " flipInX" + " animated"}>
                            <Avatar data-userid={item.userId} src={item.avatar} size="large" />
                            <div className="infor">
                                <span>{item.username}</span>
                                <p>{/^data:image\/jpeg;base64/.test(item.content) ? <img src={item.content}/> : htmlDecode(item.content)}</p>
                            </div>
                        </li>
                    );
                });
                chatContentList = chatContentList.concat(newConList);
                console.log(chatContentList);
                self.updateChatConList(chatContentList);
            } else if (data === "noNewChatContent") {	//没有新的聊天记录
                console.log("%c没有新的聊天记录", "color: #2196F3");
        
                return;
            } else if (data === "linkSuccess") {	//连接成功
                console.log("%c连接服务器成功，可以开始聊天了……", "color: #4CAF50");
        
                return;
            } else {
                console.log("%cUFO发来未知消息: ", "color: #f44336");
            }
        };
        ws.onclose = function() {
            console.log("%c连接已断开", "color: #FF5722");
            PopupTitle.show({
                content: ("聊天连接已断开，请刷新页面"),
                seconds: -1,
                cate: "warning"
            });
        };
    }
    /**
     * @description 创建发送聊天内容的websocket
     */
    createaddChatConWS() {
        let ws = new WebSocket('ws://localhost:8083/'),	//【add-data.php】
            self = this;
        ws.onopen = function() {
            ws.send(JSON.stringify({
                "dataType" : "chatId",
                "chatId" : self.chatInfor.chatId
            }));
        };
        this.addChatConWS = ws;
    }
    componentWillMount() {
        this.setState({
            isFollow: this.isFollow
        });
        this.createSelChatConWS();  //启动查询已有聊天记录的websocket
        this.createaddChatConWS();  //启动发送新的聊天记录的websocket
    }
    componentDidMount() {
        this.chatContentListUL = this.refs.chatContentListUL;
    }
    /**
     * @description 处理点击【表情 | 图片】等icon时的事件
     * @param event 
     */
    doClickIcon(event) {
        if (event.target.tagName === "I") {
            event.stopPropagation();
            if (event.target.getAttribute("data-type") === "picture") { //选择图片
                
            }
        }
    }
    showPreViewPic(selectedPic): void {
        this.setState({
            selectedPic
        });
        this.uploadPop(true);   //展示上传图片的气泡卡片
    }
    doClickSelPic(fileInput) {
        fileInput.click();
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
            let chatContentArea = this.refs.chatContentArea;
            chatContentArea["value"] = chatContentArea["value"] + event.target.innerText;
        }
    }
    /**
     * @description 发送聊天数据
     */
    sendMess(event) {
        let chatContentArea = this.refs.chatContentArea,
            htmlEncode = (str) => {
                if (str.length === 0) return ""; 
                let s = str.replace(/&/g, "&amp;"); 
                s = s.replace(/</g, "&lt;");
                s = s.replace(/>/g, "&gt;");
                s = s.replace(/ /g, "&nbsp;");
                s = s.replace(/\'/g, "&#39;");
                s = s.replace(/\"/g, "&quot;");
                s = s.replace(/\n/g, "<br>");
                return s;
            },
            content = htmlEncode(chatContentArea["value"].trim()),    //去除首尾的空白字符，并对换行转义
            userId = this.chatInfor.currentUserId;

        if (!content) {
            return false;
        }

        this.addChatConWS.send(JSON.stringify({
            dataType : "chatContent",
            chatContent: {
                time: new Date().getTime(),
                content,
                userId
            }
        }));
        chatContentArea["value"] = "";
    }
    /**
     * @description 发送图片
     */
    sendPicMess() {
        let userId = this.chatInfor.currentUserId,
            selectedPic = this.state.selectedPic;

        this.addChatConWS.send(JSON.stringify({
            dataType : "chatContent",
            chatContent: {
                time: new Date().getTime(),
                content: selectedPic,
                userId
            }
        }));

        this.uploadPop(false);
    }
    /**
     * @description 关注功能
     * @param isFollow 是否关注
     */
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
    /**
     * 控制上传图片气泡卡片的显示/隐藏
     */
    uploadPop(uploadPopVisible) {
        this.setState({
            uploadPopVisible
        });
    }
    render(): JSX.Element {
        const chatInfor = this.chatInfor,
            isFollow = this.state.isFollow,
            upPicLayout = (
                <div>
                    <div className="upload-pic" style={{backgroundImage: `url(${this.state.selectedPic})`}}></div>
                    <div className="upload-btns">
                        <Button size="small" onClick={this.uploadPop.bind(this, false)}>取消</Button>
                        <Button size="small" type="primary" onClick={this.sendPicMess.bind(this)}>发送</Button>
                    </div>
                </div>
            );

        return (
            <div className="max-width chat-box">
                <div className="chat-title">
                    {chatInfor.chatName}
                    {
                        chatInfor.userId === chatInfor.currentUserId ? <Icon type="heart-o" title="我是主人" style={{color: "rgb(239, 83, 80)", marginLeft: 10}} /> : //自己不能关注自己创建的群聊
                        (
                            isFollow ? 
                            <Icon type="heart" onClick={this.follow.bind(this, false)} title="取消关注" style={{color: "rgb(239, 83, 80)", marginLeft: 10, cursor: "pointer"}} /> : 
                            <Icon type="heart-o" onClick={this.follow.bind(this, true)} title="关注" style={{color: "#fff", marginLeft: 10, cursor: "pointer"}} />
                        )
                    }
                </div>
                <div className="chat-window">
                    <ul className="chat-window-mess" ref="chatContentListUL">
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
                                <p><img src={require("../res/img/register-bg.jpg")}/></p>
                            </div>
                        </li>
                        {
                            this.state.chatContentList || "没有新的聊天内容哦"
                        }
                    </ul>
                    <div className="chat-window-edit">
                        <div className="icons" onClick={this.doClickIcon.bind(this)}>
                            <Popover content={this.setExpress.bind(this)()}>
                                <Icon type="smile-o" data-type="express" />
                            </Popover>
                            <input type="file" onChange={doSelectPic.bind(null, this.showPreViewPic.bind(this), 800)} ref="fileInput" style={{ display: "none" }} />
                            <Popover content={upPicLayout} visible={this.state.uploadPopVisible} trigger="click">
                                <Icon type="picture" data-type="picture" onClick={ () => { this.doClickSelPic.bind(this)(this.refs.fileInput) } } />
                            </Popover>
                        </div>
                        <textarea ref="chatContentArea"></textarea>
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