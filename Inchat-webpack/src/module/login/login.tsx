/**
 * @description 登录
 * @author ghc
 */

import * as React from 'react';
import * as ReactDOM from "react-dom";
import { Input, Icon, Modal, Form, Button, Checkbox } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import "antd/dist/antd.less";
import "./login.css";

interface initProps {
    show: boolean
}

class LoginForm extends React.Component<initProps & FormComponentProps, {}> {
    state = {
        modalVisible: false
    }
    disabledProps: boolean = false
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
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <FormItem>
                    {getFieldDecorator('userName', {
                        rules: [{ required: true, whitespace:true, transform: value => value.replace(/\s*/g, ""), min:2, message: '请输入正确的用户名！' }],
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
                    <div className="login-mult-oper">
                        <a className="login-form-forgot">忘记密码？</a>
                        <a className="to-register">注册</a>
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
        this.setState({ modalVisible: nextProps.show });
    }
    /**
     * @description 设置state中的modalVisible值
     * @param modalVisible 显示与否
     */
    setModalVisible(modalVisible: boolean) {
        this.setState({ modalVisible });
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

export const Login = Form.create<initProps>()(LoginForm);