<?php
	
/**
 * @description 查找当前用户的私信
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

$cate = $_GET["cate"];
$userId = $_SESSION["userId"];
if ($cate === "send") {
	$sql = "SELECT * FROM message where senderId='" . $userId . "'";
} else {
	$sql = "SELECT * FROM message where receiverId='" . $userId . "'";
}

$result = $conn->query($sql);
$dataCount = $result->num_rows;
$data = array("mark"=>"haveData");	//封装所有查询到的群聊的信息

if ($dataCount > 0) {	//有数据
	// 输出数据
	$value = array();	//封装所有查询到的群聊的信息
	$index = 0;

	while ($row = $result->fetch_assoc()) {
		$value[$index] = array(
			"messageId"=>$row["messageId"],
			"senderId"=>$row["senderId"],
			"receiverId"=>$row["receiverId"],
			"content"=>$row["content"],
			"time"=>$row["time"]
		);
		//查询发送/接收此私信的对方的头像和名字信息
		if ($cate === "send") {
			$sql2 = "SELECT avatar FROM userInfor where userId=" . $row["receiverId"];
			$sql3 = "SELECT username FROM user where id=" . $row["receiverId"];
		} else {
			$sql2 = "SELECT avatar FROM userInfor where userId=" . $row["senderId"];
			$sql3 = "SELECT username FROM user where id=" . $row["senderId"];
		}

		$result2 = $conn->query($sql2);
		$row2 = $result2->fetch_assoc();
		$value[$index]["avatar"] = $row2["avatar"];

		$result3 = $conn->query($sql3);
		$row3 = $result3->fetch_assoc();
		$value[$index]["username"] = $row3["username"];

		$index++;
	}
	
	$data["value"] = $value;
	echo json_encode($data);
} else{
	$data["mark"] = "noData";
	echo json_encode($data);
}

$conn->close();

?>