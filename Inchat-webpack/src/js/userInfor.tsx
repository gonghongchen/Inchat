/**
 * @description 我的资料
 * @author ghc
 */

import * as React from 'react';
import * as ReactDOM from "react-dom";
import "../css/minireset.css";
import "../css/style.css";

import Nav from "../module/nav/nav";
import "../css/userInfor.css";
import { Avatar, Button, Icon, Form, Input, Upload, DatePicker, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import { Ajax, toURL, doSelectPic, checkLogin } from "../module/common";
import PopupTitle from "../module/popupTitle/popupTitle";

let { TextArea } = Input,
    Option = Select.Option,
    userInfor = null;

Ajax({  //获取用户资料
    url: "selectUserInfor.php",
    data: {
        userId: 0
    },
    success(data) {
        userInfor = JSON.parse(data);
    },
    error(status) {
        window.location.reload();
    }
});

interface initProps {};
interface initState {};

class UserInfor extends React.Component < initProps, initState > {
    render(): JSX.Element {
        const gender = ((g) => {
                switch (g) {
                    case "保密":
                        return "性别保密";
                    case "女":
                        return <Icon type="woman" style={{color: "#ef5350"}} />;
                    case "男":
                        return <Icon type="man" style={{color: "#03a9f4"}} />;
                }
            })(userInfor.gender),
            year = ((b) => {
                /**
                 * @description 根据指定的秒速计算出到今天为止的年龄并格式化为指定的显示规则
                 * @param seconds 秒数
                 * @return "*岁"
                 */
                const formatYear = (seconds: number): string => {
                    /**
                     * @description 根据给定的日期对象，返回该对象的年月日
                     * @param seconds 秒数
                     * @return [年, 月, 日]
                     */
                    const getTime = (seconds? : number): number[] => {
                        let date = typeof seconds === "number" ? new Date(seconds) : new Date();
                        return [
                            date.getFullYear(),
                            date.getMonth() + 1,
                            date.getDate()
                        ];
                    };

                    let birthTime = getTime(seconds),
                        nowTime = getTime(),
                        spaceY = nowTime[0] - birthTime[0],
                        spaceM = nowTime[1] - birthTime[1],
                        spaceD = nowTime[2] - birthTime[2],
                        year = spaceM > 0 ? spaceY : (spaceM < 0 ? spaceY-1 : (spaceD >= 0 ? spaceY : spaceY-1));

                    return year + "岁";
                };

                b = Number.parseInt(b);

                return b === 0 ? "年龄未知" : formatYear(b);
            })(userInfor.birthday);

        return (
            <div className="max-width chat-box">
                <div className="left-card">
                    <div className="card-self">
                        <Avatar className="avatar" size="large" src={userInfor.avatar} />
                        <h3>{userInfor.username}</h3>
                        <div className="gender-year">
                            <span>{gender}</span>
                            <span>|</span>
                            <span>{year}</span>
                        </div>
                        <div className="user-location">
                            {userInfor.location}
                        </div>
                        <div>
                            {userInfor.intro}
                        </div>
                    </div>
                </div>
                <div className="right-card">
                    <div className="base-infor">
                        <span className="title">基本资料</span>
                        <div className="infor-form">
                            <BaseInforForm />
                        </div>
                    </div>
                    <div className="security-cate">
                        <span className="title">安全资料</span>
                        <div className="infor-form">
                            <SecurityInforForm />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

// 基本资料区域
class BaseInfor extends React.Component<{} & FormComponentProps, {}> {
    state = {
        avatar: userInfor.avatar,
        gender: userInfor.gender,
        birthday: userInfor.birthday,
        location: userInfor.location,
        intor: userInfor.intro
    }
    userInfor = null
    showPreViewPic(avatar): void {
        this.setState({
            avatar
        });
    }
    doClickSelPic(fileInput) {
        fileInput.click();
    }
    /**
     * @description 选择出生日期
     * @param date 日期对象
     * @param dateString 年-月-日
     */
    doSelDate(date, dateString) {
        let nowTime = new Date().getTime(),
            selTime = new Date(date._d).getTime();
        this.setState({
            birthday: (selTime > nowTime ? 0 : selTime).toString()   //对选择的时间大于现在的世界的情况做处理
        });
    }
    /**
     * @description 处理表单提交
     * @param event 
     */
    doSubmit(event) {
        const that = this;

        event.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (!checkLogin()) {
                    PopupTitle.show({
                        content: "请重新登录！",
                        cate: "warning"
                    });
        
                    return false;
                }
                
                values.avatar = this.state.avatar;
                values.birthday = this.state.birthday;

                console.log('Received values of form: ', values);
                Ajax({
                    url: "updateInfor.php",
                    data: values,
                    method: "post",
                    success(val) {
                        if(val === "success") {
                            window.location.reload();
                        } else {
                            PopupTitle.show({
                                content: "更新资料失败，请重试",
                                cate: "error"
                            });
                        }
                    },
                    error(status) {
                        PopupTitle.show({
                            content: "更新资料失败，请重试",
                            cate: "error"
                        });
                        console.log("error status: ", status);
                    }
                });
            }
        });
    }
    render(): JSX.Element {
        const { getFieldDecorator } = this.props.form,
            FormItem = Form.Item,
            birthday = ((b) => {
                b = Number.parseInt(b);
                if (b === 0) {
                    return null;
                } else {
                    let date = new Date(b),
                        month = (date.getMonth() + 1),
                        day = date.getDate();
                    return date.getFullYear() + "-" + (month > 9 ? month : "0"+month) + "-" + (day > 9 ? day : "0"+day);
                }
            })(this.state.birthday);

        return (
            <Form onSubmit={this.doSubmit.bind(this)}>
                <FormItem>
                    <span className="avatar-box" onClick={ () => { this.doClickSelPic.bind(this)(this.refs.fileInput) } }>
                        <input type="file" onChange={doSelectPic.bind(null, this.showPreViewPic.bind(this), 400)} ref="fileInput" style={{ display: "none" }} />
                        <Avatar className="avatar" size="large" src={this.state.avatar} />
                    </span>
                </FormItem>
                <FormItem>
                    {getFieldDecorator('gender', {
                        rules: [{required: true, message: '请选择性别!'}],
                        initialValue: this.state.gender
                    })(
                        <Select style={{ width: '160px', fontWeight: "bold" }} placeholder="性别">
                            <Option value="男">男</Option>
                            <Option value="女">女</Option>
                            <Option value="保密">保密</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('birthday', {
                        rules: [{ type: 'object', required: false, message: '请选择生日日期!' }],
                    })(
                        <DatePicker onChange={this.doSelDate.bind(this)} placeholder={birthday || "生日日期"} style={{ width: '160px' }} />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('location', {
                        rules: [{ required: true, whitespace:true, min:2, message: '请输入正确的所在地！' }],
                        initialValue: this.state.location
                    })(
                        <Input placeholder="所在地（大于2个字符）" style={{ width: '260px' }} />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('intro', {
                        rules: [{ required: true, whitespace:true, min:20, message: '请输入正确的个人简介！' }],
                        initialValue: this.state.intor
                    })(
                        <TextArea autosize={{ minRows: 3, maxRows: 5 }} placeholder="个人简介（大于20个字符）" />
                    )}
                </FormItem>
                <Button type="primary" htmlType="submit" className="submit-form-button" onClick={this.doSubmit.bind(this)}>修改</Button>
            </Form>
        )
    }
}
const BaseInforForm = Form.create<{}>()(BaseInfor);


// 安全资料区域
class SecurityInfor extends React.Component<{} & FormComponentProps, {}> {
    /**
     * @description 第二次密码输入确认
     * @param rule 
     * @param value 输入框的值
     * @param callback 处理后的提示内容
     */
    compareToFirstPassword(rule, value, callback) {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('两次输入的密码不一致！');
        } else {
            callback();
        }
    }
    /**
     * @description 处理表单提交
     * @param event 
     */
    doSubmit(event) {
        const that = this;
        event.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (values.oldPassword === values.password) {
                    PopupTitle.show({
                        content: "新密码不能和原密码一样",
                        cate: "warning"
                    });
        
                    return false;
                }

                if (!checkLogin()) {
                    PopupTitle.show({
                        content: "请重新登录！",
                        cate: "warning"
                    });
        
                    return false;
                }

                // console.log('Received values of form: ', values);
                Ajax({
                    url: "updateSecurityInfor.php",
                    data: values,
                    method: "post",
                    success(val) {
                        if(val === "samePassword") {
                            PopupTitle.show({
                                content: "新密码不能和原密码一样",
                                cate: "warning"
                            });
                        } else if(val === "oldPasswordError") {
                            PopupTitle.show({
                                content: "原密码错误，请重新输入",
                                cate: "error"
                            });
                        } else if(val === "success") {
                            PopupTitle.show({
                                content: "密码已更新"
                            });
                            setTimeout(() => {
                                window.location.reload();
                            }, 2000);
                        } else {
                            PopupTitle.show({
                                content: "更新密码失败，请重试",
                                cate: "error"
                            });
                        }
                    },
                    error(status) {
                        PopupTitle.show({
                            content: "更新密码失败，请重试",
                            cate: "error"
                        });
                        console.log("error status: ", status);
                    }
                });
            }
        });
    }
    render(): JSX.Element {
        const { getFieldDecorator } = this.props.form,
            FormItem = Form.Item;

        return (
            <Form onSubmit={this.doSubmit.bind(this)}>
                <FormItem>
                    {getFieldDecorator('oldPassword', {
                        rules: [{ required: true, whitespace:true, pattern:/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/, message: '密码格式不正确！' }],
                    })(
                        <Input type="password" placeholder="原密码(由6-16位字母和数字组成)" style={{ width: '260px' }} />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, whitespace:true, pattern:/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/, message: '密码格式不正确！' }],
                    })(
                        <Input type="password" placeholder="新密码(由6-16位字母和数字组成)" style={{ width: '260px' }} />
                    )}
                </FormItem>
                <FormItem>  
                    {getFieldDecorator('confirm', {
                        rules: [{ required: true, message: "请再次输入密码！" }, { validator: this.compareToFirstPassword.bind(this) }],
                    })(
                        <Input type="password" placeholder="确认密码" style={{ width: '260px' }} />
                    )}
                </FormItem>
                <Button type="primary" htmlType="submit" className="submit-form-button" onClick={this.doSubmit.bind(this)}>修改</Button>
            </Form>
        )
    }
}
const SecurityInforForm = Form.create<{}>()(SecurityInfor);


ReactDOM.render(
    <Nav />,
    document.getElementById("nav")
);

ReactDOM.render(
    <UserInfor />,
    document.getElementById("page")
);