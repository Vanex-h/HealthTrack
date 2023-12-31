import serial
import requests

ser = serial.Serial("COM6", 9600, timeout=1)

api_url = "http://localhost:1400/record"

try:
    while True:
        data = ser.readline().decode().strip()
        if data:
            # Split the data string into components
            components = data.split(" && ")
            # Extract heart rate and body temperature
            heart_rate = float(components[0].split(": ")[1])
            body_temperature = float(components[1].split(": ")[1])


            if 60 <= heart_rate <= 120:
                print(f"Received data from Arduino: {data}")
                request_body = {"patient_id": "1", "heart_rate": int(float(heart_rate)), "body_temprature": int(float(body_temperature))}
                response = requests.post(api_url, json=request_body)
                if response.status_code == 201:
                    print('Data uploaded successfully!')
                else:
                    print("Failed to upload data")
except KeyboardInterrupt:
    print("Serial communication interrupted.")
except requests.exceptions.RequestException as e:
    print(f"Error: {e}")
finally:
    ser.close()