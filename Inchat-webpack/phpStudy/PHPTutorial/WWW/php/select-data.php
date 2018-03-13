<?php
	
/**
 * @description 查询数据
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
    echo("连接失败: " . $conn->connect_error) . "\n";
} else {
	// echo "linkSuccess" . "\n";
}

$sql = "SELECT * FROM user";
$result = $conn->query($sql);
$dataCount = $result->num_rows;

if ($dataCount > 0) {	//有聊天记录数据
	// 输出数据
	$data = array();
	$index = 0;
	while ($row = $result->fetch_assoc()) {
		$data[$index] = array("id"=>$row["id"], "username"=>$row["username"], "password"=>$row["password"]);
		$index++;
	}
	echo json_encode($data);
} else{
	echo "emptyChatContent" . "\n";
}

$conn->close();

?>