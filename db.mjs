// You have to do an 'npm install mysql2' to get the package
// Documentation in: https://www.npmjs.com/package/mysql2

import { createConnection } from 'mysql2';

var connection = createConnection({
        host: 'localhost',
        user: 'tahmid',
        password: 'your_password_here',
        database: 'your_db'
});

function connect() {
        connection.connect();
}

function queryCallback(callback) {
        connection.query("SELECT * FROM Student", (error, results, fields) => {
                if (error) throw error;

                console.log(results)
                callback(results);
        });

        // With parameters:
        // "... WHERE name = ?", ['Fernanda'], (error ...)
}

function disconnect() {
        connection.end();
}

// Setup exports to include the external variables/functions
export {
        connection,
        connect,
        queryCallback,
        disconnect
}

// For testing:
// connect()
// queryCallback(r => console.log(r))
// disconnect()



// For testing:
// connect()
// queryCallback(r => console.log(r))
// disconnect()
