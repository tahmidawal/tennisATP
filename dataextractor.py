import mysql.connector
import pandas as pd

# Database Configuration
# config = {
#     'user': 'test_user',
#     'password': 'test_password',
#     'host': 'test_host',
#     'database': 'test_db',
#     'raise_on_warnings': True
# }

config = {
    'host': 'localhost',  # e.g., 'localhost'
    'user': 'tahmid',
    'password': 'your_password_here',
    'database': 'TennisATP'
}


# Establish a connection to the database
connection = mysql.connector.connect(**config)
cursor = connection.cursor()

# Import data from CSV files
#csv_files = ['atp_matches_1978.csv', 'atp_matches_1979.csv', 'atp_matches_2019.csv', 'atp_matches_2020.csv']
csv_files = [f'atp_matches_{year}.csv' for year in range(1968, 2024)]

for file in csv_files:
    # Read CSV using pandas
    df = pd.read_csv(file)

    # Iterate through rows and insert data into database
    for index, row in df.iterrows():
        
        # Insert or get player data
        winner_rank = row['winner_rank'] if not pd.isna(row['winner_rank']) and row['winner_rank'] >= 0 else None
        loser_rank = row['loser_rank'] if not pd.isna(row['loser_rank']) and row['loser_rank'] >= 0 else None
        
        winner_hand = row['winner_hand'] if row['winner_hand'] in ['L', 'R'] else None
        loser_hand = row['loser_hand'] if row['loser_hand'] in ['L', 'R'] else None


        # Extract necessary data
        winner_data = (row['winner_name'], winner_hand, row['winner_ht'], row['winner_ioc'], row['winner_age'], winner_rank, row['winner_rank_points'])
        loser_data = (row['loser_name'], loser_hand, row['loser_ht'], row['loser_ioc'], row['loser_age'], loser_rank, row['loser_rank_points'])
        tournament_data = (row['tourney_name'], row['surface'], row['draw_size'], row['tourney_level'], row['tourney_date'])
        match_data = (row['score'], row['best_of'], row['round'], row['minutes'])
        winner_stats = (row['w_ace'], row['w_df'], row['w_svpt'], row['w_1stIn'], row['w_1stWon'], row['w_2ndWon'], row['w_SvGms'], row['w_bpSaved'], row['w_bpFaced'])
        loser_stats = (row['l_ace'], row['l_df'], row['l_svpt'], row['l_1stIn'], row['l_1stWon'], row['l_2ndWon'], row['l_SvGms'], row['l_bpSaved'], row['l_bpFaced'])

        cursor.execute("INSERT INTO Player (player_name, hand, height, ioc, age, player_rank, rank_points) VALUES (%s, %s, %s, %s, %s, %s, %s) ON DUPLICATE KEY UPDATE player_id=LAST_INSERT_ID(player_id)", winner_data)
        winner_id = cursor.lastrowid
        #print(loser_data)  # Add this line to print the loser data
        cursor.execute("INSERT INTO Player (player_name, hand, height, ioc, age, player_rank, rank_points) VALUES (%s, %s, %s, %s, %s, %s, %s) ON DUPLICATE KEY UPDATE player_id=LAST_INSERT_ID(player_id)", loser_data)
        loser_id = cursor.lastrowid

        # Insert or get tournament data
        cursor.execute("INSERT INTO Tournament (tourney_name, surface, draw_size, tourney_level, tourney_date) VALUES (%s, %s, %s, %s, %s) ON DUPLICATE KEY UPDATE tourney_id=LAST_INSERT_ID(tourney_id)", tournament_data)
        tourney_id = cursor.lastrowid

        # Insert match data
        cursor.execute("INSERT INTO `Match` (tourney_id, winner_id, loser_id, score, best_of, round, minutes) VALUES (%s, %s, %s, %s, %s, %s, %s)", (tourney_id, winner_id, loser_id) + match_data)
        match_id = cursor.lastrowid

        # Insert statistics data
        cursor.execute("INSERT INTO Statistics (match_num, player_id, ace, df, svpt, firstIn, firstWon, 2ndWon, SvGms, bpSaved, bpFaced) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", (match_id, winner_id) + winner_stats)
        cursor.execute("INSERT INTO Statistics (match_num, player_id, ace, df, svpt, firstIn, firstWon, 2ndWon, SvGms, bpSaved, bpFaced) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", (match_id, loser_id) + loser_stats)
        # Insert statistics data for winner and loser
        
        

        # Commit the transaction to the database
        connection.commit()

# Close database connection
cursor.close()
connection.close()
