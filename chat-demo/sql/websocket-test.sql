# Host: localhost  (Version: 5.5.53)
# Date: 2018-01-25 15:31:26
# Generator: MySQL-Front 5.3  (Build 4.234)

/*!40101 SET NAMES utf8 */;

#
# Structure for table "chat_recording"
#

DROP TABLE IF EXISTS `chat_recording`;
CREATE TABLE `chat_recording` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `content` longtext COMMENT 'chat recording',
  `modify_mark` int(10) NOT NULL DEFAULT '0' COMMENT 'is modify the recording',
  PRIMARY KEY (`Id`)
) ENGINE=MyISAM AUTO_INCREMENT=48 DEFAULT CHARSET=utf8;

#
# Data for table "chat_recording"
#

/*!40000 ALTER TABLE `chat_recording` DISABLE KEYS */;
INSERT INTO `chat_recording` VALUES (47,'[{\"name\":\"熙儿\",\"content\":\"老大晚上好\",\"time\":1516861891130},{\"name\":\"顾柔\",\"content\":\"熙儿，好久不见\",\"time\":1516861918066},{\"name\":\"顾正文\",\"content\":\"大家晚上好\",\"time\":1516864182262},{\"name\":\"迷妹\",\"content\":\"上线了……\",\"time\":1516864269214},{\"name\":\"嘻嘻\",\"content\":\"哈哈\",\"time\":1516864506822},{\"name\":\"小迷弟\",\"content\":\"熙儿好٩(๑>◡<๑)۶\",\"time\":1516864993869},{\"name\":\"优哉游哉\",\"content\":\"第一次表达\",\"time\":1516865079028}]',0);
/*!40000 ALTER TABLE `chat_recording` ENABLE KEYS */;
