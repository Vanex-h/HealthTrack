import serial
import requests
from datetime import datetime

ser = serial.Serial("COM6", 9600, timeout=1)
# API endpoint URL
api_url = "http://localhost:1400/record"
current_datetime = datetime.now()
try:
    while True:
        data = ser.readline().decode().strip()
        if data and float(data) <=120 and float(data) >= 60:
            print(f"Received data from Arduino: {data}")
            request_body = {"patient_id": "1", "heart_rate": int(float(data)), "body_temprature": 37}

            response = requests.post(api_url, json=request_body)
            if response.status_code == 201:
                print('Data uploaded successfully!')
            else:
                print(response)
                print("Failed to upload data")
except KeyboardInterrupt:
    print("Serial communication interrupted.")
except requests.exceptions.RequestException as e:
    print(f"Error: {e}")
finally:
    ser.close()