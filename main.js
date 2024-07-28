'use strict';
const { exec } = require('child_process');

// IP-Adresse, die an das Python-Skript übergeben werden soll
const ipAddress = '192.168.1.1';


const adaptername = "hoymiles"

const utils = require('@iobroker/adapter-core');
var adapter = utils.Adapter(adaptername);

var IP = "0.0.0.0"; //HoyMiles IP address
var TIMING = 1; //Request timing

adapter.on('ready', function() {
    adapter.log.info("Gestartet");

    IP = adapter.config.ipaddress;
    TIMING = adapter.config.requesttiming;

    adapter.log.info("IP: " + IP + "; Timing: " + TIMING);

    // Python-Skript ausführen und IP-Adresse als Argument übergeben
    exec(`main.py ${ipAddress}`, (error, stdout, stderr) => {
        if (error) {
            adapter.log.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            adapter.log.error(`Stderr: ${stderr}`);
            return;
        }

        // JSON-Antwort vom Python-Skript verarbeiten
        try {
            const jsonResponse = JSON.parse(stdout);
            adapter.log.info('JSON Response:', jsonResponse);
            // Hier kannst du die JSON-Daten weiterverarbeiten
        } catch (parseError) {
            adapter.log.error('Error parsing JSON:', parseError);
        }
    });
});