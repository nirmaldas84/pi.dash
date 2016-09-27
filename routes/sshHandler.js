var process = require('process');
var pty = require('pty.js');

//Following handler is not working, unable to determine the cause
//Using another service at 8667 to handle ws connection for xterm

// Copy pasted code below from xterm demo
function handleShhReq (app) {

    var expressWs = require('express-ws')(app);

    console.log('!!!!!!!!!!!!!!!!!!!!!!! WS HOOKED');

    app.ws('/bash', function(ws, req) {

        console.log('!!!!!!!!!!!!!!!!!!!!!!! WS IN');

        /**
         * Open bash terminal and attach it
         */
        var term = pty.spawn(process.platform === 'win32' ? 'cmd.exe' : 'bash', [], {
            name: 'xterm-color',
            cols: 80,
            rows: 24,
            cwd: process.env.PWD,
            env: process.env
        });
        term.on('data', function(data) {
            try {
            ws.send(data);
            } catch (ex) {
            // The WebSocket is not open, ignore
            }
        });
        ws.on('message', function(msg) {
            term.write(msg);
        });
        ws.on('close', function () {
            console.log('close');
            process.kill(term.pid);
        });
    });
}

module.exports = handleShhReq;