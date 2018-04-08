<?php
	
/**
 * @description 查找特定群聊的信息
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

$chatId = $_GET["chatId"];
$sql = "SELECT * FROM chat where chatId='" . $chatId . "'";
$result = $conn->query($sql);
$dataCount = $result->num_rows;
if ($dataCount > 0) {
	$row = $result->fetch_assoc();
	$data = $row;

	//遍历所有的关注用户，获取到各个用户的名字、头像等信息，并封装到chatFollowList列表中
	$chatFollow = json_decode($row["chatFollow"]);
	$len = count($chatFollow);
	for ($i=0; $i < $len; $i++) { 
		$userInfor = array();
		$userId = $chatFollow[$i];
		//从user表中查询此用户的名字
		$sql = "SELECT username FROM user WHERE id = " . $userId;
		$result = $conn->query($sql);
		$row = $result->fetch_assoc();
		$userInfor["username"] = $row["username"];
		$userInfor["userId"] = $userId;

		//从userInfor表中查询此用户的头像
		$sql = "SELECT avatar, intro FROM userInfor WHERE userId = " . $userId;
		$result = $conn->query($sql);
		$row = $result->fetch_assoc();
		$userInfor["avatar"] = $row["avatar"];
		$userInfor["intro"] = $row["intro"];

		$chatFollow[$i] = $userInfor;
	}
	$data["chatFollowList"] = $chatFollow;

	$data["currentUserId"] = $_SESSION["userId"];	//把当前登录的用户ID也返回，以便前端判断是否登录用户即为创建此群聊的用户，如果是同一人，则不能有关注功能。
	echo json_encode($data);
} else {
	echo "noData";
}

$conn->close();

?>