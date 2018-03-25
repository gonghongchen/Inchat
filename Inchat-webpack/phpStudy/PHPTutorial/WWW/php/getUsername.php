<?php
	
/**
 * @description 返回【session】里面保存的当前登录的【username】用户名信息
 * @author ghc
 */

session_start();

if (isset($_SESSION['username'])) {	//有聊天记录数据
	echo $_SESSION['username'];
} else{
	echo "noLogin";
}

?>