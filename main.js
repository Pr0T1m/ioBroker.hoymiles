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
            const newPath = `${basePath}.${index}`;
            adapter.setObjectNotExists(newPath, {
                type: 'channel',
                common: {
                    name: `${basePath} ${index}`
                },
                native: {}
            });
            createDataPoints(adapter, newPath, value);
        });
    } else if (typeof data === 'object') {
        Object.keys(data).forEach(key => {
            const id = `${basePath}.${key}`;
            adapter.setObjectNotExists(id, {
                type: 'state',
                common: {
                    name: key,
                    type: 'mixed', // oder den spezifischen Typ wie 'number', 'string', etc.
                    role: 'value',
                    read: true,
                    write: true
                },
                native: {}
            });
            adapter.setState(id, data[key]);
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