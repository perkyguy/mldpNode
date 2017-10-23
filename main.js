const noble = require('noble');

const MLDP_SERVICE_UUID = "00035b03-58e6-07dd-021a-08123a000300";
const MLDP_CHARACTERISTIC_UUID = "00035b03-58e6-07dd-021a-08123a000301";

const serviceUUIDs = [MLDP_SERVICE_UUID.replace(/\-/g,'')];
const characteristicUUIDs = [MLDP_CHARACTERISTIC_UUID.replace(/\-/g,'')];
const allowDuplicates = true;

noble.on('stateChange', function(state) {
    if (state === 'poweredOn')
        noble.startScanning(serviceUUIDs);
    else
        noble.stopScanning();
});
noble.on('discover', function(peripheral) {
    console.log('Connecting to name: ' + peripheral.advertisement.localName);
    peripheral.connect(function(error) {
        console.log('Connected!');
        if(error) { console.error(error); }
        peripheral.discoverSomeServicesAndCharacteristics(serviceUUIDs,characteristicUUIDs,(e,s,c) => {
            if(s.length == 0 || c.length == 0) {
                console.error("Couldn't find MLDP?");
                return;
            }
            console.log('Found MLDP! Waiting for data!');
            var MLDP_characteristic = c[0];
            MLDP_characteristic.subscribe()
            MLDP_characteristic.on('data', (d) => {
                // console.log('data...');
                process.stdout.write(d.toString());
            })
        })
    });
});