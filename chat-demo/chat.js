/*
 * Editor: gonghongchen
 * Description: a demo js file of simple chat
 * Date: 2018-1-25 15:28:46
 * Unfinished: Where the "============================" appears
 */

let userName = "",
	errorParameter = (functionName, parameter, value, type) => {
		if (typeof value !== type) {
			throw new Error("The parameter [" + parameter + "] of function " + functionName + " must be a " + type + ". And your parameter is [" + value + "], its type is [" + typeof value + "].");
		}
	},
	millisecondToDate = (millisecond) => {
		//毫秒转具体日期：如 2018-01-01 01:01:01
		errorParameter(millisecondToDate, "millisecond", millisecond, "number");
		
		let date = new Date(millisecond),
			toTwoNum = (num) => {
				//将时间中的一位数字添加【0】变成两位数
				
				return num > 9 ? num : "0" + num;
			};
		
		return date.getFullYear() + "-" + toTwoNum(date.getMonth() + 1) + "-" + toTwoNum(date.getDate()) + " " + toTwoNum(date.getHours()) + ":" + toTwoNum(date.getMinutes()) + ":" + toTwoNum(date.getSeconds());
	},
	localChatData = {
		/*
		 * 属性名表示对应的数据表里面的数据项id，【data】表示本地已有的数据，【length】表示本地已有数据的长度
		 */
		"47" : {
			data : [],
			length : 0
		}
	};		//本地聊天记录

document.getElementById("submit-userName").onclick = function() {
	let name = document.getElementById("userName-input").value.trim();

	if(name) {
		userName = name;
		document.getElementById("userName-box").innerHTML = "我的用户名是：" + name;
	} else {
		alert("用户名不能为空");
	}
};

var ws = new WebSocket('ws://localhost:8082/');		//对应的【websocket】服务器地址， 【select-data.php】。这个可以独立成一个【Config】数据表============================
ws.onopen = function() {
	ws.send(JSON.stringify({	//把对应的数据表发送过去，以便获取对应的数据内容。这个可以独立成一个【Config】数据表============================
		"chatRecordingId" : 47
	}));
};
ws.onmessage = function(event) {
	let data = (() => {
			try {
				return JSON.parse(event.data);
			} catch(e) {
				return event.data;
			}
		})(),
		parent = document.getElementById('count');

	if(data instanceof Array) {
		let newChatContent = data.slice(localChatData["47"].length);
		
		newChatContent.forEach((itemObj) => {
			let p = document.createElement("p");

			p.innerHTML = "name: " + itemObj.name + "<br/>content: " + itemObj.content + "<br/>time: " + millisecondToDate(itemObj.time);
			parent.appendChild(p);
			
			localChatData["47"].length++;
			localChatData["47"].data.push(itemObj);
		});
	} else if (data === "noNewChatContent") {	//没有新的聊天记录
		console.log("%c没有新的聊天记录", "color: #2196F3");

		return;
	} else if (data === "linkSuccess") {	//连接成功
		console.log("%c连接服务器成功，可以开始聊天了……", "color: #4CAF50");

		return;
	} else if (data === "emptyChatContent") {	//此聊天刚刚创建，还没有聊天记录
		console.log("%c还没有聊天记录", "color: #2196F3");

		return;
	} else {
		console.log("%cUFO发来未知消息: ", "color: #f44336");
	}
};
ws.onclose = function() {
	console.log("%c连接已断开", "color: #FF5722");
};

var ws2 = new WebSocket('ws://localhost:8083/');	//【add-data.php】
ws2.onopen = function() {
	ws2.send(JSON.stringify({
		"dataType" : "chatRecordingId",
		"chatRecordingId" : 47
	}));
};
document.getElementById("submit-content").onclick = function() {
	let content = document.getElementById("content-input").value.trim();

	if(userName && content) {
		localChatData["47"].data.push({
			"name": userName,
			"content": content,
			"time" : new Date().getTime()
		});
		
		ws2.send(JSON.stringify({
			"dataType" : "chatContentData",
			"chatContentData" : localChatData["47"].data
		}));

		document.getElementById("content-input").value = "";

		return true;
	} else {
		alert("用户名及内容都不能为空！");

		return false;
	}
};