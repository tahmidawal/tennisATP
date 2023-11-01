# tennisATP

# Here are the outputs I am receiving from testing the functions


mysql> SELECT aceCount('Roger Federer', '2000-01-01', '2020-12-31');
+-------------------------------------------------------+
| aceCount('Roger Federer', '2000-01-01', '2020-12-31') |
+-------------------------------------------------------+
|                                                  7.45 |
+-------------------------------------------------------+
1 row in set, 1 warning (1.09 sec)

mysql> CALL GetTopAces();
+------------------+------------+
| player_name      | total_aces |
+------------------+------------+
| John Isner       |      16091 |
| Ivo Karlovic     |      14446 |
| Roger Federer    |      11946 |
| Feliciano Lopez  |      10843 |
| Goran Ivanisevic |      10131 |
| Sam Querrey      |       9780 |
| Milos Raonic     |       9497 |
| Andy Roddick     |       9040 |
| Marin Cilic      |       8942 |
| Pete Sampras     |       8689 |
+------------------+------------+
10 rows in set (1.26 sec)

Query OK, 0 rows affected (1.26 sec)

mysql> CALL GetTopAces();
+------------------+------------+
| player_name      | total_aces |
+------------------+------------+
| John Isner       |      16091 |
| Ivo Karlovic     |      14446 |
| Roger Federer    |      11946 |
| Feliciano Lopez  |      10843 |
| Goran Ivanisevic |      10131 |
| Sam Querrey      |       9780 |
| Milos Raonic     |       9497 |
| Andy Roddick     |       9040 |
| Marin Cilic      |       8942 |
| Pete Sampras     |       8689 |
+------------------+------------+
10 rows in set (1.20 sec)

Query OK, 0 rows affected (1.20 sec)

mysql> CALL showAggregateStatistics('Roger Federer', '2000-01-01', '2020-12-31');
+---------------+------------+--------------------+---------------------+----------------+
| player_name   | total_aces | avg_aces_per_match | total_double_faults | total_bp_saved |
+---------------+------------+--------------------+---------------------+----------------+
| Roger Federer |      11688 |             7.8866 |                2732 |           4353 |
+---------------+------------+--------------------+---------------------+----------------+
1 row in set (0.36 sec)

Query OK, 0 rows affected (0.36 sec)

mysql> INSERT INTO Player (player_name, ioc) VALUES ('Test Player', 'RUS');
Query OK, 1 row affected (0.02 sec)

mysql> SELECT * FROM Player WHERE player_name = 'Test Player';
+-----------+-------------+------+--------+------+------+-------------+-------------+
| player_id | player_name | hand | height | ioc  | age  | player_rank | rank_points |
+-----------+-------------+------+--------+------+------+-------------+-------------+
|    408334 | Test Player | NULL |   NULL | RUS  | NULL |        NULL |        NULL |
+-----------+-------------+------+--------+------+------+-------------+-------------+
1 row in set (0.17 sec)

mysql> INSERT INTO Player (player_name, ioc) VALUES ('Test Player', 'RUS');
Query OK, 1 row affected (0.02 sec)

mysql> SELECT * FROM Player WHERE player_name = 'Test Player';
+-----------+-------------+------+--------+------+------+-------------+-------------+
| player_id | player_name | hand | height | ioc  | age  | player_rank | rank_points |
+-----------+-------------+------+--------+------+------+-------------+-------------+
|    408334 | Test Player | NULL |   NULL | RUS  | NULL |        NULL |        NULL |
|    408335 | Test Player | NULL |   NULL | USR  | NULL |        NULL |        NULL |
+-----------+-------------+------+--------+------+------+-------------+-------------+
2 rows in set (0.18 sec)
