# node-http-proxy
用于解决前后端分离后前端开发的跨域请求问题。

# start

### 将仓库拉到开发目录的根目录下，同时安装依赖

    git clone https://github.com/liujianhuanzz/node-http-proxy.git
    
    npm install

### 更改`proxy.js`中的如下几个地方

#### 1.目标接口地址

    var proxy = httpProxy.createProxyServer({
    	target: 'http://xxx.xxx.xxx.xxx:xxxx',//替换为对应的接口地址
    }); 

#### 2.接口地址标识判断
    
    //判断如果是接口访问，则通过proxy转发
    if(pathName.indexOf('v1') > -1){//替换为对接口地址的判断，保证只转发接口
    	console.log('[PROXY]' + pathName);
    	proxy.web(req, res);
    	return;
    }

#### 3.本地端口设置

    server.listen(xxxx);//设置为本地端口

### 启动以及使用

在项目的根目录下执行

    node proxy.js

在浏览器中访问http://localhost:xxxx即可访问当前根目录，对于项目中的请求接口请求都代理到对应的目标地址中。