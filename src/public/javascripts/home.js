$(function() {

    initiateStatMonitoring();

    bindDeviceControls();

    initiateTabs();

    initiateXTerm();
    
});

function initiateStatMonitoring() {

    /********************* Temperature Service *********************/

    var refreshRate = 600000;

    var isLastReqSuccess = true;

    var $temp = $('#temp');
    var $diskPcent = $('#disk-pcent');
    var $diskTotal = $('#disk-total');
    var $diskUsed = $('#disk-used');
    var $diskAvail = $('#disk-avail');

    var failMsg = 'NA';

    fetchStats();
    
    setInterval(fetchStats, refreshRate);

    function fetchStats() {

        if(isLastReqSuccess) {
            isLastReqSuccess = false;
            $.ajax({
                url: '/gettemp',
                method: 'GET',
                type: 'application/json'
            })
            .done(function(data) {
                isLastReqSuccess = true;
                updateUIStats(data);
            })
            .error(function () {
                updateUIStats(null);
            });
        }

    }

    function updateUIStats (statObj)  {
        if(!statObj) {
            //error
            $temp.text(failMsg);
            $diskPcent(failMsg);
            $diskTotal.text(failMsg);
            $diskUsed.text(failMsg);
            $diskAvail.text(failMsg);

            return;
        }

        $temp.text(statObj.temp);
        $diskPcent.text(statObj.df.use);
        $diskTotal.text(statObj.df.size);
        $diskUsed.text(statObj.df.used);
        $diskAvail.text(statObj.df.avail);
    }
    /********************* End: Temperature Service *********************/

}

//tab - load pages on first click
function initiateTabs() {
    
    var $frames = $('.home-frame');

    $frames.each(function (pos) {

        var $frame = $frames.eq(pos);
        var url = $frame.attr('delayed-src');

        if($frame.is(":visible")) {
            $frame.attr('src', url);
        }
        else {
            var tabPaneId = $frame.closest('.tab-pane').attr('id');
            $('a[href="#'+ tabPaneId +'"]').one('click', function() {
                $frame.attr('src', url);
            })
        }

    });
    
}

//ssh terminal tab
function initiateXTerm() {
    $('.xTerm-tab').click(function () { 
        setTimeout(function() {
            $('.terminal').focus();
        }, 400);        
    });
}

//reboot shutdown handlers
function bindDeviceControls() {
    
    var isCmdIssued = false;
    var handle;
    var timeout = 5000; //5 sec
    var previousText = "";

    var getLocFromClass = function($btn) {
        if($btn.hasClass('btn-reboot')) {
            return '/reboot';
        }
        else if($btn.hasClass('btn-shutdown')) {
            return '/shutdown';
        }
    };

    $('.btn-reboot,.btn-shutdown').click(function(e) {

        var $this = $(this);

        if(!isCmdIssued) {            
            isCmdIssued = true;
            previousText = $this.text();
            $this.children('.txt').text('Cancel');
            $this.addClass('cancel btn-danger').removeClass('btn-primary');

            handle = setTimeout(function() {
                var loc = getLocFromClass($this);
                if(loc) {
                    window.location = loc;
                }
            }, timeout);
        }
        else {
            if($this.hasClass('cancel')) {
                isCmdIssued = false;
                clearTimeout(handle);
                handle = null;
                $this.removeClass('cancel btn-danger').addClass('btn-primary');
                $this.children('.txt').text(previousText);
            }
        }
    });

}