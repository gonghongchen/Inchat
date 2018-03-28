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
import { Avatar, Button, Icon, Card } from 'antd';
import { Ajax, toURL } from "../module/common";

const { Meta } = Card;

interface initProps {};
interface initState {};

export default class MyChat extends React.Component < initProps, initState > {
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
     * @description 跳转到【设置 | 数据统计】页面
     * @param cate 点击的按钮类别
     */
    doChat(cate: string, event) {
        event.stopPropagation();
        
        console.log(cate);
        return false;
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
                        <Button type="primary" onClick={this.createNewChat.bind(this)}>
                            <Icon type="plus" />创建新群聊
                        </Button>
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
                                            actions={[<span onClick={this.doChat.bind(this, "setting")}><Icon type="setting" />&nbsp;设置</span>, <span onClick={this.doChat.bind(this, "chart")}><Icon type="bar-chart" />&nbsp;数据统计</span>]}
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