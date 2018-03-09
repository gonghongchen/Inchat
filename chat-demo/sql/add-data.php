<?php

/*
 * Editor: gonghongchen
 * Description: put the client message into DB
 * Date: 2018-1-25 15:28:39
 * Unfinished: Where the "============================" appears
 */

$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "websocket-test";
$chatRecordingId = 0;	//数据ID

//$getMessageCount = 0;	//收到来自客户端的消息的次数
   
// 创建连接
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
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
	
	if ($data["dataType"] === "chatContentData") {	//接收到的数据是用户存入数据库的数据
		$sql = "UPDATE chat_recording SET content = '" . json_encode($data["chatContentData"], JSON_UNESCAPED_UNICODE) . "' WHERE id = " . $GLOBALS['chatRecordingId'];	//【JSON_UNESCAPED_UNICODE】的意思是不对汉字进行转码
		
		if ($conn->query($sql) === TRUE) {
		    echo "update succeed" . "\n";
		} else {
		    echo "update fail: " . $sql . "<br>" . $conn->error . "\n";
		}
	} else {	//接收到的数据是用户存入数据的对应的数据ID号
		$GLOBALS['chatRecordingId'] = $data["chatRecordingId"];
	}
}

$conn->close();

?>