import express from 'express';
import { createConnection } from 'mysql2';
import { fileURLToPath } from 'url';
import path from 'path';

// Correct usage of path.dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// MySQL connection setup
const connection = createConnection({
  host: 'localhost', 
  user: 'tahmid', // Replace with your MySQL username
  password: 'your_password_here', // Replace with your MySQL password
  database: 'tennisatp' // Your MySQL database
});

// Connect to MySQL
connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

// Show all tables in the database
connection.query('SHOW TABLES', function (error, results, fields) {
    if (error) {
      console.error('An error occurred while executing the query.');
      throw error;
    }
    console.log('Database structure:');
    console.log(results);
});


connection.query(`SELECT aceCount('Roger Federer', '2000-01-01','2001-01-01') AS aceCount`, function (error, results, fields){
         console.log(`Type of startDate: ${typeof '2000-01-01'}`); // This will log the data type of startDate

    	if (error) {
    	  console.error('An error occurred while executing the query.');
    	  throw error;
    	}
    	console.log('Database structure:');
    	//console.log(results);
});

// Serve static files

app.use(express.static('public'));

// Additional function to call the aceCount procedure
function getAceCount(playerName, startDate, endDate, callback) {
    // Sanitize inputs to prevent SQL Injection
    const query = `CALL showAggregateStatistics('${playerName}', '${startDate}', '${endDate}')`;


    connection.query(query, function (error, results, fields)  {
        //console.log(query); // This will log the data type of startDate


        if (error) {
            console.error('Database error:', error);
            callback(error, null);
            return;
        }
        console.log('Here');

        console.log(results);
        callback(null, results); // Assuming the aceCount is in the first row of the first result
    });
}

// Endpoint to get ace count for a player
app.get('/aceCount', (req, res) => {
  const playerName = req.query.playerName;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  
  getAceCount(playerName, startDate, endDate, (error, result) => {
    if (error) {
      console.log('Hereatall');
      res.status(500).json({error: 'Server error'});
      return;
    }
    // Assuming the function result is directly in the result object
    console.log(result)
    res.json(result[0]); //['aceCount(?, ?, ?) AS aceCount']
  });
});


// Endpoint to get player information
app.get('/playerInfo', (req, res) => {
    const playerName = req.query.playerName;
    const query = 'SELECT * FROM Player WHERE player_name = ?';
    connection.query(query, [playerName], (error, results) => {
        if (error) {
            res.status(500).json({error: 'Server error'});
            return;
        }
        //console.log(results)
        res.json(results);

    });
});

app.get('/tournamentInfo', (req, res) => {
    // Make sure you have a date parameter in the query string
    const dateParam = req.query.tournamentYear;

    // Validate that dateParam is a number and within a reasonable range for years
    if (!dateParam || isNaN(dateParam) || dateParam.length !== 4) {
        res.status(400).json({ error: 'Invalid year format' });
        return;
    }
    
    const year = parseInt(dateParam, 10); // Parse the year as an integer

    // SQL query with ORDER BY clause to sort the results
    const query = `SELECT * FROM Tournament WHERE YEAR(tourney_date) = ? ORDER BY tourney_name, tourney_date, tourney_level`;

    connection.query(query, [year], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Server error' });
            return;
        }
        res.json(results); 
        console.log(results);
    });
});


// Root route to serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Additional routes go here

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
