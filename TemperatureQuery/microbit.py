from microbit import *
import microbit

# Configure the serial port to send data at 9600 baud
uart.init(baudrate=9600)

# Send temperature data every 500ms and display it on the micro:bit's display
while True:
    temp = str(int(temperature()))
    uart.write(temp + "\n")
    display.scroll(temp)
    sleep(2000)
