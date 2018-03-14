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
	// 输出数据
	while ($row = $result->fetch_assoc()) {
		if($row["password"] === $userpwd) {
			echo "success";
		} else {
			echo "error";
		}
	}
} else{
	echo "noUser";
}

$conn->close();

?>