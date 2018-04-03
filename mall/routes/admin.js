var express = require('express');
var router = express.Router();


// /admin
// 写路由
router.get('/',function(req,res,next){
	// 响应字符串
	// res.send('我现在是后台目录');

	// 响应模板 -- 模板的出发点views目录
	res.render('admin/index');
});

// 设置路由 /user
router.get('/user',function(req,res,next){
	res.render('admin/user');
})

// /a

module.exports = router;
