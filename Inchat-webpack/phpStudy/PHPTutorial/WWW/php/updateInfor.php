<?php
	
/**
 * @description 更新用户资料
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

$avatar = $_POST["avatar"];
$gender = $_POST["gender"];
$birthday = $_POST["birthday"];
$intro = $_POST["intro"];
$location = $_POST["location"];

$sql = "UPDATE userInfor SET avatar='" . $avatar . "', gender='" . $gender . "', birthday='" . $birthday . "', intro='" . $intro . "', location='" . $location . "' where userId='" . $_SESSION["userId"] . "'";
if ($conn->query($sql) === TRUE) {
	echo "success";
} else {
	echo "error";
}

$conn->close();

?>