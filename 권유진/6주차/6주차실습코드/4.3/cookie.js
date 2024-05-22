const http = require('http');

http.createServer((req, res) => {
    console.log(req.url, req.headers.cookie); //url은 슬래시, 그리고 my cookie는 test로 전달된다. 
    res.writeHead(200, { 'Set-Cookie': 'mycookie=test'}); //mycookie의 키와 값 관계?
    res.end('Hello Cookie');
})
    .listen(8083, () => {
        console.log('8083번 포트에서 서버 대기 중입니다. ')
    });