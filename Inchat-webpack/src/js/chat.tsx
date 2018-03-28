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

const content = (
    <div>
        <p>Content</p>
        <p>Content</p>
    </div>
);

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
                            <Popover content={content}>
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