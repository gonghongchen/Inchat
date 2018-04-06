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

$target = $_POST["target"];
if ($target === "user") {	//查询特定用户的群聊数据
	$userId = $_POST["userId"];		//查询指定ID的用户的群聊数据
	if ($userId === "current") {	//查询当前登录用户的群聊数据
		$userId = $_SESSION["userId"];
	}
	$sql = "SELECT chatId, chatName, chatIntro, chatCoverPicURL, chatFollowNum, chatContentNum FROM chat where userId='" . $userId . "'";
} else {
	$sql = "SELECT chatId, chatName, chatIntro, chatCoverPicURL, chatFollowNum, chatContentNum FROM chat";
}


$result = $conn->query($sql);
$dataCount = $result->num_rows;
$data = array("mark"=>"haveData");	//封装所有查询到的群聊的信息

if ($dataCount > 0) {	//有数据
	// 输出数据
	$value = array();	//封装所有查询到的群聊的信息
	$index = 0;
	while ($row = $result->fetch_assoc()) {
		$value[$index++] = array(
			"chatId"=>$row["chatId"],
			"chatName"=>$row["chatName"],
			"chatIntro"=>$row["chatIntro"],
			"chatCoverPicURL"=>$row["chatCoverPicURL"],
			"chatFollowNum"=>$row["chatFollowNum"],
			"chatContentNum"=>$row["chatContentNum"]
		);
	}
	$data["value"] = $value;
	echo json_encode($data);
} else{
	$data["mark"] = "noData";
	echo json_encode($data);
}

$conn->close();

?>