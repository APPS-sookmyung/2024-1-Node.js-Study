const http = require('http');
const fs = require('fs').promises;

const server = http.createServer(async (req, res) => {
    try{
        res.writeHead(200, { 'Content-type' : 'text/html; charset=utf-8' });
        const data = await fstat.readFile('./server2.html');
        res.end(data);
    } catch (error){
        console.error(error);
        res.writeHead(200, { 'Content-type' : 'text/plain; charset=utf-8' });
    }
})
    .listen(8080);

server.on('listening', () => { //콜백을 생략해 listening을 사용한 형태 
    console.log('8080번 포트에서 서버 대기 중입니다. ')    
});
server.on('error', (error) => {
    console.error(error);
});