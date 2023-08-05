import os
import yaml

# Function to create a new tmux session and run the command in it
def run_in_tmux(session_name, command, env_vars=None):
    os.system(f"tmux new-session -d -s {session_name}")
    for key, value in env_vars.items():
        os.system(f"tmux set-environment {key} {value}")
        os.system(f"export {key}='{value}'")
    os.system(f"tmux send -t {session_name} '{command}' ENTER")

# Function to print instructions for attaching and detaching from a tmux session
def print_instructions(session_name):
    print(f"To attach to {session_name}, run:")
    print(f"tmux attach-session -t {session_name}")
    print()
    print(f"To detach from {session_name} without killing the session, press:")
    print("Ctrl-b d")
    print()

# Function to list all running tmux sessions (microservices)
def list_running_sessions():
    os.system("tmux list-sessions")

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

    # Get specific environment variables from the current shell environment
    specific_env_vars = {
        "JWT_SIGNING_KEY": os.environ.get("JWT_SIGNING_KEY", ""),
        "CLIENT_ID": os.environ.get("CLIENT_ID", ""),
        "CLIENT_SECRET": os.environ.get("CLIENT_SECRET", ""),
        "HTTPS_PEM": os.environ.get("HTTPS_PEM", ""),
        "HTTPS_KEY_PEM": os.environ.get("HTTPS_KEY_PEM", ""),
        "PULSE_SERVER": os.environ.get("PULSE_SERVER", "127.0.0.1"),
        "SPOTIFY_CLIENT_ID": os.environ.get("SPOTIFY_CLIENT_ID", ""),
        "SPOTIFY_CLIENT_SECRET": os.environ.get("SPOTIFY_CLIENT_SECRET", ""),
        "SPOTIFY_REFRESH_TOKEN": os.environ.get("SPOTIFY_REFRESH_TOKEN", ""),
        "SPOTIFY_DEVICE_ID": os.environ.get("SPOTIFY_DEVICE_ID", ""),
        "SPOTIFY_DEFAULT_TRACK_ID": os.environ.get("SPOTIFY_DEFAULT_TRACK_ID", "3cfOd4CMv2snFaKAnMdnvK"),
    }

    print("Specific Environment Variables:")
    print(specific_env_vars)

    # Launch each microservice in a separate tmux session
    for service in microservices:
        name = service["name"]
        command = service["command"]

        # Pass the specific environment variables to the function
        run_in_tmux(name, command, env_vars=specific_env_vars)

        print(f"{name} microservice launched.")

    # Inform the user that all microservices have been launched
    print("All microservices have been launched in separate tmux sessions.")
    print()

    # List all running tmux sessions (microservices)
    print("Running tmux sessions (microservices):")
    list_running_sessions()
    print()

    # Print instructions for attaching and detaching from each session
    for service in microservices:
        name = service["name"]
        print_instructions(name)