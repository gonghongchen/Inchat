/**
 * @description 导航栏
 * @author ghc
 */

import * as React from 'react';
import * as ReactDOM from "react-dom";
import "./nav.css";
import { Login } from "../login/login";
import { toURL } from "../common";
import { Dropdown, Menu, Icon } from 'antd';

const clickMenu = ({ key }) => {
        switch (key) {
            case "newMess":
                toURL("index");
                break;
            case "myChat":
                toURL("myChat");
                break;
            case "infor":
                toURL("index");
                break;
            case "logout":
                localStorage.removeItem("userInfor");
                toURL("index");
                break;
            default:
                break;
        }
    },
    menu = (
    <Menu onClick={clickMenu}>
        <Menu.Item key="newMess">
            <a>未读消息</a>
        </Menu.Item>
        <Menu.Item key="myChat">
            <a>我的群聊</a>
        </Menu.Item>
        <Menu.Item key="infor">
            <a>个人信息</a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
            <a>安全退出</a>
        </Menu.Item>
    </Menu>
);

interface initProps {};

export default class Nav extends React.Component < initProps > {
    state = {
        showModal: false
    }
    render(): JSX.Element {
        const userInfor = localStorage.userInfor && JSON.parse(localStorage.userInfor) || null,
            isLoginContent = userInfor ? 
                <div>
                    <div className="user-center">
                        <Dropdown overlay={menu}>
                            <a className="ant-dropdown-link">
                                个人中心 <Icon type="down" />
                            </a>
                        </Dropdown>
                    </div>
                    <span className="user-entry">欢迎您，{userInfor.username}</span>
                </div>
             : 
                <div>
                    <span className="user-entry">欢迎您，请先&nbsp;<a className="link" onClick={this.showLogin.bind(this)}>登录</a>&nbsp;/&nbsp;<a className="link" onClick={toURL.bind(null, "register")}>注册</a></span>
                    <Login show={this.state.showModal}  normalOpen={true} />
                </div>
            ;

        return (
            <div className="nav">
                <div className="max-width nav-box">
                    <span className="logo" onClick={toURL.bind(null)}>Inchat</span>
                    { isLoginContent }
                </div>
            </div>
        )
    }
    showLogin() {
        this.setState({
            showModal: true
        });
    }
}