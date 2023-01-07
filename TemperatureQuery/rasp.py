import serial
import requests

# Open the serial port
with serial.Serial("/dev/ttyACM0", 9600) as ser:
    print("Connected to: " + ser.port)

    # Read data from the serial port and send it to the API
    while True:
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

        # Send the POST request to the API
        response = requests.post("http://89.133.35.34:5000/api/temperatures", json=post_data, headers=headers)
        print(response.status_code)