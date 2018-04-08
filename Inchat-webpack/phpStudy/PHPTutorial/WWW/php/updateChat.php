<?php
	
/**
 * @description 修改群聊资料
 * @author ghc
 */

session_start();

$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "inchat";
   
// 创建连接
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    echo("连接失败: " . $conn->connect_error);
} else {
	// echo "linkSuccess";
}

$chatName = $_POST["chatName"];
$chatIntro = $_POST["chatIntro"];
$chatCoverPicURL = $_POST["chatCoverPicURL"];
$chatId = $_POST['chatId'];
$hasModify = $_POST['hasModify'];

if ($hasModify === "yes") {
	$sql = "UPDATE chat SET chatName='" . $chatName . "', chatIntro='" . $chatIntro . "', chatCoverPicURL='" . $chatCoverPicURL . "' WHERE chatId=".$chatId;
	if ($conn->query($sql) === TRUE) {
		echo "success";
	} else {
		echo "error";
	}
} else {
	echo "success";	//这里之所以输出success，是为了让前端刷新页面，但是实际上是没有操作数据库的
}


$conn->close();

?>