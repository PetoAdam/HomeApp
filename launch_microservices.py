import os
import yaml
import subprocess
    
def run_in_screen(session_name, command):
    subprocess.run(["screen", "-d", "-m", "-S", session_name, "bash", "-c", command])

# Read the YAML configuration
def read_microservices_config():
    with open("microservices.yml", "r") as f:
        config = yaml.safe_load(f)
        return config["microservices"]

if __name__ == "__main__":
    # Source the user's .bashrc file to set environment variables
    os.system(". /home/ubuntu/.bashrc")

    # Read the microservices configuration from YAML
    microservices = read_microservices_config()

    # Launch each microservice in a separate tmux session
    for service in microservices:
        name = service["name"]
        command = service["command"]

        # Pass the specific environment variables to the function
        run_in_screen(name, command)

        print(f"{name} microservice launched.")

    # Inform the user that all microservices have been launched
    print("All microservices have been launched in separate screen sessions.")