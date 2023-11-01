USE TennisATP;

DROP TABLE IF EXISTS Entry;
DROP TABLE IF EXISTS Statistics;
DROP TABLE IF EXISTS `Match`;
DROP TABLE IF EXISTS Tournament;
DROP TABLE IF EXISTS Player;

CREATE TABLE Player (
    player_id INT PRIMARY KEY AUTO_INCREMENT,
    player_name VARCHAR(255) NOT NULL,
    hand CHAR(1) CHECK (hand IN ('L', 'R')),
    height INT,
    ioc CHAR(3),
    age INT,
    player_rank INT CHECK (player_rank >= 0),
    rank_points INT
);

CREATE TABLE Tournament (
    tourney_id INT PRIMARY KEY AUTO_INCREMENT,
    tourney_name VARCHAR(255) NOT NULL,
    surface VARCHAR(50),
    draw_size INT,
    tourney_level CHAR(2),
    tourney_date DATE
);

CREATE TABLE `Match` (
    match_num INT PRIMARY KEY AUTO_INCREMENT,
    tourney_id INT,
    winner_id INT,
    loser_id INT,
    score VARCHAR(50),
    best_of INT,
    round CHAR(10),
    minutes INT,
    FOREIGN KEY (tourney_id) REFERENCES Tournament(tourney_id),
    FOREIGN KEY (winner_id) REFERENCES Player(player_id),
    FOREIGN KEY (loser_id) REFERENCES Player(player_id)
);

CREATE TABLE Statistics (
    match_num INT,
    player_id INT,
    ace INT,
    df INT,
    svpt INT,
    firstIn INT,
    firstWon INT,
    2ndWon INT,
    SvGms INT,
    bpSaved INT,
    bpFaced INT,
    FOREIGN KEY (match_num) REFERENCES `Match`(match_num),
    FOREIGN KEY (player_id) REFERENCES Player(player_id)
);

CREATE TABLE Entry (
    player_id INT,
    tourney_id INT,
    seed INT,
    entry VARCHAR(50),
    FOREIGN KEY (player_id) REFERENCES Player(player_id),
    FOREIGN KEY (tourney_id) REFERENCES Tournament(tourney_id)
);
