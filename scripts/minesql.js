var mysql      = require('./promise-mysql');
var config = require('../config.js');

var mypool = mysql.createPool({
    host     : config.Host,
    user     : config.User,
    password : config.Password,
    database : config.Database,
    connectionLimit: 10,
});


//mypool.getConnection(function (err, connection) {
//    var sql = "INSERT INTO da_test_lyc(qiniukey) VALUES(?)";
//    var sqlpara = ['123'];
//    if(err) throw err;
//    connection.query(sql,sqlpara, function(err,result,fields){
//        if(err) throw err;
//        console.log('The solution is: ');
//        //connection.release();
//    });
//});


//connection.connect('SELECT `name` from da_test_lyc');

//查
//connection.query('SELECT * from da_test_lyc', function (error, results, fields) {
//    if (error) throw error;
//    console.log('The solution is: ', results);
//});
//增
//var addsql = 'INSERT INTO da_test_lyc(id,name,phone,age,sex,status) '+
//        'VALUES(123,?,?,?,?,?)';
//var addparams = ['刘男','157','38','2','2'];
//connection.query(addsql,addparams,function(error,result,fields){
//    if(error) throw error;
//    console.log("wwwww");
//});
//connection.end();