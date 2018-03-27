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
import { Avatar, Button, Icon } from 'antd';

interface initProps {};
interface initState {};

export default class MyChat extends React.Component < initProps, initState > {
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
                        <Button type="primary" onClick={this.createNewChat.bind(this)}>
                            <Icon type="plus" />创建新群聊
                        </Button>
                    </div>
                </div>
                <div className="chat-right">

                </div>
            </div>
        )
    }
    createNewChat() {
        console.log("点击创建新的群聊");
    }
}

ReactDOM.render(
    <Nav />,
    document.getElementById("nav")
);

ReactDOM.render(
    <MyChat />,
    document.getElementById("page")
);