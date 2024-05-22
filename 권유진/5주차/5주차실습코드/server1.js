// const http = require('http');

// const server = http.createServer((req, res) => {
//     res.writeHead(200, { 'Content-type' : 'text/html; charset=utf-8' });
//     res.write('<h1>Hello Node!</h1>'); //스트림에서 한 것 같은 구조 
//     res.write('<p>Hello server</p>'); 
//     res.end('<p>Hello!!!</p>');
// })
//     .listen(8080);

// server.on('listening', () => { //콜백을 생략해 listening을 사용한 형태 
//     console.log('8080번 포트에서 서버 대기 중입니다. ')    
// });
// server.on('error', (error) => {
//     console.error(error);
// });