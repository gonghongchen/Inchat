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
        toURL(`index.html?chatId=${chatId}`, true);
    }
    render(): JSX.Element {
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
                <ul className="max-width container">
                    {
                        this.cardData.map(item => (
                            <li onClick={this.toDetailPage.bind(this, item.chatId)} key={ item.chatId + (Math.random()*1000).toFixed() }>
                                <Card
                                    style={{ width: 260 }}
                                    cover={<img alt="example" src={require("../res/img/" + item.coverPic)} />}
                                    hoverable={true}
                                >
                                    <Meta
                                        avatar={<Avatar src={require("../res/img/avatar/" + item.avatar)} size="large" />}
                                        title={ item.title }
                                        description={ item.description }
                                        style={{ height: 120 }}
                                    />
                                </Card>
                            </li>
                        ))
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