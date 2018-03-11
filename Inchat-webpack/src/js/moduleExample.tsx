/**
 * @description 模块示例
 * @author
 */

import * as React from 'react';
import * as ReactDOM from "react-dom";
import "../css/minireset.css";
import "../css/style.css";
import "../css/moduleExample.css";
import PopupTitle from "./../module/popupTitle/popupTitle";
import { DatePicker, Popover, Button } from 'antd';
import 'antd/dist/antd.less';

interface initProps {};
interface initState {};

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

export default class ModuleExample extends React.Component < initProps, initState > {
    render(): JSX.Element {
        return(
            <div>
                <input className="button success" type="button" value="success" onClick={this.doClick.bind(this, ["success", "正确", 3])} />
                <input className="button danger" type="button" value="danger" onClick={this.doClick.bind(this, ["error", "错误", -1])} />
                <input className="button" type="button" value="warning" onClick={this.doClick.bind(this, ["warning", "警告"])} />
                <input className="button" disabled type="button" value="弹出提示框" onClick={this.doClick.bind(this)} />
                <input className="input" type="text" placeholder="input..." />
                <a className="link" href="http://">a link github</a>
                <DatePicker onChange={this.onChange.bind(this)} />
                <br /><br />
                <MonthPicker onChange={this.onChange.bind(this)} placeholder="Select month" />
                <br /><br />
                <RangePicker onChange={this.onChange.bind(this)} />
                <br /><br />
                <WeekPicker onChange={this.onChange.bind(this)} placeholder="Select week" />
                <br /><br />
                <Popover placement="right" content="右侧提示内容" trigger="click">
                    <Button type="primary">Primary</Button>
                </Popover>
            </div>
        )
    }
    onChange(date, dateString) {
        console.log(date, dateString);
    }
    doClick([cate, content, seconds]): void {
        PopupTitle.show({
            cate,
            content,
            seconds
        });
    }
}

ReactDOM.render(
    <ModuleExample />,
    document.getElementById("div")
);