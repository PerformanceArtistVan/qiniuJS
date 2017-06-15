var qiniu = require('qiniu');
var express = require('express');
var config = require('./config.js');
var mysql     = require('promise-mysql');
var app = express();

app.configure(function() {
    app.use(express.static(__dirname + '/'));
});


app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.use(express.urlencoded());
app.use('/bower_components', express.static(__dirname + '/../bower_components'));
app.use('/src', express.static(__dirname + '/../src'));


var pool = mysql.createPool({
    host     : config.Host,
    user     : config.User,
    password : config.Password,
    database : config.Database,
    connectionLimit: 10,
});


app.get('/uptoken', function(req, res, next) {
    var token = uptoken.token();
    res.header("Cache-Control", "max-age=0, private, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
    if (token) {
        res.json({
            uptoken: token
        });
    }
});

app.post('/downtoken', function(req, res) {

    var key = req.body.key,
        domain = req.body.domain;

    //trim 'http://'
    if (domain.indexOf('http://') != -1) {
        domain = domain.substr(7);
    }
    //trim 'https://'
    if (domain.indexOf('https://') != -1) {
        domain = domain.substr(8);
    }
    //trim '/' if the domain's last char is '/'
    if (domain.lastIndexOf('/') === domain.length - 1) {
        domain = domain.substr(0, domain.length - 1);
    }

    var baseUrl = qiniu.rs.makeBaseUrl(domain, key);
    var deadline = 3600 + Math.floor(Date.now() / 1000);

    baseUrl += '?e=' + deadline;
    var signature = qiniu.util.hmacSha1(baseUrl, config.SECRET_KEY);
    var encodedSign = qiniu.util.base64ToUrlSafe(signature);
    var downloadToken = config.ACCESS_KEY + ':' + encodedSign;

    if (downloadToken) {
        res.json({
            downtoken: downloadToken,
            url: baseUrl + '&token=' + downloadToken
        })
    }
});

app.get('/', function(req, res) {
    res.render('index.html', {
        domain: config.Domain,
        uptoken_url: config.Uptoken_Url
    })
});

app.get('/multiple', function(req, res) {
    res.render('multiple.html', {
        domain: config.Domain,
        uptoken_url: config.Uptoken_Url
    });
});

app.get('/woca', function(req, res){
   console.log(req.query.key);
    var qiniukey = req.query.key;
    pool.getConnection(function (err, connection) {
        var sql = "INSERT INTO da_test_lyc(qiniukey) VALUES(?)";
        var sqlpara = [];
        sqlpara.push(qiniukey);
        if(err) throw err;
        connection.query(sql,sqlpara, function(err,result,fields){
            if(err) throw err;
            console.log('Success ');
            //connection.release();
        });
    });

    res.send("");
});

app.get('/onVideoBegin', function(req, res){
    var date = new Date();
    console.log("min "+date.getMinutes()+" sec"+date.getSeconds());
});

app.get('/onVideoStop', function(req, res){
    var date = new Date();
    console.log("min "+date.getMinutes()+" sec"+date.getSeconds());
});

qiniu.conf.ACCESS_KEY = config.ACCESS_KEY;
qiniu.conf.SECRET_KEY = config.SECRET_KEY;

var uptoken = new qiniu.rs.PutPolicy(config.Bucket_Name);




app.listen(config.Port, function() {
    console.log('Listening on port %d', config.Port);
});
