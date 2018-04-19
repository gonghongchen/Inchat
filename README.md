# Inchat
Graduation Design

HTML(5) + CSS(3) + Typescript(ES6) + React + Webpack + Ant Design(UI) + WebSocketd + PHP + MySQL

Websocketd: in php(https://github.com/joewalnes/websocketd/wiki/PHP). Add a environment var "php" to local OS, the path is the installed path of php.exe. Then, put the websocketd.exe, count.php and count.html into a folder, like phpStudy->WWW->websocketd. Next "Git Base" in the folder. In the Base-face, using the command "websocketd --port=8080 php count.php" begins to open the server, next, in your browser, open the file "count.html", and you will see the result.


Home: 

# 问题&解决：
## 1 React里面的setState调用问题
### 问题：
例如：父组件F中存在子组件A，且父组件可控制它的显示与隐藏，子组件也可以控制自己的显示与隐藏，那么当在父组件F调用setState({visibleA: true})以通过componentWillReceiveProps的nextProps将显示信息传递给A以实现显示后，若A又在自己组件内通过调用了setState({visibleA: false})将自己隐藏了，那么此时由于在父组件F中，visibleA的值为true，故若此时又在父组件F中的其它地方调用了setState方法，那么子组件A就会由于在componentWillReceiveProps中接收到了值为true的visibleA而显示出来，而这显然是不希望出现的非正常显示。

### 解决：
我现在想到的解决方案是：子组件的Props接收一个叫做关闭回调函数的参数，接受到后保存在子组件的实例里面
```
componentWillReceiveProps(nextProps) {
    this.setState({
        visible: nextProps.visibleA
    });
    this.closeCallback = nextProps.closeCallback;
}
```
然后在子组件自己调用
```
doClose(): void {
    this.setState({
        visible: false
    });
    this.closeCallback();
}
```
将自己隐藏时再通过调用此关闭回调函数来将父组件中的visibleA设置为false，父组件里面写好这个关闭回调函数
```
closeCallback() {
    this.setState({
        visibleA: false
    });
}
```
并通过props传递过去就好了，如
```
<A visible={this.state.visibleA} closeCallback={this.closeCallback.bind(this)}/>
```
为什么不在子组件里面使用shouldComponentUpdate 进行是否更新的判断呢？
* 原因一：问题的根本在于父组件传递过来的值不合理，所以应该对症下药。
* 原因二：如果使用这个方法在子组件进行判断，那么当子组件进行正常的setState时也会进行判断，显然这是没有必要的。


### 问题：
为什么在Ajax成功后的success函数里面正确调用了setState函数，却不能改变指定的state的值？？？比如visitor.ts里面发送私信成功后关闭发送私信弹出框的功能

### 网站截图示例：
![Aaron Swartz](https://raw.githubusercontent.com/gonghongchen/Inchat/master/showPics/home.png)

![Aaron Swartz](https://raw.githubusercontent.com/gonghongchen/Inchat/master/showPics/chat.png)

![Aaron Swartz](https://raw.githubusercontent.com/gonghongchen/Inchat/master/showPics/myChat.png)

![Aaron Swartz](https://raw.githubusercontent.com/gonghongchen/Inchat/master/showPics/visitor.png)
