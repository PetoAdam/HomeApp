# HOME APP

## Target

A full stack application that allows its users to check and alter their home IoT capable devices. Currently using a Raspberry PI as server and a micro:bit as thermometer. More features are to be added later. The project aims to add the option to run the server in a cloud environment too.

## Used technologies

The frontend is a website using ReactJS.
The backend is written in .NET 6.
The communication between them is currently a REST API that uses authentication and authorization (currently only accepting google sign in, more options are under development).
The Micro:bit is programmed via python3. The Raspberry sends the gathered data towards the server (localhost in the current configuration) via the REST API provided by the backend. This makes it possible to run the server in cloud - if there is no possible way to set up a local server. 

## Getting started

**How to install and run the project?**

For the backend:   
- make sure .NET 6 is installed, the project should run both on Linux and Windows
- set the environment variables JWT_SIGNING_KEY, CLIENT_ID, CLIENT_SECRET. The CLIENT_ID and CLIENT_SECRET should be available through the project's Google Cloud page. (If you have no access to the page, please create a new project, set it up with your domain and alter the addresses used in the project to the ones you have both in Google Cloud and the repository. In Google Cloud you should create an OAuth 2.0 Client ID if you want to use the google sign-in option.)
- Run 
    - On Linux

        ```
        dotnet build
        ```
        then
        ```
        dotnet run
        ```
        from the Backend/Homeapp folder
    - On Windows

        Just open the Backend project via Visual Studio and start it.

For the frontend:
- Run
    ```
    npm install
    ```
    and then
    ```
    npm run
    ```
    from the Frontend/homeapp directory

For the Microbit:
- Run
    ```
    uflash microbit.py  
    ```
    and 
    ```
    python3 rasp.py
    ```
    from the TemperatureQuery folder.
    Make sure the Raspberry and the Micro:bit is connected via USB. (Bluetooth communication is under development)

NGINX (Linux) :
- To make the backend and frontend run properly without having to use ports explicity, NGINX has been set up to re-route the incoming requests. To set up nginx via APT run the ```sudo apt install nginx``` command. If you use other package managers, please check how NGINX can be installed. After installing, two rules have to be set up in the /etc/nginx/sites-available/default file. You can use your own files as well, but for simple projects like this, the default file should be good enough. Insert this snippet inside the server instance:
    ```
    location / {
        proxy_pass http://127.0.0.1:3000;
    }

    location /api {
        proxy_pass http://127.0.0.1:5001;
    }
    ```
 - Make sure to remove the default ```location /``` value too.
 - After making the changes link the file to NGINX via:
    ```
    sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/
    ```
    and restart NGINX with the command:
    ```
    sudo service nginx restart
    ```

Database:
- The project is using MySQL (MariaDB) to store data, the database is called microbittest. It is protected by user + password, where the user is set to "root", and the password is set to "rootpassword". You can alter these settings anytime, but make sure to apply those changes to the [appsettings.json](Backend/HomeApp/appsettings.json) file in the Backend project. To initialize or reset the database run the code from the [reset.sql](Backend/HomeApp/SQL/reset.sql) script. On Linux MySQL can be downloaded via ```sudo apt install mysql-server```. Then it can be accessed via ```sudo mysql```. Make sure to set up user "root" and password "rootpassword" and add the database microbittest. Then, to access it you can run ```sudo mysql -u root -p```. After entering the password "rootpassword" run ```use microbittest``` to set the database to microbittest.

If everything is done properly you should be able to use the project.


