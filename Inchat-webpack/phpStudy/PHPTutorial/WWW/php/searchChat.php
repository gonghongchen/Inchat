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

$keyWord = $_GET["value"];
$sql = "SELECT userId, chatId, chatName, chatIntro, chatCoverPicURL, chatFollowNum, chatVisitNum FROM chat where chatName LIKE '%" . $keyWord . "%'";


$result = $conn->query($sql);
$dataCount = $result->num_rows;
$data = array("mark"=>"haveData");	//封装所有查询到的群聊的信息

if ($dataCount > 0) {	//有数据
	// 输出数据
	$value = array();	//封装所有查询到的群聊的信息
    $index = 0;
    
    while ($row = $result->fetch_assoc()) {
        $value[$index] = array(
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
        $value[$index]["avatar"] = $row3["avatar"];

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