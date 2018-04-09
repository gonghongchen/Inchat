<?php
	
/**
 * @description 查找用户关注的群的信息
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
$userId = 0;
if ($target === "current") {
	$userId = $_SESSION["userId"];	//查询当前登录用户关注的群聊
} else {
	$userId = $target;		//查询指定ID的用户关注的群聊
}
$sql = "SELECT followChat FROM userInfor where userId=".$userId;

$result = $conn->query($sql);
$row = $result->fetch_assoc();
$followChat = json_decode($row["followChat"]);	//关注的群聊ID(数组)

if ($followChat) {
	$len = count($followChat);
	if ($len > 0) {
		$data = array("mark"=>"haveData");	//封装所有查询到的关注的群聊的信息
		$value = array();
		for ($i=0; $i < $len; $i++) { 
			$sql2 = "SELECT userId, chatId, chatName, chatIntro, chatCoverPicURL, chatFollowNum, chatVisitNum FROM chat where chatId=" . $followChat[$i];
			$result = $conn->query($sql2);
			$row = $result->fetch_assoc();
			$value[$i] = array(
				"userId"=>$row["userId"],
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
			$value[$i]["avatar"] = $row3["avatar"];
		}
		$data["value"] = $value;
		echo json_encode($data);
	} else {
		$data["mark"] = "noData";
		echo json_encode($data);
	}
} else {
	$data["mark"] = "noData";
	echo json_encode($data);
}

$conn->close();

?>