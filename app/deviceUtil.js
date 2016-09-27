var fs = require('fs');
var exec = require('child_process').exec;
var async = require('async');

var tempFileLoc = '/sys/class/thermal/thermal_zone0/temp';
var delay = 2000;

function getDeviceStats (callbackFunc) {

    var data = {
        temp: 0,
        df: null
    };

    async.series([
        //temperature
        function (callback) {
            var cmd = 'cat ' + tempFileLoc;
            exec(cmd, function (err, stdout) {
                if(err) {
                    console.log(err);
                    return callback(err);
                }
                data.temp = Math.floor(parseInt(stdout) / 1000);
                return callback(null);
            });
        },
        //disk usage
        function (callback) {
            var cmd = "df / -h --output=size,used,avail,pcent";
            exec(cmd, function (err, stdout) {
                if(err) {
                    console.log(err);
                    return callback(err);
                }

                //" Size  Used Avail Use%\n  28G  7.6G   20G  29%\n"
                var str = stdout.trim().replace(/%/g,'');
                var arr = str.split('\n');

                var obj = {};
                if(arr.length ==2) {
                    arr[0] = arr[0].trim();
                    arr[1] = arr[1].trim();
                    
                    console.log(arr[0]);
                    console.log(arr[1]);
                    
                    var keys = arr[0].split(/\s+/);
                    var vals = arr[1].split(/\s+/);
                    
                    for(var i = 0; i <keys.length; i++) {
                        if(keys[i])
                            obj[keys[i].toLowerCase()] = vals[i];
                    }
                }

                data.df = obj;
                return callback(null);
            });
        }
    ],
    function (err) {
            callbackFunc(err, data);
    });
    
};

function reboot() {
    setTimeout(function () {
        exec('sudo reboot');
    }, delay);    
}

function shutdown() {
    setTimeout(function () {
        exec('sudo shutdown -h now');
    }, delay);    
}

module.exports = {

    getDeviceStats: getDeviceStats,
    reboot: reboot,
    shutdown: shutdown

};
