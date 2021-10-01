#!/bin/sh
#./public folder currently excluded from linting
./node_modules/.bin/eslint *.js routes/*.js src/*.js
