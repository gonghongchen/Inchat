/**
 * @description 导航栏
 * @author ghc
 */

import * as React from 'react';
import * as ReactDOM from "react-dom";
import "./nav.css";
import { Login } from "../login/login";

interface initProps {};

export default class Nav extends React.Component < initProps > {
    state = {
        showModal: false
    }
    render(): JSX.Element {
        return (
            <div className="nav">
                <div className="max-width nav-box">
                    <span className="logo">Inchat</span>
                    <span className="user-entry">欢迎您，请先<a className="link" href="../../register.html">注册</a>/ <a className="link" onClick={this.showLogin.bind(this)}>登录</a> </span>
                    <Login show={this.state.showModal}  normalOpen={true} />
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