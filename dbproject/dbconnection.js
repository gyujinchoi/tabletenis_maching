var mysql      = require('mysql');
var connection = mysql.createConnection({
      host     : '52.79.188.98',
      user     : 'root',
      password : 'New1234!',
      database : 'tabletennis_competitions',
      port : 3306
});
module.exports=connection;