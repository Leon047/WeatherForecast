# WeatherForecast 

> DEMO 


## Table of Contents

- [Description](#description)
- [Used](#used)
- [Install](#install)
- [Delete](#delete)
- [Starts](#starts)


## Description

A website to get the weather forecast for the location name entered 
and save it if you are an authorized user.


## Used

The project uses the openweather API.
- [OpenWeather API](https://openweathermap.org/api)

The project uses
* Backend: Django 3.2.9
* Frontend: Angular 13.3.5
* PostgreSQL latest
* Python 3.8.10
* Node 18.1.0
* Docker
* Docker Compose

Uses ports
* Django      - 8000 
* Angular     - 4000 
* PostgreSQL  - 5000


## Install 

- Install: [Docker](https://docs.docker.com/engine/install/)
- Install: [Docker Compose](https://docs.docker.com/compose/install/)

For project deployment:
```sh
docker-compose build --no-cache
```
```sh
docker-compose up
```   

Apply migration and populate the database:
```sh
docker exec -it wf_backend python manage.py migrate
```
```sh
docker exec -it wf_backend ./manage.py loaddata psql_dump.json
```


## Delete 

Delete images:
```sh
docker rmi $(docker images -a -q)
```

Delete conteiners:
```sh
docker rm $(docker ps -a -f status=exited -q)
```

Or

Delete all conteiners and images:
```sh
docker system prune -a
``` 


## Starts

The project will start:
- [WeatherForecast](http://localhost:4000/)

Testing
> User credential data for different type of users

Admin:
* login:    root@gmail.com
* password: 12345

User:
* login:    user@gmail.com
* password: 12345

