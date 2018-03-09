/**
 * @description 窗口右上角的弹出提示框
 * @author ghc
 */

import * as React from "react";
import * as ReactDOM from "react-dom";
import "animate.css";
import "./popupTitle.css";

interface initProps {
    config: {
        content: string,
        cate ? : string,
        seconds ? : number
    }
};
interface initState {};

export default class PopupTitle extends React.Component<initProps, initState> {
    static popupTitleFrame = null
    render(): JSX.Element {
        const config: any = this.props.config,
            iStyle = {
                backgroundImage: "url(" + require(`../../res/icon/${config.cate || "success"}.png`) + ")",
            };

        return(
            <div className="pop-title-box rotateInUpRight animated">
               <i className="cate" style={iStyle}></i>
               <span className="content" title={config.content}>{config.content}</span>
               <i className="close" onClick={this.doClose.bind(this)}>&times;</i>
            </div>
        )
    }
    /**
     * @description 显示弹出提示框
     * @param content 提示内容
     * @param cate 提示类型，可以是【success】，【error】，【warning】
     * @param seconds 提示框显示时间，单位是秒(s)，默认【5】，如果传入为【-1】则表示手动关闭
     */
    static show(config: initProps["config"] = {
        content: "popupTitle",
    }): void {
        const popupTitleFrame = PopupTitle.popupTitleFrame || (() => {
            const div = document.createElement("div");

            div.className = "popup-title-frame";
            PopupTitle.popupTitleFrame = div;
            document.body.appendChild(div);

            return div;
        })(),
        parDiv = document.createElement("div"),
        seconds = config.seconds || 5;

        ReactDOM.render(
            <PopupTitle config={config} />,
            popupTitleFrame.appendChild(parDiv)
        );

        if (seconds !== -1) {    //需要自动关闭弹出框
            setTimeout(() => {
                try {
                    popupTitleFrame.removeChild(parDiv);    //在自动关闭前可能已经手动关闭了
                } catch (error) {
                    console.log("Closed");
                }
            }, seconds * 1000);
        }
    }
    /**
     * @description 销毁弹出提示框（自动调用）
     * @param event 
     */
    doClose(event): void {
        const div = event.currentTarget.parentElement.parentElement;
        div.parentElement.removeChild(div);
    }
}