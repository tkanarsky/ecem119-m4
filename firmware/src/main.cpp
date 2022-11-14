// Firmware to publish IMU data as a BLE characteristic
// Browser will subscribe to it using the Web Bluetooth API.
// Largely inspired by 
// https://github.com/tigoe/BluetoothLE-Examples/blob/main/ \
// ArduinoBLE_library_examples/BLE_LIS3DH_accelerometer/BLE_LIS3DH_accelerometer.ino
// but using the LSM IMU library and publishing a single characteristic instead of multiple

#include <Arduino.h>
#include <ArduinoBLE.h>
#include <LSM6DS3.h>

// Initialize service publishing linear and angular motion values
// Choose arbitrary UUID
BLEService imuService("d29ddc51-60ad-4631-a52d-72dfeb397839");

// Array to store data read from IMU
float imuData[6] = {0.0, 0.0, 0.0, 0.0, 0.0, 0.0};

// Create bytearray characteristic holding the most up-to-date value 
// published by the IMU. Reserve 24 bytes for the value - 6 floats of 4 bytes each.
BLECharacteristic imuDataChar("d29ddc51-60ad-4631-a52d-72dfeb397830", BLERead | BLENotify, 24);

void setup() {
  asm(".global _printf_float");
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(115200);
  while (!IMU.begin()) { 
    delay(100); 
  }
  Serial.println("IMU initialized");
  while (!BLE.begin()) {
    delay(10);
  }
  Serial.println("BLE initialized");
  BLE.setLocalName("Pong Remote (tm)");
  BLE.setAdvertisedService(imuService);
  imuService.addCharacteristic(imuDataChar);
  BLE.addService(imuService);
  BLE.advertise();
  Serial.println("Began advertising");
}

void loop() {
  BLEDevice central = BLE.central();
  static char buf[100];
  while (central.connected()) {
    digitalWrite(LED_BUILTIN, HIGH);
    if (IMU.accelerationAvailable() && IMU.gyroscopeAvailable()) {
      IMU.readAcceleration(imuData[0], imuData[1], imuData[2]);
      IMU.readGyroscope(imuData[3], imuData[4], imuData[5]);
      imuDataChar.writeValue((void*) imuData, 24);
      snprintf(buf, 100, "%f, %f", imuData[0], *((float*)imuDataChar.value()));
      Serial.println(buf);
    } else {
      delay(10);
    }
    delay(100);
  }
  digitalWrite(LED_BUILTIN, LOW);
  delay(1000);
}