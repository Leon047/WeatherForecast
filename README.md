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

[![Python](https://img.shields.io/static/v1?label=Python&message=v3.8.10&color=00CC11)](https://www.python.org/downloads/release/python-3811/)
[![Django](https://img.shields.io/static/v1?label=Django&message=v3.2.9&color=D75627)](https://docs.djangoproject.com/en/4.1/releases/3.2.9/)
[![Angular](https://img.shields.io/static/v1?label=Angular&message=v13.3.5&color=FF1300)](https://angular.io/start)
[![Node](https://img.shields.io/static/v1?label=Node&message=v18.1.0&color=D7E726)](https://nodejs.org/en/)
[![PostgreSQL](https://img.shields.io/static/v1?label=PostgreSQL&message=vlatest&color=007DD1)](https://www.postgresql.org/)

API:
- [OpenWeather API](https://openweathermap.org/api)

Ports:
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

