FROM python:3.8
WORKDIR /backend
COPY . /backend
RUN apt-get update -y &&\
	pip install --upgrade pip &&\
	pip install --no-cache -r requirements.txt
