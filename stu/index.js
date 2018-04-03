// 入口文件

// 引入模块
var http = require('http');
var url = require('url');
var fs = require('fs');
var mongo = require('mongodb').MongoClient;
var ejs = require('ejs');
var formidable = require('formidable');
var qs = require('querystring');

// 创建服务
http.createServer(function(req,res){
	// 获取当前用户请求的路由 
	// /index?id=1

	// /edit?id=ObjectId(5816de0e8687ab8c231fa715)


	// console.log(url.parse(req.url));
	// 解析路由
	var router = url.parse(req.url).pathname;
	// console.log(router);

	var params = qs.parse(url.parse(req.url).query);
	// console.log(params);

	// var 

	// 设置模板文件的目录
	var tpl = './tpl/';

	// 设置连接数据库的地址
	var dbUrl = 'mongodb://test:test@localhost:27017/school';

	// 判断不同的路由显示不同的数据
	if(router=='/index' || router=='/'){
		// console.log('请求的是首页');
		fs.readFile(tpl+'index.html',function(err,data){
			// console.log(data.toString());

			// 连接mongodb查询数据
			mongo.connect(dbUrl,function(err,db){
				// console.log(db);
				db.collection('stu').find().toArray(function(err,users){
					// console.log(users);

					var userData = {
						// users属性指向了获取的users包含所有用户信息的数组
						users:users,
						name:'张三',
						demo:[1,2,3,4]
					}

					// 设置响应
					res.write(ejs.render(data.toString(),userData));

					res.end();
				})
			})

			
		})
	}else if(router=='/add'){
		// 添加学员的表单
		fs.readFile(tpl+'add.html',function(err,data){
			res.write(data.toString());
			res.end();
		})
	}else if(router=='/doAdd' && req.method.toLowerCase()=='post'){
		// 获取添加的学员信息
		var form = new formidable.IncomingForm();
		// console.log(form);
		// 解析提交的数据
		form.parse(req,function(err,fields){
			// console.log(fields);

			mongo.connect(dbUrl,function(err,db){
				// 插入信息
				db.collection('stu').insert(fields,function(err,result){
					// console.log(result);

					// insertedCount 插入的数量
					if(result.insertedCount>0){
						// 成功了 -- 首页
						res.writeHead(302,{
							Location:'/index'
						});

						res.end();
					}else{
						// 失败了 -- 添加页面
						res.writeHead(302,{
							Location:'/add'
						});

						res.end();
					}
				});
			})

		})

	}else if(router=='/edit'){
		// 编辑学员信息 --- 谁的
		// 获取参数
		var _id = params._id;
		console.log(_id);

		// 去数据库查询当前用户的数据
		mongo.connect(dbUrl,function(err,db){
			// {id:'11111'}  params
			// console.log(params);
			// var con = {_id:'ObjectId("'+params._id+'")'};
			// console.log(con);

			db.collection('stu').find().toArray(function(err,users){
				// console.log(users);
				// console.log(users);
				users.forEach(function(value){
					if(value._id == _id){
						fs.readFile(tpl+'edit.html',function(err,data){
							res.write(ejs.render(data.toString(),value));
							res.end();
						})
					}
				})
			})

			
 			
		})


	}else if(router=='/doUpdate'){
		// 拿到当前的数据
		var form = new formidable.IncomingForm();
		form.parse(req,function(err,fields){
			// 进行更新需要条件
			// console.log(fields);

			mongo.connect(dbUrl,function(err,db){
				// 条件
				var con = {
					name:fields.con
				}

				// 删除字段
				delete(fields.con)

				// console.log(fields);

				db.collection('stu').update(con,{$set:fields},function(err,res){
					console.log(res.result);
				});
			})
			


			res.end();
		})
	}else{
		// 当以上的路由什么的都不存在的时候
		// 404
	}
}).listen(8080,'127.0.0.1');
