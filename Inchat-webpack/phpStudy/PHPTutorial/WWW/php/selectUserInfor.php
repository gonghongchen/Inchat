<?php
	
/**
 * @description 查找特定用户的资料
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

$userId = $_GET["userId"];
if (!$userId || $userId === "0") {	//查询当前登录用户的资料
	$userId = $_SESSION['userId'];
}
$sql = "SELECT * FROM userInfor where userId=" . $userId;
$result = $conn->query($sql);
$row = $result->fetch_assoc();
$data = $row;

//获取名字
$sql = "SELECT username FROM user where id=" . $userId;
$result = $conn->query($sql);
$row = $result->fetch_assoc();
$data["username"] = $row['username'];
echo json_encode($data);

$conn->close();

?>