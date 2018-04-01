<?php
	
/**
 * @description login
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

$sql = "INSERT INTO chat (userId, chatName, chatIntro, chatCoverPicURL) VALUES ('" . $_SESSION['userId'] . "', '" . $chatName . "', '" . $chatIntro . "', '" . $chatCoverPicURL . "')";
if ($conn->query($sql) === TRUE) {
	echo true;
} else {
	echo false;
}

$conn->close();

?>