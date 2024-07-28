'use strict';


const adaptername = "hoymiles"

const utils = require('@iobroker/adapter-core');
var adapter = utils.Adapter(adaptername);

var IP = "0.0.0.0"; //HoyMiles IP address
var TIMING = 1; //Request timing

let jsonData = require("./data.json")


// Funktion zum Erstellen von Datenpunkten und Ordnern
function prepareData(basePath, data) {
    if (Array.isArray(data)) {
        data.forEach((value, index) => {
            createDataPoints(basePath, value, index);
        });
    } else if (typeof value === 'object') {
        Object.entries(data).forEach(([key, value]) => {
            createDataPoints(basePath, value, key);
        });
    }
}

function createDataPoints(basePath, value, name) {
    const newPath = `${basePath}.${name}`;
    adapter.log.info(name)
    adapter.log.info(basePath)

    if (typeof value === 'object' || Array.isArray(value)) {
        adapter.log.info("ordner erstellen")

        adapter.setObjectNotExists(newPath, {
            type: 'channel',
            common: {
                name: `${basePath} ${name}`
            },
            native: {}
        });
        prepareData(newPath, value);
    } else {
        adapter.log.info("daatenpunkt erstellen")
        adapter.setObjectNotExists(newPath, {
            type: 'state',
            common: {
                name: `${basePath} ${name}`,
                type: typeof value,
                role: 'value',
                read: true,
                write: true
            },
            native: {}
        });
        adapter.setState(newPath, value);
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

        prepareData(basePath, jsonData[key]);
    });

});