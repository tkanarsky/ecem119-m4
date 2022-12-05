# Create a matplotlib scatter/boxplot comparing power usage vs sampling rate
# The data is stored in average_power{sampling_rate}ms.txt files in this directory.
# {sampling_rate} is the sampling rate in milliseconds.
# Draw error bars for each category.

# Each line is a number representing the average power consumption in watts.
# The number of lines is the number of samples taken.

import matplotlib.pyplot as plt
import numpy as np
import os

sampling_rates = [0, 1, 10, 100, 1000, 5000]

def get_data(sampling_rate):
    with open(f"average_power{sampling_rate}ms.txt", "r") as f:
        return [float(line) for line in f.readlines()]

data = {sampling_rate: get_data(sampling_rate) for sampling_rate in sampling_rates}

fig, ax = plt.subplots()
ax.set(xlabel='Sampling Period (ms)', ylabel='Power (W)', title='Power Consumption')
ax.grid()

ax.boxplot(data.values(), labels=data.keys())
plt.show()
