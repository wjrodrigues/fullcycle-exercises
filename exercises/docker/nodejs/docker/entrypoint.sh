#! /bin/sh

cd /api

cp .env-example .env

npm install

dockerize -wait tcp://database:3306 -timeout=120s

node main.js
