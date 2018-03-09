/*
 * Editor: gonghongchen
 * Description: title informations of some pages
 * Date: 2018-1-19 17:00:09
 * Unfinished: Where the "============================" appears
 */
export const Config_titleInformationObj = {
	"login" : {
		"description" : "登录",
		"values" : {
			"success" : {
				"description" : "登录成功",
				"values" : [
					"登录成功，即将进入个人主页"
				]
			},
			"error" : {
				"description" : "登录失败",
				"values" : [
					"用户名或者秘密错误",
					"网络出错，请稍后再试",
					"遇到未知错误，请稍后再试"
				]
			}
		}
	},
	"register" : {
		"description" : "注册",
		"values" : {
			"success" : {
				"description" : "注册成功",
				"values" : [
					"注册成功，即将进入个人主页"
				]
			},
			"error" : {
				"description" : "注册失败",
				"values" : [
					"用户名已存在，请重新输入",
					"网络出错，请稍后再试",
					"遇到未知错误，请稍后再试"
				]
			}
		}
	}
}
