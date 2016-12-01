var http = require('http');
var httpProxy = require('http-proxy');
var fs = require('fs');
var mine = require('./mime').types;
var path = require('path');
var url = require('url');

var proxy = httpProxy.createProxyServer({
    target: 'http://10.16.77.216:50090',//接口地址
    /*ssl: {
        key: fs.readFileSync('server_decrypt.key', 'utf8'),
        cert: fs.readFileSync('server.crt', 'utf8')
    },
    secure: false*/
});

proxy.on('error', function(err, req, res){
    res.writeHead(500, {
        'content-type': 'text/plain'
    });
    console.log(err);
    res.end('Something went wrong. And we are reporting a custom error message.');
});

var server = http.createServer(function(req, res){
    var pathName = url.parse(req.url).pathname;
    var realPath = req.url.substring(1);

    var extName = realPath;
    var indexOfQuestionMark = extName.indexOf('?');
    if(indexOfQuestionMark >= 0){
        extName = extName.substring(0, indexOfQuestionMark);
        realPath = realPath.substring(0, indexOfQuestionMark);
    }
    extName = path.extname(extName);
    extName = extName ? extName.slice(1) : 'unknown';


    //判断如果是接口访问，则通过proxy转发
    if(pathName.indexOf('v1') > -1){
        console.log('[PROXY]' + pathName);
        proxy.web(req, res);
        return;
    }

    fs.exists(realPath, function(exists){
        if(!exists){
            res.writeHead(404, {'content-type': 'text/plain'});
            res.write('The request URL:' + realPath + ' could not be found.');
            res.end();
            return;
        }

        fs.readFile(realPath, 'binary', function(err, file){
            if(err){
                res.writeHead(500, {'content-type': 'text/plain'});
                res.end(err);
                return;
            }

            var contentType = mine[extName] || 'text/plain';
            res.writeHead(200, {'content-type': contentType});
            res.write(file, 'binary');
            res.end();
        });
    });
});

server.listen(8088);

console.log('server running at port: 8088');