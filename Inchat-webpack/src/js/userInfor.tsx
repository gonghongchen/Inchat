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
import { Avatar, Button, Icon, Form, Input, Upload } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import { Ajax, toURL, doSelectPic, checkLogin } from "../module/common";
import PopupTitle from "../module/popupTitle/popupTitle";

const { TextArea } = Input;

interface initProps {};
interface initState {};

class UserInfor extends React.Component < initProps, initState > {
    render(): JSX.Element {
        return (
            <div className="max-width chat-box">
                <div className="chat-left">
                    <div className="chat-self">
                        <Avatar className="avatar" size="large" src={require("../res/img/avatar/1.jpg")} />
                        <h3>林允儿</h3>
                        <div className="chat-num">
                            <span><Icon type="woman" style={{color: "#ff404a"}} /></span>
                            <span>|</span>
                            <span>21岁</span>
                        </div>
                        <div>
                            这里是用户简介
                        </div>
                        <div className="chat-style">
                            <span>吃货</span><span>颜控</span><span>吃货</span><span>颜控</span><span>吃货</span><span>颜控</span>
                        </div>
                    </div>
                </div>
                <div className="chat-right">
                    <div className="chat-cate">
                        <span className="cate-title">基本资料</span>
                        <div className="infor-form">
                            <BaseInforForm />
                        </div>
                    </div>
                    <div className="chat-cate">
                        <span className="cate-title">安全资料</span>
                        <div className="infor-form">
                            
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
        chatCoverPicURL: ""
    }
    showPreViewPic(chatCoverPicURL): void {
        this.setState({
            chatCoverPicURL
        });
    }
    doClickSelPic(fileInput) {
        fileInput.click();
    }
    /**
     * @description 处理表单提交
     * @param event 
     */
    handleSubmit(event) {
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
                
                values.chatCoverPicURL = this.state.chatCoverPicURL;
                console.log('Received values of form: ', values);
                Ajax({
                    url: "createChat.php",
                    data: values,
                    method: "post",
                    success(val) {
                        if(val) {   //创建成功
                            window.location.reload();
                        } else {
                            PopupTitle.show({
                                content: "创建失败，请重试",
                                cate: "error"
                            });
                        }
                    },
                    error(status) {
                        PopupTitle.show({
                            content: "创建失败，请重试",
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
            <Form onSubmit={this.handleSubmit.bind(this)}>
                <span className="avatar-box" onClick={ () => { this.doClickSelPic.bind(this)(this.refs.fileInput) } }>
                    <input type="file" onChange={doSelectPic.bind(null, this.showPreViewPic.bind(this), 400)} ref="fileInput" style={{ display: "none" }} />
                    <Avatar className="avatar" size="large" src={this.state.chatCoverPicURL} />
                </span>
                <FormItem>
                    {getFieldDecorator('chatIntro', {
                        rules: [{ required: false, whitespace:true, min:20, message: '请输入正确的个人简介！' }],
                    })(
                        <TextArea autosize={{ minRows: 3, maxRows: 5 }} placeholder="个人简介（大于20个字符）" />
                    )}
                </FormItem>
            </Form>
        )
    }
}
const BaseInforForm = Form.create<{}>()(BaseInfor);


ReactDOM.render(
    <Nav />,
    document.getElementById("nav")
);

ReactDOM.render(
    <UserInfor />,
    document.getElementById("page")
);