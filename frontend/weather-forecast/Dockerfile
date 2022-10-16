FROM node:latest 
WORKDIR /frontend
COPY . /frontend
RUN npm install &&\
	npm run build
EXPOSE 4000
