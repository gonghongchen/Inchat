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
import { Ajax, toURL, checkLogin } from "../module/common";
import PopupTitle from "../module/popupTitle/popupTitle";

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
        chatData: null
    }
    componentWillMount() {
        let chatData = null;

        Ajax({
            url: "selectChat.php",
            data: {
                target: "all", //查询的对象是所有用户
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

        this.setState({
            chatData
        });
    }
    /**
     * @description 从数据库获取到的各个群聊卡片的内容数据
     */
    // chatData = (() => {
    //     let chatData = null;

    //     Ajax({
    //         url: "selectChat.php",
    //         data: {
    //             target: "all", //查询的对象是所有用户
    //         },
    //         success(data) {
    //             data = JSON.parse(data);
    //             if (data.mark === "haveData") {
    //                 chatData = data.value;
    //             }
    //         },
    //         error(status) {
    //             console.log("error: ", status);
    //         }
    //     });

    //     return chatData;
    // })()
    handleClick(e) {
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
        if (!checkLogin()) {
            PopupTitle.show({
                content: "请您先登录哦",
                cate: "warning"
            });
            return false;
        }
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
    search(value) {
        value = value.trim();
        if (!value) {
            return;
        }
        
        let chatData = null;
        Ajax({
            url: "searchChat.php",
            data: {
                value
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

        this.setState({
            chatData
        });
    }
    render(): JSX.Element {
        const chatData = this.state.chatData,
            chatCardList = chatData ? ( //封装群聊卡片列表数据
                chatData.map(item => (
                    <li onClick={this.toDetailPage.bind(this, item.chatId)} key={ item.chatId } title="进入群聊">
                        <Card
                            style={{ width: 260 }}
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
                            {/* <Menu.Item key="popular">
                                <Icon type="heart-o" />热门
                            </Menu.Item> */}
                        </Menu>
                    </div>
                    <div className="search">
                        <Search
                            placeholder="点击回车搜索……"
                            onSearch={this.search.bind(this)}
                            style={{ width: 300 }}
                        />
                    </div>
                </div>
                <ul className="max-width chat-list">
                    {
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