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

$avatar = $_POST["avatar"];
$gender = $_POST["gender"];
$birthday = $_POST["birthday"];
$intro = $_POST["intro"];
$location = $_POST["location"];

$sql = "SELECT password FROM user where username='" . $username . "'";
$result = $conn->query($sql);
$dataCount = $result->num_rows;
$data = array();	//注册状态及相关信息

if ($dataCount > 0) {
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
		$userId = $row["id"];
		
		// 通过 session 存储当前登录的用户名及用户ID
		$_SESSION['username'] = $username;
		$_SESSION['userId'] = $userId;

		//将用户的其它信息插入到用户信息表中
		$sql4 = "INSERT INTO userInfor (userId, avatar, gender, birthday, intro, location) VALUES ('" . $userId . "', '" . $avatar . "', '" . $gender . "', '" . $birthday . "', '" . $intro . "', '" . $location . "')";
		$conn->query($sql4);

		$data["userId"] = $userId;
		$data["mark"] = "success";
		echo json_encode($data);
	} else {
		$data["mark"] = "error";
		echo json_encode($data);
	}
}

$conn->close();

?>