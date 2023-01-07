import serial
import requests

# Open the serial port
with serial.Serial("/dev/ttyACM0", 9600) as ser:
    print("Connected to: " + ser.port)

    # Read data from the serial port and send it to the API
    firstread = True
    iteration = 0
    while True:
        if firstread:
            firstread = False
            continue

        data = ser.readline()
        temp = int(data.decode())
        print(temp)

        # Set the content type to application/json
        headers = { "Content-Type": "application/json" }

        # Construct the POST data as a dictionary
        post_data = {
            "Value": temp,
            "LocationId": 1
        }
        if(iteration >= 30):
            # Send the POST request to the API
            response = requests.post("http://localhost:5001/api/temperatures", json=post_data, headers=headers)
            print(response.status_code)
            iteration = 0
        else:
            iteration = iteration + 1
        