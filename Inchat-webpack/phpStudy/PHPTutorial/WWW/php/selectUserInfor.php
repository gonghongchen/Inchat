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
$sql = "SELECT avatar, gender, birthday, intro, location, createChatNum, joinChatNum FROM userInfor where userId='" . $userId . "'";

$result = $conn->query($sql);
$row = $result->fetch_assoc();
$data = array(	//封装所有查询到的用户资料
	"username"=>$_SESSION['username'],
	"avatar"=>$row["avatar"],
	"gender"=>$row["gender"],
	"birthday"=>$row["birthday"],
	"intro"=>$row["intro"],
	"location"=>$row["location"],
	"createChatNum"=>$row["createChatNum"],
	"joinChatNum"=>$row["joinChatNum"]
);
echo json_encode($data);

$conn->close();

?>