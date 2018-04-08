<?php
	
/**
 * @description 创建群聊
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
$userId = $_SESSION['userId'];

$sql = "INSERT INTO chat (userId, chatName, chatIntro, chatCoverPicURL) VALUES ('" . $userId . "', '" . $chatName . "', '" . $chatIntro . "', '" . $chatCoverPicURL . "')";
if ($conn->query($sql) === TRUE) {
	$sql2 = "select last_insert_id()";
	$result = $conn->query($sql2);	//获取到刚刚创建的群的ID号
	$row = $result->fetch_assoc();
	$chatId = $row["last_insert_id()"];

	$sql3 = "INSERT INTO chatContent (chatId) VALUES (" . $chatId . ")";
	if ($conn->query($sql3) === TRUE) {	//向chatContent中新增刚刚创建的群的记录
		$sql4 = "SELECT createChatNum FROM userInfor WHERE userId=".$userId;	//拿到userInfor中的createChatNum，并加1
		$result4 = $conn->query($sql4);	//获取到刚刚创建的群的ID号
		$row4 = $result4->fetch_assoc();
		$createChatNum = (int)$row4["createChatNum"];
		$createChatNum++;

		$sql5 = "UPDATE userInfor SET createChatNum=".$createChatNum." WHERE userId=".$userId;
		if ($conn->query($sql5) === TRUE) {
			echo "success";
		} else {
			echo "error";
		}
	} else {
		echo "error";
	}
} else {
	echo "error";
}

$conn->close();

?>