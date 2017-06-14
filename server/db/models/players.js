var db = require('../index.js');

var sql = 'CREATE TABLE IF NOT EXISTS players (\
  id int(100) NOT NULL AUTO_INCREMENT,\
  name varchar(100) NOT NULL,\
  win int(100) NOT NULL,\
  lose int(100) NOT NULL,\
  PRIMARY KEY(ID)\
) ENGINE = InnoDB DEFAULT CHARSET = utf8;';
db.query(sql, function (err, result) {
  if (err) { throw err; }
  console.log('players table is created');
});    


