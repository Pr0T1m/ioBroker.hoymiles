'use strict';


const adaptername = "hoymiles"

const utils = require('@iobroker/adapter-core');
var adapter = utils.Adapter(adaptername);

var IP = "0.0.0.0"; //HoyMiles IP address
var TIMING = 1; //Request timing

adapter.on('ready', function() {
    adapter.log.info("Gestartet");

    IP = adapter.config.ipaddress;
    TIMING = adapter.config.requesttiming;

    if (TIMING < 0.5) { TIMING = 0.5; } // min: halbe minute
    if (TIMING > 10080) { TIMING = 10080; } //max: 1 woche

    adapter.log.info("IP: " + IP + "; Timing: " + Timing);
});