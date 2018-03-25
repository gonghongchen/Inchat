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


interface initProps {}

class RegisterForm extends React.Component<initProps & FormComponentProps, {}> {
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
                // console.log('Received values of form: ', values);
                Ajax({
                    url: "register.php",
                    data: values,
                    method: "post",
                    success(val) {
                        if(val === "success") {
                            //存储一些用户信息在本地
                            localStorage.userInfor = JSON.stringify({
                                username: values.username,
                                loginTime: new Date().getTime()
                            });
                            
                            toURL("index");
                        } else if(val === "registered") {
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
