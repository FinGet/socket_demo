const http = require('http')
const fs = require('fs')
const io = require('socket.io')
const mysql = require('mysql')

// 连接数据库
let db = mysql.createPoll({host: 'localhost',user:'root',password:'123456',database:'test'})

// 1.http服务
const httpServer = http.createServer((req, res) => {
	fs.readFile(`www${req.url}`, (err, data) => {
		if(err) {
  		res.writeHeader(404)
  		res.write('Not Found')
		} else {
			res.write(data)
		}
		res.end()
	});
})

httpServer.listen(8080)
