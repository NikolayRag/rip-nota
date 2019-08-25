-- MySQL dump 10.14  Distrib 5.5.64-MariaDB, for debian-linux-gnu (i686)
--
-- ------------------------------------------------------
-- Server version	5.5.64-MariaDB-1ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `boardcontacts`
--

DROP TABLE IF EXISTS `boardcontacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `boardcontacts` (
  `id_boards` int(10) unsigned NOT NULL,
  `id_contactgroups` int(10) unsigned NOT NULL,
  `rights` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_boards`,`id_contactgroups`)
) ENGINE=Aria DEFAULT CHARSET=utf8 PAGE_CHECKSUM=0 ROW_FORMAT=DYNAMIC TRANSACTIONAL=0;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `contactgroups`
--

DROP TABLE IF EXISTS `contactgroups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contactgroups` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `id_owner` int(10) unsigned DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=Aria DEFAULT CHARSET=utf8 PAGE_CHECKSUM=0 ROW_FORMAT=DYNAMIC TRANSACTIONAL=0;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contactgroups`
--

LOCK TABLES `contactgroups` WRITE;
/*!40000 ALTER TABLE `contactgroups` DISABLE KEYS */;
INSERT INTO `contactgroups` VALUES (1,'Anon',0),(2,'Guest',0),(3,'Owner',0),(4,'Contacts',1);
/*!40000 ALTER TABLE `contactgroups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `implicits`
--

DROP TABLE IF EXISTS `implicits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `implicits` (
  `name` text NOT NULL,
  `id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`name`(7)) USING BTREE
) ENGINE=Aria DEFAULT CHARSET=utf8 PAGE_CHECKSUM=0 ROW_FORMAT=DYNAMIC TRANSACTIONAL=0;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `implicits`
--

LOCK TABLES `implicits` WRITE;
/*!40000 ALTER TABLE `implicits` DISABLE KEYS */;
INSERT INTO `implicits` VALUES ('homePrivate',101),('homePublic',101),('noBoard',206),('noUser',207),('welcome',89);
/*!40000 ALTER TABLE `implicits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `logagents`
--

DROP TABLE IF EXISTS `logagents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `logagents` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `agent` text NOT NULL,
  `count` int(10) unsigned DEFAULT '1',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `Index_2` (`agent`(255)) USING BTREE
) ENGINE=Aria DEFAULT CHARSET=utf8 PAGE_CHECKSUM=0 ROW_FORMAT=DYNAMIC TRANSACTIONAL=0;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `logdl`
--

DROP TABLE IF EXISTS `logdl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `logdl` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `stamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ip` varchar(15) NOT NULL,
  `id_user` int(10) unsigned DEFAULT NULL,
  `id_upload` int(10) unsigned DEFAULT NULL,
  `seek` int(10) unsigned NOT NULL,
  `finished` datetime DEFAULT NULL,
  `completed` tinyint(1) DEFAULT NULL,
  `seekout` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=Aria DEFAULT CHARSET=utf8 PAGE_CHECKSUM=0 ROW_FORMAT=DYNAMIC TRANSACTIONAL=0;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `loghttp`
--

DROP TABLE IF EXISTS `loghttp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `loghttp` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `stamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ip` varchar(15) NOT NULL,
  `request` text NOT NULL,
  `id_user` int(10) unsigned DEFAULT NULL,
  `id_agent` int(10) unsigned NOT NULL,
  `mode` int(10) unsigned NOT NULL,
  `count` int(10) unsigned NOT NULL DEFAULT '1',
  `stampfrom` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `port` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=Aria DEFAULT CHARSET=utf8 PAGE_CHECKSUM=0 TRANSACTIONAL=0;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `loglogon`
--

DROP TABLE IF EXISTS `loglogon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `loglogon` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_user` int(10) unsigned NOT NULL,
  `stamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `come` tinyint(1) NOT NULL,
  `success` tinyint(1) NOT NULL,
  `id_http` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=Aria DEFAULT CHARSET=utf8 PAGE_CHECKSUM=0 ROW_FORMAT=DYNAMIC TRANSACTIONAL=0;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `ndata`
--

DROP TABLE IF EXISTS `ndata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ndata` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `version` int(10) unsigned NOT NULL DEFAULT '1',
  `id_note` int(10) unsigned NOT NULL,
  `isdeleted` tinyint(1) unsigned DEFAULT '0',
  `datatype` int(10) unsigned NOT NULL COMMENT '0=plain,+=ref',
  `data` text,
  `stamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `x` int(11) NOT NULL DEFAULT '0',
  `y` int(11) NOT NULL DEFAULT '0',
  `w` int(10) unsigned NOT NULL DEFAULT '0',
  `h` int(10) unsigned NOT NULL DEFAULT '0',
  `id_editor` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`,`version`) USING BTREE
) ENGINE=Aria DEFAULT CHARSET=utf8 PAGE_CHECKSUM=0 ROW_FORMAT=DYNAMIC TRANSACTIONAL=0;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `note`
--

DROP TABLE IF EXISTS `note`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `note` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `stamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `version` int(10) unsigned NOT NULL DEFAULT '1',
  `isdeleted` tinyint(1) unsigned DEFAULT '0',
  `id_owner` int(11) NOT NULL,
  `name` varchar(240) DEFAULT NULL,
  `style` varchar(240) DEFAULT NULL,
  `kidshash` varchar(45) DEFAULT NULL,
  `inherit` bigint(20) unsigned DEFAULT '0' COMMENT 'first parent note to get rights',
  `id_editor` int(11) NOT NULL,
  PRIMARY KEY (`id`,`version`) USING BTREE
) ENGINE=Aria DEFAULT CHARSET=utf8 PAGE_CHECKSUM=0 TRANSACTIONAL=0;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `uploads`
--

DROP TABLE IF EXISTS `uploads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `uploads` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `guid` varchar(45) NOT NULL,
  `filename` varchar(255) DEFAULT NULL,
  `id_user` int(10) unsigned NOT NULL,
  `public` tinyint(1) NOT NULL DEFAULT '1',
  `stamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `size` bigint(20) unsigned NOT NULL DEFAULT '0',
  `enabled` tinyint(1) NOT NULL DEFAULT '1',
  `hash` varchar(45) DEFAULT NULL,
  `ext` varchar(45) NOT NULL,
  `mime` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=Aria DEFAULT CHARSET=utf8 PAGE_CHECKSUM=0 ROW_FORMAT=DYNAMIC TRANSACTIONAL=0;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `usercontacts`
--

DROP TABLE IF EXISTS `usercontacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usercontacts` (
  `id_me` int(10) unsigned NOT NULL,
  `id_who` int(10) unsigned NOT NULL,
  `state` int(10) unsigned DEFAULT '0',
  `id_group` int(10) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_me`,`id_who`)
) ENGINE=Aria DEFAULT CHARSET=utf8 PAGE_CHECKSUM=0 ROW_FORMAT=DYNAMIC TRANSACTIONAL=0;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `user_id` int(7) NOT NULL AUTO_INCREMENT,
  `username` varchar(15) NOT NULL,
  `first_name` varchar(55) DEFAULT NULL,
  `last_name` varchar(55) DEFAULT NULL,
  `website` varchar(50) DEFAULT NULL,
  `password` varchar(35) NOT NULL,
  `email` varchar(64) DEFAULT NULL,
  `activated` int(1) NOT NULL DEFAULT '0',
  `group_id` int(2) NOT NULL DEFAULT '1',
  `confirmation` varchar(64) DEFAULT NULL,
  `stamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `version` int(10) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`user_id`)
) ENGINE=Aria DEFAULT CHARSET=utf8 PAGE_CHECKSUM=0 ROW_FORMAT=DYNAMIC TRANSACTIONAL=0;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-08-25 16:05:02
