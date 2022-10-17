# WeatherForecast 

## DEMO 

### The project uses
* Backend: Django 3.2.9
* Frontend: Angular 13.3.5
* PostgreSQL latest
* Python 3.8.10
* Node 18.1.0
* Docker
* Docker Compose

### Uses ports
* Django      - 8000 
* Angular     - 4000 
* PostgreSQL  - 5000

<hr>

### Install Docker:
* Install Docker: https://docs.docker.com/engine/install/
* Install Docker Compose: https://docs.docker.com/compose/install/

### For project deployment:
* docker-compose build --no-cache
* docker-compose up   

### Apply migration and populate the database:
* sudo docker exec -it wf_backend python manage.py migrate
* sudo docker exec -it wf_backend ./manage.py loaddata psql_dump.json

### Delete docker containers.

### Delete images:
* docker rmi $(docker images -a -q) 

### Delete conteiners:
* docker rm $(docker ps -a -f status=exited -q)

### Or

### Delete all conteiners and images:
* sudo docker system prune -a 

<hr>

### The project will start:
* http://localhost:4000/

<hr>

### Testing data
User credential data for different type of users

### Admin
* login:    root@gmail.com
* password: 12345

### User
* login:    user@gmail.com
* password: 12345

<hr>
