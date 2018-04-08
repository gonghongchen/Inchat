<?php

/**
 * @description 从指定的群里面查询聊天记录
 * @author ghc
 */
session_start();

$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "inchat";

//接收客户端信息。动态改变获取聊天记录的来源的数据表
$stdin = fopen('php://stdin', 'r');
$line = fgets($stdin);
// $chatId = trim($line);	//数据ID，在CLI下用这行代码。正常运行时，用下面的两行代码。
$data = json_decode(trim($line), true);	//把JSON格式转为php中的数组格式
$chatId = $data["chatId"];
   
// 创建连接
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    echo("连接失败: " . $conn->connect_error) . "\n";
} else {
	echo "linkSuccess" . "\n";
}

//向chat表里面新增访客记录
$sql = "SELECT chatVisitNum FROM chat WHERE chatId = " . $chatId;
$result = $conn->query($sql);
$row = $result->fetch_assoc();
$chatVisitNum = (int)$row["chatVisitNum"];
$chatVisitNum++;
$sql = "UPDATE chat SET chatVisitNum=" . $chatVisitNum . " WHERE chatId = " . $chatId;
$conn->query($sql);

//定时更新数据
$timeCount = 300;	//定时刷新以便从数据库获取最新数据的的次数
$hadChatContentCount = 0;	//已获取的聊天记录的条数

while($timeCount !== 0) {
	$sql = "SELECT chatContent FROM chatContent WHERE chatId = " . $GLOBALS['chatId'];
	$result = $conn->query($sql);
	$row = $result->fetch_assoc();
    $chatContent = $row["chatContent"];
    $chatContentArr = json_decode($chatContent, true);  //第二个参数为true，是为了防止后面的for循环里面的语句报“annot use object of type stdClass as array”错
    $chatContentCount = is_array($chatContentArr) ? count($chatContentArr) : 0;

    if ($chatContentCount === $hadChatContentCount) {
        echo "noNewChatContent" . "\n";
    } else {    //有新的聊天记录，则做以下处理
        $newChatContent = array_slice($chatContentArr, $hadChatContentCount);   //获取新的聊天记录
        $hadChatContentCount = $chatContentCount;   //更新已有数据条数
        $len = count($newChatContent);

        //遍历新的聊天记录，获取到各个用户的名字、头像等信息，并封装
        for ($i=0; $i < $len; $i++) { 
            //从user表中查询此用户的名字
            $sql = "SELECT username FROM user WHERE id = " . $newChatContent[$i]['userId'];
            $result = $conn->query($sql);
            $row = $result->fetch_assoc();
            $newChatContent[$i]["username"] = $row["username"];

            //从userInfor表中查询此用户的头像
            $sql = "SELECT avatar FROM userInfor WHERE userId = " . $newChatContent[$i]['userId'];
            $result = $conn->query($sql);
            $row = $result->fetch_assoc();
            $newChatContent[$i]["avatar"] = $row["avatar"];
        }
        
        //将新的聊天记录发送到前端
        echo json_encode($newChatContent) . "\n";	//Notice："\n" is necessary. Because the server-end uses the Websocketd ！！！！！！！！！！！！！！！！
    }
	
	sleep(1);	//每隔1秒便从数据库获取最新数据
	$timeCount--;
}

$conn->close();

?>