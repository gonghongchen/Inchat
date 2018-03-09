<?php
	
/*
 * Editor: gonghongchen
 * Description: select data from DB
 * Date: 2018-1-25 15:28:31
 * Unfinished: Where the "============================" appears
 */

session_start();

$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "websocket-test";

//接收客户端信息。动态改变获取聊天记录的来源的数据表
$stdin = fopen('php://stdin', 'r');
$line = fgets($stdin);
// $chatRecordingId = trim($line);	//数据ID，在CLI下用这行代码。正常运行时，用下面的两行代码。
$data = json_decode(trim($line), true);	//把JSON格式转为php中的数组格式
$chatRecordingId = $data["chatRecordingId"];

$oldChatContent = "";	//上一次获取的聊天记录内容
   
// 创建连接
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    echo("连接失败: " . $conn->connect_error) . "\n";
} else {
	echo "linkSuccess" . "\n";
}

//定时更新数据
$timeCount = 60;	//定时刷新以便从数据库获取最新数据的的次数
//$getDataCount = 0;	//已获取的数据条数

while($timeCount !== 0) {
	$sql = "SELECT modify_mark, content FROM chat_recording WHERE id = " . $GLOBALS['chatRecordingId'];
	$result = $conn->query($sql);
	$dataCount = $result->num_rows;
	
	if ($dataCount > 0) {	//有聊天记录数据
		// 输出数据
	    if ($row = $result->fetch_assoc()) {
	    	$content = $row["content"];
	    	
	    	if ($content !== $oldChatContent) {
	    		//这里直接将全部内容返回给客户端，直接让客户端处理数据
	    		echo $content . "\n";	//Notice："\n" is necessary. Because the server-end uses the Websocketd ！！！！！！！！！！！！！！！！
	    		
	    		$oldChatContent = $content;
	    	} else{
	    		echo "noNewChatContent" . "\n";
	    	}
	    }
	} else{
		echo "emptyChatContent" . "\n";
	}
	
	sleep(1);	//每隔1秒便从数据库获取最新数据
	$timeCount--;
}

$conn->close();

?>