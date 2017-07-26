var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	
	var mysql      = require('mysql');
	var connection = mysql.createConnection({
	      host     : '52.79.188.98',
	      user     : 'root',
	      password : 'New1234!',
	      database : 'Mysql',
	      port : 3306
	});

	connection.connect();

	connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
	      if (error) throw error;
	        console.log('The solution is: ', results[0].solution);
	});

	connection.end();
	
	
  res.send('respond with a resource');
});

module.exports = router;
