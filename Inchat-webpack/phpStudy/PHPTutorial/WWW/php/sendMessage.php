<?php
	
/**
 * @description 发送私信
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

$receiverId = $_POST["receiverId"];
$content = $_POST["content"];
$time = $_POST["time"];
$senderId = $_SESSION['userId'];

$sql = "INSERT INTO message (senderId, receiverId, content, time) VALUES ('" . $senderId . "', '" . $receiverId . "', '" . $content . "', '" . $time . "')";
if ($conn->query($sql) === TRUE) {
	echo "success";
} else {
	echo "error";
}

$conn->close();

?>