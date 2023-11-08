// This is a framework to handle server-side content

// You have to do an 'npm install express' to get the package
// Documentation in: https://expressjs.com/en/starter/hello-world.html
//import express from 'express';

//import * as db from "./db.mjs";

//var app = express();
//let port = 3001

//db.connect();

// Serve static HTML files in the current directory (called '.')
//app.use(express.static('.'))

// For GET requests to "/student?field1=value1&field2=value2"
//app.get('/student', function(request, response){
    // If we have fields available
    // console.log(request.query["field1"]);

    db.queryCallback((results) => {
        response.json(results)
    })
});

//app.listen(port, () => console.log('Server is starting on PORT,', port))

//process.on('exit', () => {
//    db.disconnect()
//})


import express from 'express';
import { queryCallback } from './db_mysql.mjs';

const app = express();
const port = 3000;

// Endpoint to get ace count for a player
app.get('/aceCount', (req, res) => {
  const playerName = req.query.playerName;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  queryCallback('aceCount', [playerName, startDate, endDate], (result) => {
    res.send(result);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

function getAceCount(playerName, startDate, endDate, callback) {
    const query = 'CALL aceCount(?, ?, ?)';
    connection.query(query, [playerName, startDate, endDate], (error, results, fields) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results[0]);
    });
}

