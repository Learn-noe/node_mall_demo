var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

	// res.render() 加载模板
  	res.render('index', { title: 'Express' });

  	// 输出一段字符串
  	// res.send('这是二sssss段测试的文字');
});

module.exports = router;
