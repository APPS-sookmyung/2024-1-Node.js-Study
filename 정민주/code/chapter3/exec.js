const spawn = require('child_process').spawn
const process = spawn('python', ['test.py'])

process.stdout.on('data', function (data){
    console.log(data.toString('utf8'))
})
process.stderr.on('data', function(data){
    console.error(data.toString('utf8'))
})