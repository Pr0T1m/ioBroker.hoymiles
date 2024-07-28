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
            if (typeof value === 'object' && value !== null) {
                adapter.setObjectNotExists(newPath, {
                    type: 'channel',
                    common: {
                        name: `${basePath} ${index}`
                    },
                    native: {}
                });
                createDataPoints(adapter, newPath, value);
            } else {
                adapter.setObjectNotExists(newPath, {
                    type: 'state',
                    common: {
                        name: `${basePath} ${index}`,
                        type: typeof value,
                        role: 'value',
                        read: true,
                        write: true
                    },
                    native: {}
                });
                adapter.setState(newPath, value);
            }
        });
    } else if (typeof data === 'object' && data !== null) {
        Object.keys(data).forEach(key => {
            const value = data[key];
            const newPath = `${basePath}.${key}`;
            if (typeof value === 'object' && value !== null) {
                adapter.setObjectNotExists(newPath, {
                    type: 'channel',
                    common: {
                        name: key
                    },
                    native: {}
                });
                createDataPoints(adapter, newPath, value);
            } else {
                adapter.setObjectNotExists(newPath, {
                    type: 'state',
                    common: {
                        name: key,
                        type: typeof value,
                        role: 'value',
                        read: true,
                        write: true
                    },
                    native: {}
                });
                adapter.setState(newPath, value);
            }
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