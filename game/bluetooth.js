// Class that encapsulates reading and unpacking data from a Arduino using Web Bluetooth API.
// It has six public floats, representing x, y, z acceleration and rotation.
// It has a method to connect to a Bluetooth device advertising service d29ddc51-60ad-4631-a52d-72dfeb397839,
// and subscribe to characteristic d29ddc51-60ad-4631-a52d-72dfeb397830, which contains a 24-byte array.
// Unpack the array into the six floats.
// Use the jspack library to unpack the data.

import jspack from "./jspack.min.js";

class Bluetooth {
    connected = false;
    ax = 0;
    ay = 0;
    az = 0;
    rx = 0;
    ry = 0;
    rz = 0;

    // takes in button id. attach connect to button onclick
    constructor(button_id, score) {
        document.getElementById(button_id).onclick = this.connect.bind(this);
        this.score = score;
    }

    connect() {
        navigator.bluetooth.requestDevice({
            filters: [{ services: ['d29ddc51-60ad-4631-a52d-72dfeb397839'] }]
        })
            .then(device => {
                console.log('Connecting to GATT Server...');
                return device.gatt.connect();
            })
            .then(server => {
                console.log('Getting Service...');
                return server.getPrimaryService('d29ddc51-60ad-4631-a52d-72dfeb397839');
            })
            .then(service => {
                console.log('Getting Characteristic...');
                return service.getCharacteristic('d29ddc51-60ad-4631-a52d-72dfeb397830');
            })
            .then(characteristic => {
                console.log('Subscribing to Characteristic changes...');
                characteristic.startNotifications();
                characteristic.addEventListener('characteristicvaluechanged', this.handleNotifications.bind(this));
                this.connected = true;
                this.score.readyUp();
            })
            .catch(error => {
                console.log(error);
            });
    }

    handleNotifications(event) {
        const value = event.target.value;
        const data = new Uint8Array(value.buffer);
        const unpacked = jspack.Unpack('<ffffff', data);
        this.ax = unpacked[0];
        this.ay = unpacked[1];
        this.az = unpacked[2];
        this.rx = unpacked[3];
        this.ry = unpacked[4];
        this.rz = unpacked[5];
    }
}

export { Bluetooth };