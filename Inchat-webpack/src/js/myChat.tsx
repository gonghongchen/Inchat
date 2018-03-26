/**
 * @description 我的群聊
 * @author ghc
 */

import * as React from 'react';
import * as ReactDOM from "react-dom";
import "../css/minireset.css";
import "../css/style.css";

import Nav from "../module/nav/nav";


interface initProps {};
interface initState {};

export default class MyChat extends React.Component < initProps, initState > {
    render(): JSX.Element {
        return (
            <div></div>
        )
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