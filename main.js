'use strict';


const adaptername = "hoymiles"

const utils = require('@iobroker/adapter-core');
var adapter = utils.Adapter(adaptername);

var IP = "0.0.0.0"; //HoyMiles IP address
var TIMING = 1; //Request timing

let jsonData = require("./data.json")


// Funktion zum Erstellen von Datenpunkten und Ordnern
function createDataPoints(adapter, basePath, data) {
    if (Array.isArray(data)) {
        data.forEach((value, index) => {
            const id = `${basePath}.${index}`;
            adapter.setObjectNotExists(id, {
                type: 'state',
                common: {
                    name: `${basePath} ${index}`,
                    type: 'string',
                    role: 'value',
                    read: true,
                    write: true
                },
                native: {}
            });
            adapter.setState(id, value);
        });
    } else if (typeof data === 'object') {
        Object.keys(data).forEach(key => {
            const newPath = `${basePath}.${key}`;
            adapter.setObjectNotExists(newPath, {
                type: 'channel',
                common: {
                    name: key
                },
                native: {}
            });
            createDataPoints(adapter, newPath, data[key]);
        });
    }
}

adapter.on('ready', function() {
    adapter.log.info("Gestartet");

    IP = adapter.config.ipaddress;
    TIMING = adapter.config.requesttiming;

    adapter.log.info("IP: " + IP + "; Timing: " + TIMING);


    // Hauptordner dynamisch erstellen
    Object.keys(jsonData).forEach(key => {
        adapter.log.info("Hauptordner erstellen");

        const basePath = key;
        adapter.setObjectNotExists(basePath, {
            type: 'channel',
            common: {
                name: key
            },
            native: {}
        });
        adapter.log.info("Hauptordner erstellt");

        createDataPoints(adapter, basePath, jsonData[key]);
    });

});