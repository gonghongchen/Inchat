<?php
	
/**
 * @description 更新用户安全资料
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

$oldPassword = $_POST["oldPassword"];
$password = $_POST["password"];

if ($oldPassword === $password) {	//新旧密码不能一样
	echo "samePassword";
	exit;
}

$sql = "SELECT password FROM user WHERE id='" . $_SESSION["userId"] . "'";
$result = $conn->query($sql);
$row = $result->fetch_assoc();
if ($oldPassword === $row["password"]) {
	$sql2 = "UPDATE user SET password='" . $password . "' WHERE id='" . $_SESSION["userId"] . "'";
	if ($conn->query($sql2) === TRUE) {	//密码更新成功
		echo "success";
	} else {
		echo "error";
	}
} else {	//原密码错误
	echo "oldPasswordError";
}

$conn->close();

?>