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

$username = $_POST["username"];
$userpwd = $_POST["password"];

$sql = "SELECT password FROM user where username='" . $username . "'";
$result = $conn->query($sql);
$dataCount = $result->num_rows;
$data = array();	//注册状态及相关信息

if ($dataCount > 0) {	//有聊天记录数据
	// 此用户名已注册
	
	$data["mark"] = "registered";
	echo json_encode($data);
} else{
	//注册
	$sql2 = "INSERT INTO user (username, password) VALUES ('" . $username . "', '" . $userpwd . "')";

	if ($conn->query($sql2) === TRUE) {

		$sql3 = "SELECT id FROM user where username='" . $username . "'";
		$selResult = $conn->query($sql3);
		$row = $selResult->fetch_assoc();
		
		// 通过 session 存储当前登录的用户名及用户ID
		$_SESSION['username'] = $username;
		$_SESSION['userId'] = $row["id"];

		$data["userId"] = $row["id"];
		$data["mark"] = "success";
		echo json_encode($data);
	} else {
		$data["mark"] = "error";
		echo json_encode($data);
	}
}

$conn->close();

?>