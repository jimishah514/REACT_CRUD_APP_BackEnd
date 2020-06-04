const express = require('express')

// use process.env variables to keep private variables,
// be sure to ignore the .env file in github
require('dotenv').config()

// Express Middleware
const helmet = require('helmet') // creates headers that protect from attacks (security)
const bodyParser = require('body-parser') // turns response into usable format
const cors = require('cors')  // allows/disallows cross-site communication
const morgan = require('morgan') // logs requests

// db Connection w/ Heroku
// const db = require('knex')({
//   client: 'pg',
//   connection: {
//     connectionString: process.env.DATABASE_URL,
//     ssl: true,
//   }
// });

// db Connection w/ localhost

// const { Client } = require('pg');
// const connectionString = 'postgres://jimi1:12345@localhost:5432/crud-starter-api';
// const client = new Client({
//     connectionString: connectionString
// });
// client.connect();


var db = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'jimi1',
    password : '12345',
    database : 'crud-starter-api'
  }
});

// Controllers - aka, the db queries
const main = require('./controllers/main')

// App
const app = express()

// App Middleware
const whitelist = ['http://localhost:3000']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(helmet())
app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(morgan('combined')) // use 'tiny' or 'combined'

// App Routes - Auth


app.get('/', (req, res) => res.send('hello world'))
app.get('/crud', (req, res) => main.getTableData(req, res, db))
app.post('/crud', (req, res) => main.postTableData(req, res, db))
app.put('/crud', (req, res) => main.putTableData(req, res, db))
app.delete('/crud', (req, res) => main.deleteTableData(req, res, db))

app.post('/crud', function (req, res, next) {
  const { first, last, email, phone, location, hobby } = req.body
  client.query(`INSERT INTO TABLE_NAME (column1, column2, column3)
  VALUES (value1, value2, value3)`, [1], function (err, result) {
      if (err) {
          console.log(err);
          res.status(400).send(err);
      }
      res.status(200).send(result.rows);

  });
});



////////////////////    Using Query (without Query Engine)  //////////////////////////////


// app.post('/crud', function (req, res, next) {
//   console.log("Post req body : ",req.body)
//   const { first, last, email, phone, location, hobby } = req.body
//   const added = new Date()
   
//   client.query('INSERT INTO items ( first,last,email,phone,location,hobby,added) VALUES( '+ first +','+ last+','+  email+','+  phone+','+  location+','+  hobby+','+  added+')', function (err, result) {
//       if (err) {
//           console.log(err);
//           res.status(400).send(err);
//       }
     
//       res.status(200)
//   });
// });

// app.get('/crud', function (req, res, next) {
//   console.log(" req : ",req.body)
//   client.query('SELECT * FROM items', function (err, result) {
//       if (err) {
//           console.log(err);
//           res.status(400).send(err);
//       }
//       console.log("Result : ",result.rows)
//       res.status(200).send(result.rows);
//   });
// });



// app.delete('/crud', function (req, res) {
//   console.log(" Delete req id : ",req.body.id)
//   const id = req.body.id
//   client.query(`DELETE FROM items WHERE ID = ${id}`, function (err, result) {
//       if (err) {
//           console.log(err);
//           res.status(400).send(err);
//       }
//       res.status(200)
//   });
// });


////////////////////    Using Query (without Query Engine)  //////////////////////////////

// App Server Connection
app.listen(process.env.PORT || 3001, () => {
  console.log(`app is running on port ${process.env.PORT || 3001}`)
})