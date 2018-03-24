/**
 * @description 登录
 * @author ghc
 */

import * as React from 'react';
import * as ReactDOM from "react-dom";
import { Input, Icon, Modal, Form, Button, Checkbox } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import { Ajax } from "../common";
import PopupTitle from "../popupTitle/popupTitle";
import "antd/dist/antd.less";
import "./login.css";

/**
 * @description 初始props数据
 * @param show 是否显示模态框
 * @param normalOpen 是否是正常打开模态框，若为false，则表示非正常，就不会打开模态框
 */
interface initProps {
    show: boolean,
    normalOpen: boolean
}

class LoginForm extends React.Component<initProps & FormComponentProps, {}> {
    state = {
        modalVisible: false
    }
    render(): JSX.Element {
        const { getFieldDecorator } = this.props.form,
            FormItem = Form.Item;
        return(
            <Modal
                title="登录"
                wrapClassName="vertical-center-modal"
                visible={this.state.modalVisible}
                onOk={this.handleSubmit.bind(this)}
                onCancel={this.setModalVisible.bind(this, false)}
                maskClosable={false}
                width="360px"
                okText="登录"
                cancelText="取消"
                confirmLoading={false}
                >
                <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
                    <FormItem>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, whitespace:true, min:2, message: '请输入正确的用户名！' }],
                    })(
                        <Input size="large" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
                    )}
                    </FormItem>
                    <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, whitespace:true, pattern:/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/, message: '请输入正确的密码！' }],
                    })(
                        <Input size="large" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
                    )}
                    </FormItem>
                    <div className="login-mult-oper">
                        <a className="login-form-forgot">忘记密码？</a>
                        <a className="to-register" onClick={this.toRegister.bind(this)}>注册</a>
                    </div>
                </Form>
            </Modal>
        )
    }
    /**
     * @description 接受父组件重新发送的props，并更新此组件（的state）
     * @param nextProps 父组件更新后的props的值
     */
    componentWillReceiveProps(nextProps) {
       if (nextProps.normalOpen) {
            this.setState({ modalVisible: nextProps.show });
       }
    }
    /**
     * @description 设置state中的modalVisible值
     * @param modalVisible 显示与否
     */
    setModalVisible(modalVisible: boolean) {
        this.setState({ modalVisible });
    }
    /**
     * @description 关闭登录弹出框并转到注册页面
     */
    toRegister() {
        const href = window.location.href;

        this.setModalVisible(false);

        window.location.href = href.substr(0, href.lastIndexOf("/") + 1) + "register.html";
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
                    url: "login.php",
                    data: values,
                    method: "post",
                    success(val) {
                        if(val === "success") {
                            PopupTitle.show({
                                content: "欢迎回家"
                            });
                        } else if(val === "error") {
                            PopupTitle.show({
                                content: "用户名或者密码错误",
                                cate: "error"
                            });
                        } else if(val === "noUser") {
                            PopupTitle.show({
                                content: "用户名不存在",
                                cate: "warning"
                            });
                        } else {
                            PopupTitle.show({
                                content: "登录失败，请重试",
                                cate: "error"
                            });
                        }
                    },
                    error(status) {
                        PopupTitle.show({
                            content: "登录失败，请重试",
                            cate: "error"
                        });
                        console.log("error status: ", status);
                    }
                });
            }
        });
    }
}

export const Login = Form.create<initProps>()(LoginForm);