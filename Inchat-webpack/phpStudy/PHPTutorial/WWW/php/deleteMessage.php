<?php
	
/**
 * @description 删除私信
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

$messageId = $_GET["messageId"];
$cate = $_GET["cate"];
if ($cate === "send") {
	$sql = "UPDATE message SET senderDelete=1 where messageId='" . $messageId . "'";
} else {
	$sql = "UPDATE message SET receiverDelete=1 where messageId='" . $messageId . "'";
}

if ($conn->query($sql) === TRUE) {
	echo "success";
} else{
	echo "error";
}

$conn->close();

?>