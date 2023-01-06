import serial

# Open the serial port
with serial.Serial("/dev/ttyACM0", 9600) as ser:
    print("Connected to: " + ser.port)

    # Read data from the serial port
    while True:
        data = ser.readline()
        temp = data.decode().rstrip()
        print(temp)
