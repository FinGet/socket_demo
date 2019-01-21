const http = require('http')
const io = require('socket.io')

// 1.http服务
const httpServer = http.createServer(function(req, res) {
	res.write('success')
	res.end()
})

httpServer.listen(8081)

console.log(1)
// 2.ws服务
const wsServer = io.listen(httpServer)
// console.log(wsServer)
wsServer.on('connection', sock => {
	console.log('有人连接')
	// 发送消息
	sock.emit('first','hello， this is  server.js')
	// 接收消息
	sock.on('name',function(name){
		console.log(name)
	})
})