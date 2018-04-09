/**
 * @description 注册
 * @author ghc
 */

import * as React from 'react';
import * as ReactDOM from "react-dom";
import { Input, Icon, Modal, Form, Button, Checkbox } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import { Login } from "../module/login/login";
import PopupTitle from "../module/popupTitle/popupTitle";
import { Ajax, toURL } from "../module/common";
import "antd/dist/antd.less";
import "../css/register.css";

if (localStorage.userInfor) {
    toURL("index");
}

interface initProps {}

class RegisterForm extends React.Component<initProps & FormComponentProps, {}> {
    constructor(props) {
        super(props);

        //获取用户所在的省市
        let doc = document;
        new Promise((resolve, reject) => {
            let script = doc.createElement("script");

            window["getLocation"] = (data) => {
                let ad_info = data.result.ad_info;

                resolve(ad_info.province + ad_info.city);
                doc.body.removeChild(script);
            };

            script.src = "https://apis.map.qq.com/ws/location/v1/ip?callback=getLocation&key=BRHBZ-EJ5CO-MLHWC-ST77T-Z2T2S-PNFSO&output=jsonp&_=1517991747755";
            doc.body.appendChild(script);
        }).then((posi: string): void => {
            this.initUserInfor.location = posi;
        });
    }
    //设置一些初始的用户信息
    initUserInfor = {
        avatar: "data:image/jpeg;base64,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",
        gender: "保密",
        birthday: "0",
        location: "地址不详",
        intro: "这个用户真懒，都懒得写简介╭(╯^╰)╮"
    }
    state = {
        showModal: false,
        normalOpen: true,
        checkCode: this.getCheckCode()
    }
    render(): JSX.Element {
        const { getFieldDecorator } = this.props.form,
            FormItem = Form.Item;

        return(
            <div className="register-box fadeIn animated">
                <div className="register-title">
                    <a onClick={toURL.bind(null)}>Inchat</a>
                    <span>注册</span>
                </div>
                <div className="register-form-box">
                    <Form onSubmit={this.handleSubmit.bind(this)} className="register-form">
                        <FormItem>
                        {getFieldDecorator('username', {
                            rules: [{ required: true, whitespace:true, min:2, message: '请输入正确的用户名！' }],
                        })(
                            <Input size="large" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名(大于2个字符)" />
                        )}
                        </FormItem>
                        <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, whitespace:true, pattern:/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/, message: '请输入正确的密码！' }],
                        })(
                            <Input size="large" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码(由6-16位字母和数字组成)" />
                        )}
                        </FormItem>
                        <FormItem>  
                        {getFieldDecorator('confirm', {
                            rules: [{ required: true, message: "请再次输入密码！" }, { validator: this.compareToFirstPassword.bind(this) }],
                        })(
                            <Input size="large" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="确认密码" />
                        )}
                        </FormItem>
                        <FormItem>  
                        {getFieldDecorator('checkCode', {
                            rules: [{ required: true, message: "请输入右边算式的计算结果！" }, { validator: this.doCheckCode.bind(this) }],
                        })(
                            <Input size="large" prefix={<Icon type="code-o" style={{ color: 'rgba(0,0,0,.25)' }} />} style={{ width: "180px" }} type="text" placeholder="计算结果" />
                        )}
                        <span className="check-code" title="点击更换算式" onClick={this.setCheckCode.bind(this)}>{this.state.checkCode}</span>
                        </FormItem>
                        <FormItem>
                            <div className="register-mult-oper">
                                <span className="register-form-forgot">点击注册即表示同意用户协议</span>
                                <a className="to-login" onClick={this.showLoginModal.bind(this)}>登录</a>
                            </div>
                            <Button type="primary" size="large" htmlType="submit" onClick={this.handleSubmit.bind(this)} className="register-form-button">注册</Button>
                        </FormItem>
                    </Form>
                    <Login show={this.state.showModal} normalOpen={this.state.normalOpen} />
                </div>
            </div>
        )
    }
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
     * @description 获取验证算式
     */
    getCheckCode() {
        const num1 = Number.parseInt((Math.random() * 8 + 1).toFixed(0)),   //随机生成一个【1-9】的正整数
            num2 = Number.parseInt((Math.random() * 8 + 1).toFixed(0)),
            oper = ["+", "-", "*"],
            randomOper = oper[(Math.random()*(oper.length - 1)).toFixed(0)];    //随机选择一个运算符

        return num1 > num2 ? (num1 + " " + randomOper + " " + num2) : (num2 + " " + randomOper + " " + num1);   //输出算式，且保证前大后小
    }
    /**
     * @description 设置新的验证算式
     */
    setCheckCode() {
        this.setState({
            checkCode: this.getCheckCode()
        });
    }
    /**
     * @description 验证码验证
     * @param rule 
     * @param value 输入框的值
     * @param callback 处理后的提示内容
     */
    doCheckCode(rule, value, callback) {
        if (value && value !== eval(this.state.checkCode).toString()) {
            callback('计算结果不正确！');
        } else {
            callback();
        }
    }
    /**
     * @description 打开登录弹出框
     * @param event 
     */
    showLoginModal(event) {
        event.preventDefault();
        event.stopPropagation();
        new Promise((success, error) => {
            this.setState({     //点击【登录】后正常打开登录弹出框
                showModal: true,
                normalOpen: true
            });

            success();
        }).then(() => {
            this.setState({     //正常打开登录弹出框后要立刻做如下设置以保证鼠标在点击表单域的其它部分时不会出现异常地打开登录弹出框
                showModal: false,
                normalOpen: false
            });
        });
    }
    /**
     * @description 处理表单提交
     * @param event 
     */
    handleSubmit(event) {
        event.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values = Object.assign(values, this.initUserInfor);
                console.log('Received values of form: ', values);
                Ajax({
                    url: "register.php",
                    data: values,
                    method: "post",
                    success(val) {
                        const data = JSON.parse(val),
                            mark = data.mark;

                        if(mark === "success") {
                            //存储一些用户信息在本地
                            localStorage.userInfor = JSON.stringify({
                                userId: data.userId,
                                username: values.username,
                                loginTime: new Date().getTime()
                            });
                            
                            toURL("index");
                        } else if(mark === "registered") {
                            PopupTitle.show({
                                content: "此用户名已被注册，请更换",
                                cate: "warning"
                            });
                        } else {
                            PopupTitle.show({
                                content: "注册失败，请重试",
                                cate: "error"
                            });
                        }
                    },
                    error(status) {
                        PopupTitle.show({
                            content: "注册失败，请重试",
                            cate: "error"
                        });
                        console.log("error status: ", status);
                    }
                });
            }
        });
    }
}

const Register = Form.create<initProps>()(RegisterForm);
ReactDOM.render(
    <Register />,
    document.body.appendChild(document.createElement("div"))
);
