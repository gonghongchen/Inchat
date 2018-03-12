/**
 * @description 注册
 * @author ghc
 */

import * as React from 'react';
import * as ReactDOM from "react-dom";
import { Input, Icon, Modal, Form, Button, Checkbox } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import { Login } from "../module/login/login";
import "antd/dist/antd.less";
import "../css/register.css";

interface initProps {}

class RegisterForm extends React.Component<initProps & FormComponentProps, {}> {
    state = {
        showModal: false,
        normalOpen: true
    }
    render(): JSX.Element {
        const { getFieldDecorator } = this.props.form,
            FormItem = Form.Item;

        return(
            <div>
                <Form onSubmit={this.handleSubmit.bind(this)} className="register-form">
                    <FormItem>
                    {getFieldDecorator('userName', {
                        rules: [{ required: true, whitespace:true, min:2, message: '请输入正确的用户名！' }],
                    })(
                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名(大于2个字符)" />
                    )}
                    </FormItem>
                    <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, whitespace:true, pattern:/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/, message: '请输入正确的密码！' }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码(字母和数字组成，长度为6-16)" />
                    )}
                    </FormItem>
                    <FormItem>  
                    {getFieldDecorator('confirm', {
                        rules: [{ required: true, message: "请再次输入密码！" }, { validator: this.compareToFirstPassword.bind(this) }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="确认密码" />
                    )}
                    </FormItem>
                    <FormItem>
                        <div className="register-mult-oper">
                            <span className="register-form-forgot">点击注册即表示同意用户协议</span>
                            <a className="to-login" onClick={this.showLoginModal.bind(this)}>登录</a>
                        </div>
                        <Button type="primary" htmlType="submit" onClick={this.handleSubmit.bind(this)} className="register-form-button">注册</Button>
                    </FormItem>
                </Form>
                <Login show={this.state.showModal} normalOpen={this.state.normalOpen} />
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
     * @description 打开登录弹出框
     * @param event 
     */
    showLoginModal(event) {
        event.preventDefault();
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
                console.log('Received values of form: ', values);
            }
        });
    }
}

const Register = Form.create<initProps>()(RegisterForm);
ReactDOM.render(
    <Register />,
    document.getElementById("register-form-box")
);
