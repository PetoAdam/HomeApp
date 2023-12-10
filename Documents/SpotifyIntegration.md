# Spotify Integration

The Spotify Integration lets you connect and control any bluetooth speaker and play Spotify on it if you have a Spotify Premium subscription. It consists of 2 parts, the SpotifyService itself and the SpeakerService.
- Note: You can connect your speaker without a Spotify Premium subscription

### Parameters 
Make sure to have the environment variables PULSE_SERVER, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN, SPOTIFY_DEVICE_ID set. The PULSE_SERVER should be "127.0.0.1", the rest should be acquired manually.

## SpeakerService

The SpeakerService is a gRPC server responsible for connecting your machine to a bluetooth speaker. It stores the last connected speaker and automatically connects to it if possible. To connect to a new speaker, make sure to have it in pairing mode.

Note: it currently is not a gRPC service, it only works locally.  

## Spotifyd

Spotifyd is an open-source, lightweight Spotify client that acts as a daemon, allowing you to play Spotify music on your computer or other devices using the Spotify Connect protocol. It's designed to be resource-efficient and can run on various platforms, including Linux, macOS, and Windows.

Spotifyd essentially turns your device into a Spotify Connect-enabled device, which means you can use the official Spotify app on your phone or computer to control the playback on the device running Spotifyd. It's a convenient way to play your favorite Spotify tracks, playlists, and albums on different speakers, devices, or computers throughout your home.

This projects uses spotifyd to let the users of the application play music on a speaker connected to the device.

```
# Download the spotifyd tool 

git clone https://github.com/Spotifyd/spotifyd

# Change into the spotifyd directory

cd spotifyd

# Compile the tool

cargo build --release

# Move binary to path
sudo cp target/release/spotifyd /usr/bin/

```

After this, a configuration file for spotifyd is needed. To make sure that a systemd service will be able to access it, we are adding it to /etc/spotifyd.conf

```
sudo nano /etc/spotifyd.conf
````
```
[global]

# This is your spotify account name. Not your email. 
# https://www.spotify.com/us/account/profile/

username = "username"


# This is a plaintext password. 
# If you authenticated via a 3rd party application:
# https://www.spotify.com/us/account/set-device-password/
password = "password"

backend = "alsa"
mixer = "alsa"

# The device name cannot include spaces

device_name = "spotifyd"

device_type = "computer"

bitrate = 320

cache_path = "/home/USER/.cache/spotifyd"

no_audio_cache = true


initial_volume = "100"

normalisation_pregain = 10

zeroconf_port = 4444

audio-format = "44100:16:2"
```

 - Note: pulseaudio may also be used instead of the default alsa for the backend. To do that make sure to download pulseaudio and compile spotifyd with pulseaudio. Also make sure to change the configuration file properly.

 ```
 sudo apt install pulseaudio
 cargo build --release --features "pulseaudio_backend"
 ```

 Next, create the systemd service that will start spotifyd during startup.
 ```
 sudo nano /etc/systemd/system/spotifyd.service
 ```
 ```
 [Unit]

Description=A spotify playing daemon

Documentation=https://github.com/Spotifyd/spotifyd

Wants=network-online.target

After=network-online.target


[Service]

ExecStart=/bin/bash -c "export PULSE_SERVER=127.0.0.1 && sudo -u <YOUR_USERNAME> /usr/bin/spotifyd --no-daemon" 

Restart=always

RestartSec=20

Environment=SPOTIFYD_CONFIG_PATH=/etc/spotifyd.conf

[Install]

WantedBy=default.target
 ```

 Make sure to add the option to access this service without using a password for sudo. To make that open visudo:
 ```
 sudo visudo
 ```

 and add these lines to the end:
 ```
 Cmnd_Alias USER_SERVICES = /usr/bin/systemctl start spotifyd.service, /usr/bin/systemctl stop spotifyd.service, /usr/bin/systemctl restart spotifyd.service, /usr/bin/systemctl status spotifyd.service

<YOUR USERNAME> ALL=NOPASSWD: USER_SERVICES
 ```

 After this, make sure to reload systemctl, start the service and check if it runs properly.

```
sudo systemctl daemon-reload
sudo systemctl enable spotifyd.service
sudo systemctl start spotifyd.service
sudo systemctl status spotifyd.service
```

## SpotifyService

This is a .NET 6 gRPC Server that automatically authenticates itself and lets you play music through the Spotify API and spotifyd, a lightweight music player.

It requires a couple of environmental variables to be set:
- SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET:
    - Go to https://developer.spotify.com/dashboard and create an app. Make sure to set a working REDIRECT_URI. After creating the app, you will get the client id and client secret.
- SPOTIFY_REFRESH_TOKEN:
    - To browser:
    ```https://accounts.spotify.com/authorize?response_type=code&client_id=<CLIENT_ID>&scope=user-read-playback-state user-modify-playback-state user-read-currently-playing streaming&redirect_uri=<YOUR REDIRECT URI in URL encoded form>```
    - The scope can be changed if neccessary.
    - You will receive a code as a parameter. Use it to acquire the refresh token:
    ```curl -d client_id=<CLIENT_ID> -d client_secret=<CLIENT_SECRET> -d grant_type=authorization_code -d code=<RECEIVED_CODE> -d redirect_uri=<YOUR REDIRECT URI in URL encoded form> https://accounts.spotify.com/api/token```

- SPOTIFY_DEVICE_ID:
https://developer.spotify.com/documentation/web-api/reference/get-a-users-available-devices. Get the device id for the spotifyd device.

## Possible problems

There might be some errors with alsa and its bluetooth settings. It might be needed to configure the following files manually:

~/.asoundrc:
```
pcm.!default {
    type plug
    slave.pcm {
        type bluealsa
        device "<MAC address of bluetooth device>"
        profile "a2dp"
    }
}
```
- Note: this file should be updated every time a bluetooth speaker is connected via the SpeakerService. 
---

If you want to use global parameters instead of user-specific ones, you might need to configure these (by default, these file are not set):

/etc/bluealsa/bluealsa.conf:

```
[General]
profile = a2dp
device = <MAC address of bluetooth device>
```

/etc/asound.conf:
```
pcm.!default {
    type plug
    slave.pcm {
        type bluealsa
        device "<MAC address of bluetooth device>"
        profile "a2dp"
    }
}
```