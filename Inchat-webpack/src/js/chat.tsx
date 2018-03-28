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

const express = require("../config/config.express.json");

interface initProps {};
interface initState {};

export default class Chat extends React.Component < initProps, initState > {
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
    render(): JSX.Element {
        return (
            <div className="max-width chat-box">
                <div className="chat-title">
                    群名字
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
                        <p>这里是简介的内容这里是简介的内容这里是简介的内容这里是简介的内容这里是简介的内容</p>
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
                    <p className="module-title">成员</p>
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