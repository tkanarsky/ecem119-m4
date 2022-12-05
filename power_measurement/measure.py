from dp832 import dp832
import time

# Class that measures the current and voltage supplied to the Arduino under test.
# Power supply is a Rigol DP832
# Arduino is connected to the power supply's Channel 1
# Supply is in constant voltage mode
# Voltage is set to 3.3 V, current limit is set to 500mA
# Current and voltage are measured every 0.05 seconds
# The script runs for 10 seconds

SECONDS = 20

class PSU:
    CHANNEL = 1

    def __init__(self):
        self.power_supply = dp832(fname="/dev/usbtmc0")
        self.power_supply.SetVoltage(PSU.CHANNEL, 5)
        self.power_supply.SetCurrent(PSU.CHANNEL, 0.5)
        self.power_supply.On(PSU.CHANNEL)
        time.sleep(0.5)

    def measure_power(self):
        return self.power_supply.MeasurePower(PSU.CHANNEL)

    def shutdown(self):
        self.power_supply.Off(PSU.CHANNEL)

# Graph the data using matplotlib
import matplotlib.pyplot as plt

# # Class that collects samples and graphs it using matplotlib
# class Graph:
#     def __init__(self, x_data, y_data):
#         self.x = x_data
#         self.y = y_data
#         self.fig, self.ax = plt.subplots()
#         self.ax.set(xlabel='Time (s)', ylabel='Power (W)', title='Power Consumption')
#         self.ax.grid()
    
#     def plot(self):
#         self.ax.plot(self.x, self.y, label='Power Consumption')
#         self.ax.legend()
#         plt.show()

# Arduino is a BLE peripheral advertising service with UUID d29ddc51-60ad-4631-a52d-72dfeb397839
# The service has a characteristic with UUID d29ddc51-60ad-4631-a52d-72dfeb397830, which supports notifications

import asyncio
import bleak

ble_connected = asyncio.Event()

async def listen_to_ble():
    def print_notification_value(sender, data):
        pass
    SERVICE_UUID = "d29ddc51-60ad-4631-a52d-72dfeb397839"
    CHARACTERISTIC_UUID = "d29ddc51-60ad-4631-a52d-72dfeb397830"
    scanner = bleak.BleakScanner()
    devices = await scanner.discover(service_uuids=[SERVICE_UUID])
    if len(devices) > 0:
        client = bleak.BleakClient(devices[0])
        connected = False
        while not connected:
            try:
                connected = await client.connect()
            except:
                await asyncio.sleep(5)
        ble_connected.set()
        await client.start_notify(CHARACTERISTIC_UUID, print_notification_value)

async def capture_power_data():
    psu = PSU()
    x = []
    y = []
    try:
        await ble_connected.wait()
        for i in range(0, SECONDS * 20):
            x.append(i * 0.05)
            y.append(psu.measure_power())
            await asyncio.sleep(0.05)
    finally:
        psu.shutdown()
    # Get average power consumption in time
    print(x) 
    average_power = sum(y) / len(y)
    with open("average_power.txt", "a") as f:
        f.write(str(average_power) + "\n")
    print("Average power consumption: %f W"%average_power)
    # graph = Graph(x, y)
    # graph.plot()

async def main():
    await asyncio.gather(listen_to_ble(), capture_power_data())
    

if __name__ == '__main__':
    for i in range(10):
        asyncio.run(main())
        time.sleep(5)
