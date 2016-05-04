CREATE DATABASE IF NOT EXISTS `<%db_name%>` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `<%db_name%>`;
DROP TABLE IF EXISTS `<%table_name%>`;
CREATE TABLE IF NOT EXISTS `<%table_name%>` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `airport_name` varchar(255) NOT NULL,
  `link` text,
  `title` varchar(255) DEFAULT NULL,
  `author` int(255) DEFAULT NULL,
  `author_country` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `content` text,
  `experience_airport` varchar(255) DEFAULT NULL,
  `date_visit` date DEFAULT NULL,
  `type_traveller` varchar(100) DEFAULT NULL,
  `overall_rating` int(11) DEFAULT NULL,
  `queuing_rating` int(11) DEFAULT NULL,
  `terminal_cleanliness_rating` int(11) DEFAULT NULL,
  `terminal_seating_rating` int(11) DEFAULT NULL,
  `terminal_signs_rating` int(11) DEFAULT NULL,
  `food_beverages_rating` int(11) DEFAULT NULL,
  `airport_shopping_rating` int(11) DEFAULT NULL,
  `wifi_connectivity_rating` int(11) DEFAULT NULL,
  `airport_staff_rating` int(11) DEFAULT NULL,
  `recommended` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;
