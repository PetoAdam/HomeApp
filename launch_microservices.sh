#!/bin/bash

########################################################################
#
# Startup script:
# To use on Ubuntu add it to startup:
# chmod +x launch_microservices.sh
# crontab -e
#
# Add this to the end of the file:
# @reboot /home/ubuntu/Projects/HomeApp/launch_microservices.sh
#
########################################################################

# Wait for processes to start
sleep 15

# Change to the directory where launch script is located
cd /home/ubuntu/Projects/HomeApp

echo "$(date) - launch_microservices.sh executed on system startup." >> /home/ubuntu/Projects/HomeApp/logfile.log

# Replace 'python3' with the appropriate command to run your Python script if needed
python3 launch_microservices.py