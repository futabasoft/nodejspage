# sample node-red app



## 1 import

[glitch import](https://glitch.com/edit/#!/import/github/futabasoft/nodejspage)

## 2 TERMINAL

$ *node -e "console.log(require('bcryptjs').hashSync(process.argv[1], 8));" password*

``` terminal
ex.  password 1234
$ node -e "console.log(require('bcryptjs').hashSync(process.argv[1], 8));" 1234

$2a$08$1wSxdx/hfTQcesKJrfgBOODXJJboPwt2Ax/O6nYzMAvpqFOWRQqvi
```
## 3 edit .env file

glitch env $  escape \
```
HTTP_USER=user
HTTP_PASS=?			//plain text

NODE_RED_USER=admin
NODE_RED_PW=?	   //hash 

```

## 3 Edit server.js 


var settings = {

[Node-red setting](https://nodered.jp/docs/user-guide/runtime/embedding)


## 4 


