var request = require('request');
var spawn = require('child_process').spawn;

var secure = require('secure-peer');
var peer = secure(require('./config/client.json'));

var authorizedKeys = require('./config/authorized.json');

var r = request.put(process.argv[2]);
var sec = peer(function (stream) {
    process.stdin.pipe(stream);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    
    stream.pipe(process.stdout);
    
    stream.on('close', function () {
        process.stdin.setRawMode(false);
        r.end();
        process.exit();
    });
});
r.pipe(sec).pipe(r);

process.on('exit', function () {
    process.stdin.setRawMode(false);
});
