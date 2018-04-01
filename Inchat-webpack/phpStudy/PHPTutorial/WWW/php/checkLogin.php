<?php
	
/**
 * @description 根据session及前端发送过来的用户ID判断是否登录且是否是同一个用户
 * @author ghc
 */

session_start();

$userId = $_POST["userId"];

if (isset($_SESSION['userId']) && $userId === $_SESSION['userId']) {
	echo "loggedIn";
} else{
	echo "noLogin";
}

?>