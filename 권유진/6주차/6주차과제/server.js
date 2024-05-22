const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const serverHtmlPath = path.join(__dirname, './server.html');

let users = {
    "1": { id: "1", name: "권유진" }
}; // 유저 데이터를 저장할 객체

http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        try {
            const data = await fs.readFile(serverHtmlPath);
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data);
        } catch (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end(err.message);
        }
    } else if (req.method === 'POST' && req.url === '/users') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', () => {
            const { id, name } = JSON.parse(body);
            if (!id || !name) {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ message: 'User ID and name are required' }));
                return;
            }
            users[id] = { id, name };
            res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ message: 'User created', user: users[id] }));
        });
    } else if (req.method === 'PUT' && req.url.startsWith('/users/')) {
        const id = req.url.split('/')[2];
        if (!users[id]) {
            res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ message: 'User not found' }));
            return;
        }
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', () => {
            const { name } = JSON.parse(body);
            if (!name) {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ message: 'User name is required' }));
                return;
            }
            users[id].name = name;
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ message: 'User updated', user: users[id] }));
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not Found');
    }
})
.listen(8090, () => {
    console.log("8090번 포트에서 서버 대기 중입니다.");
});