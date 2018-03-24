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
import { Carousel } from 'antd';

interface initProps {};
interface initState {};

export default class Index extends React.Component < initProps, initState > {
    bannerPicsURL = [   //banner图片（此处不需要写路径，默认放在【res/img/banner】下）
        "1.jpg",
        "2.jpg",
        "3.jpg",
        "4.jpg"
    ]
    render(): JSX.Element {
        return (
            <div>
                <Nav />
                <div className="banner max-width">
                    <Carousel autoplay>
                        {
                            this.bannerPicsURL.map((url, index) => 
                                <div className="banner-pic" key={"banner" + index} style={{ backgroundImage: `url(${require("../res/img/banner/" + url)})`, height: "380px" }}></div>
                            )
                        }
                    </Carousel>
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
    <Index />,
    document.getElementById("page")
);