DELIMITER //

DROP FUNCTION IF EXISTS aceCount;

CREATE FUNCTION aceCount(player_name VARCHAR(255), start_date DATE, finish_date DATE) 
RETURNS DECIMAL(10,2)
READS SQL DATA
BEGIN
    DECLARE total_aces INT;
    DECLARE total_matches INT;
    
    -- Calculate total aces for player between start_date and finish_date
    SELECT SUM(Statistics.ace)
    INTO total_aces
    FROM Statistics
    JOIN `Match` ON Statistics.match_num = `Match`.match_num
    JOIN Player ON Statistics.player_id = Player.player_id
    JOIN Tournament ON `Match`.tourney_id = Tournament.tourney_id
    WHERE Player.player_name = player_name AND (Tournament.tourney_date BETWEEN start_date AND finish_date);
    
    -- Calculate total matches played by player between start_date and finish_date
    SELECT COUNT(*)
    INTO total_matches
    FROM `Match`
    JOIN Player ON (`Match`.winner_id = Player.player_id OR `Match`.loser_id = Player.player_id)
    JOIN Tournament ON `Match`.tourney_id = Tournament.tourney_id
    WHERE Player.player_name = player_name AND (Tournament.tourney_date BETWEEN start_date AND finish_date);
    
    -- Return average aces
    RETURN IF(total_matches = 0, 0, total_aces / total_matches);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE showAggregateStatistics(IN player_name VARCHAR(255), IN start_date DATE, IN finish_date DATE)
BEGIN
    SELECT 
        Player.player_name,
        SUM(Statistics.ace) AS total_aces,
        AVG(Statistics.ace) AS avg_aces_per_match,
        SUM(Statistics.df) AS total_double_faults,
        SUM(Statistics.bpSaved) AS total_bp_saved
    FROM 
        Player
    JOIN 
        Statistics ON Player.player_id = Statistics.player_id
    JOIN 
        `Match` ON Statistics.match_num = `Match`.match_num
    JOIN 
        Tournament ON `Match`.tourney_id = Tournament.tourney_id
    WHERE 
        Player.player_name = player_name AND (Tournament.tourney_date BETWEEN start_date AND finish_date)
    GROUP BY 
        Player.player_name;
END //

DELIMITER ;



-- Define the TopAces view
DELIMITER //

CREATE PROCEDURE GetTopAces()
BEGIN
    SELECT Player.player_name, SUM(Statistics.ace) AS total_aces
    FROM Player
    JOIN Statistics ON Player.player_id = Statistics.player_id
    GROUP BY Player.player_name
    ORDER BY total_aces DESC
    LIMIT 10;
END //

DELIMITER ;


DELIMITER //

CREATE TRIGGER onInsertionPlayer BEFORE INSERT ON Player
FOR EACH ROW
BEGIN
    IF NEW.ioc IN ('RUS', 'EST') THEN
        SET NEW.ioc = 'USR';
    END IF;
END //

DELIMITER ;
