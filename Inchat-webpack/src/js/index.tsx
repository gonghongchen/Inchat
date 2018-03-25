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
import { Menu, Icon, Input, Carousel } from 'antd';

const SubMenu = Menu.SubMenu,
    MenuItemGroup = Menu.ItemGroup,
    Search = Input.Search;

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
    handleClick = (e) => {
        console.log('click ', e);
        e.domEvent.stopPropagation();
        this.setState({
            current: e.key,
        });
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
                            onClick={this.handleClick}
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
                <div className="content">
                    
                </div>
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