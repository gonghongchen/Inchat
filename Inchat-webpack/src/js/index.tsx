/**
 * @description 首页
 * @author ghc
 */

import * as React from 'react';
import * as ReactDOM from "react-dom";
import "../css/minireset.css";
import "../css/style.css";

import "../css/index.css";
import Nav from "../module/nav/nav";
import { Menu, Icon, Input, Carousel, Card, Avatar } from 'antd';
import { Ajax, toURL } from "../module/common";

const SubMenu = Menu.SubMenu,
    MenuItemGroup = Menu.ItemGroup,
    Search = Input.Search,
    { Meta } = Card;

interface initProps {};
interface initState {};

export default class Index extends React.Component < initProps, initState > {
    bannerPicsURL = [   //banner图片（此处不需要写路径，默认放在【res/img/banner】下）
        "1.jpg",
        "2.jpg",
        "3.jpg",
        "4.jpg"
    ]
    state = {
        current: 'random',
    }
    /**
     * @description 从数据库获取到的各个群聊卡片的内容数据
     */
    chatData = (() => {
        let chatData = null;

        Ajax({
            url: "selectChat.php",
            data: {
                target: "all", //查询的对象是所有用户
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
    handleClick(e) {
        console.log('click ', e);
        e.domEvent.stopPropagation();
        this.setState({
            current: e.key,
        });
    }
    /**
     * @description 跳转到点击的群聊页面
     * @param chatId 对应群聊的ID号
     */
    toDetailPage(chatId: number) {
        console.log("chatId: ", chatId);
        toURL(`chat.html?chatId=${chatId}`, true);
    }
    render(): JSX.Element {
        const chatData = this.chatData,
            chatCardList = chatData ? ( //封装群聊卡片列表数据
                chatData.map(item => (
                    <li onClick={this.toDetailPage.bind(this, item.chatId)} key={ item.chatId }>
                        <Card
                            style={{ width: 260 }}
                            cover={ <div className="chatCoverPic" style={{backgroundImage: `url(${item.chatCoverPicURL})`}}></div> }
                            hoverable={true}
                            bodyStyle={{padding: 20}}
                            actions={[<span title="关注量"><Icon type="heart-o" />&nbsp;{ item.chatFollow }</span>, <span title="讨论量"><Icon type="message" />&nbsp;{ item.chatDiscuss }</span>]}
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
            <div>
                <div className="banner max-width">
                    <Carousel autoplay>
                        {
                            this.bannerPicsURL.map((url, index) => 
                                <div className="banner-pic" key={"banner" + index} style={{ backgroundImage: `url(${require("../res/img/banner/" + url)})`, height: "380px" }}></div>
                            )
                        }
                    </Carousel>
                </div>
                <div className="max-width nav-search">
                    <div className="cate-nav">
                        <Menu
                            onClick={this.handleClick.bind(this)}
                            selectedKeys={[this.state.current]}
                            mode="horizontal"
                            style={{backgroundColor: "#f4f4f4"}}
                        >
                            <Menu.Item key="random">
                                <Icon type="bulb" />发现
                            </Menu.Item>
                            <Menu.Item key="popular">
                                <Icon type="heart-o" />热门
                            </Menu.Item>
                        </Menu>
                    </div>
                    <div className="search">
                        <Search
                            placeholder="点击回车搜索……"
                            onSearch={value => console.log(value)}
                            style={{ width: 300 }}
                        />
                    </div>
                </div>
                <ul className="max-width chat-list">
                    {
                        // this.cardData.map(item => (
                        //     <li onClick={this.toDetailPage.bind(this, item.chatId)} key={ item.chatId + (Math.random()*1000).toFixed() }>
                        //         <Card
                        //             style={{ width: 260 }}
                        //             cover={<img alt="example" src={require("../res/img/" + item.coverPic)} />}
                        //             hoverable={true}
                        //             bodyStyle={{padding: 20}}
                        //             actions={[<span title="关注量"><Icon type="heart-o" />&nbsp;99</span>, <span title="讨论量"><Icon type="message" />&nbsp;999+</span>]}
                        //         >
                        //             <Meta
                        //                 avatar={<Avatar src={require("../res/img/avatar/" + item.avatar)} size="large" />}
                        //                 title={ item.title }
                        //                 description={ item.description }
                        //                 style={{ height: 80 }}
                        //             />
                        //         </Card>
                        //     </li>
                        // ))
                        chatCardList
                    }
                </ul>
                <div className="footer">
                    
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <Nav />,
    document.getElementById("nav")
);

ReactDOM.render(
    <Index />,
    document.getElementById("page")
);