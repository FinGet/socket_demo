const http = require('http')
const fs = require('fs')
const url = require('url')
const io = require('socket.io')
const mysql = require('mysql')

// 连接数据库
// console.log(mysql)
let db = mysql.createPool({host: 'localhost',user:'root',password:'123456',database:'test'})

// 1.http服务
const httpServer = http.createServer((req, res) => {
	let {pathname, query} = url.parse(req.url, true)
	let {userName, passWord} = query
	let reg = {
		username: /^\w{6,32}$/,
		password: /^.{6,32}$/
	}
	if(pathname == '/reg') {
		// 注册接口
		console.log('请求注册', query)
		// 1.校验数据
		if(!reg.username.test(userName)) {
			res.write(JSON.stringify({code:1,msg:'用户名不符合规范'}))
			res.end()
		} else if(!reg.password.test(passWord)){
			res.write(JSON.stringify({code:1,msg:'密码不符合规范'}))
			res.end()
		} else{
			// 2.检验用户名是否重复
			db.query(`SELECT * FROM user_table WHERE username= '${userName}'`,(err, data) => {
				if(err) {
					console.log(err)
					res.write(JSON.stringify({code:1,msg:'数据库错误'}))
					res.end()
				} else if(data.length > 0){
					res.write(JSON.stringify({code:1,msg:'此用户已存在'}))
					res.end()
				} else{
					// 3.插入
					db.query(`INSERT INTO user_table (username,password,online) VALUES('${userName}','${passWord}',0)`, err => {
						if (err) {
							console.log(err)
							res.write(JSON.stringify({code:1,msg:'数据库有错'}))
							res.end()
						} else{
							res.write(JSON.stringify({code:0,msg:'注册成功!'}))
							res.end()
						}
					})
				}
			})
		}
	} else if (pathname == '/login') {
		// 登录接口
		console.log('请求登录', query)
		if(!reg.username.test(userName)) {
			res.write(JSON.stringify({code:1,msg:'用户名不符合规范'}))
			res.end()
		} else if(!reg.password.test(passWord)){
			res.write(JSON.stringify({code:1,msg:'密码不符合规范'}))
			res.end()
		} else {
			db.query(`SELECT ID,password FROM user_table WHERE username= '${userName}'`,(err, data) => {
				if(err) {
					console.log(err)
					res.write(JSON.stringify({code:1,msg:'数据库错误'}))
					res.end()
				} else if(data.length == 0){
					res.write(JSON.stringify({code:1,msg:'此用户不存在'}))
					res.end()
				} else if (data[0].password != passWord) {
					res.write(JSON.stringify({code:1,msg:'用户名或密码错误'}))
					res.end()
				} else {
					db.query(`UPDATE user_table SET online=1 WHERE ID=${data[0].ID}`, err => {
						if (err) {
							console.log(err)
							res.write(JSON.stringify({code:1,msg:'数据库有错'}))
							res.end()
						} else{
							res.write(JSON.stringify({code:0,msg:'登录成功!'}))
							res.end()
						}
					})
				}
			})
		}

	} else {
		fs.readFile(`www${req.url}`, (err, data) => {
			if(err) {
	  		res.writeHeader(404) 
	  		res.write('Not Found')
			} else {
				res.write(data)
			}
			res.end()
		})
	}
	
})

httpServer.listen(8080)
