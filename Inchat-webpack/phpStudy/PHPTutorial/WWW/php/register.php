<?php
	
/**
 * @description login
 * @author ghc
 */

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

$username = $_POST["username"];
$userpwd = $_POST["password"];

$sql = "SELECT password FROM user where username='" . $username . "'";
$result = $conn->query($sql);
$dataCount = $result->num_rows;

if ($dataCount > 0) {	//有聊天记录数据
	// 此用户名已注册
	echo "registered";
} else{
	//注册
	$sql2 = "INSERT INTO user (username, password) VALUES ('" . $username . "', '" . $userpwd . "')";

	if ($conn->query($sql2) === TRUE) {
		echo "success";
	} else {
		echo "error";
	}
}

$conn->close();

?>