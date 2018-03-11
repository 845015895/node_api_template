let urlLib = require('url');
let mysql = require('mysql');
let async = require('async');
let express = require('express');
let bodyParser = require('body-parser');

let app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//设置跨距
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, POST, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
});


let connection = mysql.createConnection({
  host: 'xxxx',
  user: 'root',
  password: 'xxxx',
  database: 'xxxx'
});


connection.connect();


//注册接口
app.post('/user/reg', function (req, res) {
  //查询用户是否存在
  let querySql = "";
  let queryParams = [];
  
  // let obj = urlLib.parse(req.url, true);
  // const url = obj.pathname;
  // const POST = obj.query;

  const POST = req.body;
  async.waterfall([//处理数据库异步回掉
    function selectUser(cb) {
      queryParams = POST.user;
      connection.query(querySql, queryParams, function (err, result) {
        if (err) {
          console.log('[SELECT ERROR] - ', err.message);
          return;
        }
        userCount = result.length;
        cb(null, userCount);
      });
    },
    function addUser(userCount, cb) {
      if (userCount) {
        res.json(reg_err1);
      } else {
        addParams = [null,POST.user, POST.pass];
        connection.query(addSql, addParams, function (err, result) {
          if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
          }
          cb(null, result);
          res.json(reg_finish);
        });
      }

    }]
  );
});


//post
app.post('/user/log', function (req, res) {
  // 输出 JSON 格式
  //  response.end(JSON.stringify(data));
  // let obj = urlLib.parse(req.url, true);
  // const POST = obj.query;
  let querySql = "";
  const POST = req.body;
  let queryParams = [];
  // let queryParams = POST.user;
  connection.query(querySql, queryParams, function (err, result) {
    if (err) {
      console.log('[SELECT ERROR] - ', err.message);
      return;
    }
      res.json(result);
  });
});


//get
app.get('/user/list',function (req, res) {
  let obj = urlLib.parse(req.url, true);
  let queryAllSql = "";
  let queryParams = [];
  const GET = obj.query;
  //queryParams = [GET.user];
    connection.query(queryAllSql,queryParams,function (err, result) {
      if (err) {
        console.log('[SELECT ERROR] - ', err.message);
        return;
      }
      res.json(result);
    })
});
//delete
app.delete('/user/delete',function (req, res) {
  let obj = urlLib.parse(req.url, true);
  let deleteSql = "";
  const DELETE = obj.query;
  let deleteId = "";
  // let deleteId = DELETE.id;
  connection.query(deleteSql,deleteId,function (err, result) {
    if (err) {
      console.log('[SELECT ERROR] - ', err.message);
      return;
    }
    if(result.affectedRows){
      res.json(deleteMsg);
    }

  })
});



//配置服务端口
let server = app.listen(30000, function () {
  let host = server.address().address;
  let port = server.address().port;
  console.log('listening at http://%s:%s', host, port);
});




