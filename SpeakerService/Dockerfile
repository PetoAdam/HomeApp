FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install bluez and dbus-cli tools (bluez-dbus might be useful for interacting with the host)
RUN apt-get update && apt-get install -y bluez dbus && rm -rf /var/lib/apt/lists/*

COPY . .

CMD ["python3", "speaker_service.py"]
