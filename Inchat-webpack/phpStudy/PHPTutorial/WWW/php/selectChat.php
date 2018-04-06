<?php
	
/**
 * @description 查找特定用户或全部用户的群信息
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

$target = $_GET["target"];
$hasAvatar = false;	//判断是否需要从数据库里面去读取各个群聊对应的创建人的头像，以避免没有意义地重复查询头像数据
if ($target === "user") {	//查询特定用户的群聊数据
	$userId = $_GET["userId"];		//查询指定ID的用户的群聊数据
	if ($userId === "current") {	//查询当前登录用户的群聊数据
		$userId = $_SESSION["userId"];
	}
	$sql = "SELECT chatId, chatName, chatIntro, chatCoverPicURL, chatFollowNum, chatVisitNum FROM chat where userId='" . $userId . "'";
} else {
	$sql = "SELECT userId, chatId, chatName, chatIntro, chatCoverPicURL, chatFollowNum, chatVisitNum FROM chat";
	$hasAvatar = true;
}


$result = $conn->query($sql);
$dataCount = $result->num_rows;
$data = array("mark"=>"haveData");	//封装所有查询到的群聊的信息

if ($dataCount > 0) {	//有数据
	// 输出数据
	$value = array();	//封装所有查询到的群聊的信息
	$index = 0;
	if ($hasAvatar) {
		while ($row = $result->fetch_assoc()) {
			$value[$index] = array(
				"chatId"=>$row["chatId"],
				"chatName"=>$row["chatName"],
				"chatIntro"=>$row["chatIntro"],
				"chatCoverPicURL"=>$row["chatCoverPicURL"],
				"chatFollowNum"=>$row["chatFollowNum"],
				"chatVisitNum"=>$row["chatVisitNum"]
			);
			//查询创建此群聊的用户的头像
			$sql3 = "SELECT avatar FROM userInfor where userId=" . $row["userId"];
			$result3 = $conn->query($sql3);
			$row3 = $result3->fetch_assoc();
			$value[$index]["avatar"] = $row3["avatar"];
	
			$index++;
		}
	} else {
		while ($row = $result->fetch_assoc()) {
			$value[$index++] = array(
				"chatId"=>$row["chatId"],
				"chatName"=>$row["chatName"],
				"chatIntro"=>$row["chatIntro"],
				"chatCoverPicURL"=>$row["chatCoverPicURL"],
				"chatFollowNum"=>$row["chatFollowNum"],
				"chatVisitNum"=>$row["chatVisitNum"]
			);
		}
	}
	
	$data["value"] = $value;
	echo json_encode($data);
} else{
	$data["mark"] = "noData";
	echo json_encode($data);
}

$conn->close();

?>