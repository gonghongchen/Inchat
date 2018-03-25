/**
 * @description 导航栏
 * @author ghc
 */

import * as React from 'react';
import * as ReactDOM from "react-dom";
import "./nav.css";
import { Login } from "../login/login";
import { toURL } from "../common";

interface initProps {};

export default class Nav extends React.Component < initProps > {
    state = {
        showModal: false
    }
    render(): JSX.Element {
        return (
            <div className="nav">
                <div className="max-width nav-box">
                    <span className="logo" onClick={toURL.bind(null)}>Inchat</span>
                    <span className="user-entry">欢迎您，请先<a className="link" onClick={toURL.bind(null, "register")}>注册</a>/ <a className="link" onClick={this.showLogin.bind(this)}>登录</a> </span>
                    
                </div>
                <Login show={this.state.showModal}  normalOpen={true} />
            </div>
        )
    }
    showLogin() {
        this.setState({
            showModal: true
        });
    }
}