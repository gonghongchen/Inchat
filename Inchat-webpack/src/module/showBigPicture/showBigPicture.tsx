/**
 * @description 查看大图
 * @author ghc
 */

import * as React from "react";
import * as ReactDOM from "react-dom";
import "./showBigPicture.css";

/**
 * @param visible 是否可见
 * @param pictureURL 图片路径
 * @param closeCallback 关闭时的回调函数——用于将父组件传递过来的visible值设置为false，以避免父组件调用setState时重复打开此组件
 */
interface initProps {
    visible: boolean
    pictureURL: string
    closeCallback: Function
};

export default class ShowBigPicture extends React.Component<initProps> {
    state = {
        visible: false,
        pictureURL: ""
    }
    closeCallback = null
    componentWillReceiveProps(nextProps) {
        this.setState({
            visible: nextProps.visible,
            pictureURL: nextProps.pictureURL
        });
        this.closeCallback = nextProps.closeCallback;
    }
    /**
     * @description 关闭大图
     */
    doClose(event): void {
        if (event.target.tagName === "DIV") {
            this.setState({
                visible: false,
                pictureURL: ""
            });
            this.closeCallback();
        }
    }
    render(): JSX.Element {
        return (
            <div onClick={this.doClose.bind(this)} style={{display: (this.state.visible ? "block" : "none")}} className="big-picture-bg fadeIn animated">
               <img src={this.state.pictureURL} />
            </div>
        )
    }
}