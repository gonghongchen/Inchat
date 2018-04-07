<?php

/**
 * @description 向指定群聊内容表里面添加新的聊天记录
 * @author ghc
 */

$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "inchat";
$chatId = 0;	//群聊的ID
   
// 创建连接
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo("linkFail: " . $conn->connect_error) . "\n";
} else {
	echo "linkSuccess" . "\n";
}
	
//接收客户端信息
$stdin = fopen('php://stdin', 'r');
while ($line = fgets($stdin)) {
	$message = trim($line);	//获取到的消息
	
	$data = json_decode($message, true);	//把JSON格式转为php中的数组格式
	
    if ($data["dataType"] === "chatContent") {	//接收到的数据是用户存入数据库的数据
        $sql = "SELECT chatContent FROM chatContent WHERE chatId=".$GLOBALS['chatId'];
        $result = $conn->query($sql);
        $row = $result->fetch_assoc();
        $chatContent = json_decode($row["chatContent"]);
        if (!$chatContent) {
            $chatContent = array();
        }
        array_push($chatContent, $data["chatContent"]);

		$sql = "UPDATE chatContent SET chatContent = '" . json_encode($chatContent, JSON_UNESCAPED_UNICODE) . "' WHERE chatId = " . $GLOBALS['chatId'];	//【JSON_UNESCAPED_UNICODE】的意思是不对汉字进行转码
		if ($conn->query($sql) === TRUE) {
		    echo "update succeed" . "\n";
		} else {
		    echo "update fail: " . $sql . "<br>" . $conn->error . "\n";
		}
	} else {	//接收到的数据是用户存入数据的对应的数据ID号
		$GLOBALS['chatId'] = $data["chatId"];
	}
}

$conn->close();

?>