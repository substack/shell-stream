var http = require('http');
var spawn = require('child_process').spawn;

var secure = require('secure-peer');
var peer = secure(require('./config/keys.json'));

var authorizedKeys = require('./config/authorized.json');

var server = http.createServer(function (req, res) {
    var sec = peer(function (stream) {
        var ps = spawn('bash', [ '-i' ], { cwd : process.env.HOME });
        stream.pipe(ps.stdin);
        ps.stdout.pipe(stream);
        ps.stderr.pipe(stream);
        
        ps.on('close', function () {
            stream.end();
            sec.end();
        });
    });
    
    sec.on('identify', function (id) {
        if (authorizedKeys.indexOf(id.key.public) >= 0) {
            id.accept();
        }
        else id.reject()
    });
    
    req.pipe(sec).pipe(res);
});
server.listen(9050);
