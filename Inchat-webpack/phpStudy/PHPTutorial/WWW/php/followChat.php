<?php
	
/**
 * @description 关注/取消关注
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

$chatId = $_POST["chatId"];
$isFollow = $_POST["isFollow"];
$userId = $_SESSION['userId'];

function updateFollow($cate) {      //更新关注数据
    global $conn, $chatId, $isFollow, $userId;

    if ($cate === 1) {
        $sql = "SELECT chatFollow, chatFollowNum FROM chat WHERE chatId=".$chatId;
        $keyword = "chatFollow";
        $keyword2 = "chatFollowNum";
    } else {
        $sql = "SELECT followChat, followChatNum FROM userInfor WHERE userId=".$userId;
        $keyword = "followChat";
        $keyword2 = "followChatNum";
    }

    $result = $conn->query($sql);
    $resCount = $result->num_rows;
    if ($resCount > 0) {
        $row = $result->fetch_assoc();
        $follow = $row[$keyword];
        $followNum = (int)$row[$keyword2];
        if (!$follow) {  //若还没有人关注，则将此数据项设置为数组格式
            $follow = array();
        } else {
            $follow = json_decode($follow); //将取出来的字符串格式的数据转为数组
        }
        
        if ($isFollow === "true") { //关注
            if ($cate === 1) {
                array_push($follow, $userId);   //把当前用户ID存放进去
            } else {
                array_push($follow, $chatId);   //把当前群聊ID存放进去
            }
            
            $followNum++;
        } else {    //取消关注
            if ($cate === 1) {
                $index = array_search($userId, $follow);   //把当前用户ID找到并从中删除
            } else {
                $index = array_search($chatId, $follow);   //把当前群聊ID找到并从中删除
            }
            array_splice($follow, $index, 1);

            $followNum--;
        }

        if ($cate === 1) {
            $sql2 = "UPDATE chat SET chatFollow='".json_encode($follow)."', chatFollowNum='".$followNum."' WHERE chatId=".$chatId;
        } else {
            $sql2 = "UPDATE userInfor SET followChat='".json_encode($follow)."', followChatNum='".$followNum."' WHERE userId=".$userId;
        }
        if ($conn->query($sql2) === TRUE) { //更新记录
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

if(updateFollow(1) && updateFollow(2)) {//更新chat表&userInfor表里面的记录
    echo "success";
} else {
    echo "error";
}

$conn->close();

?>