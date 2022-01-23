#!/bin/bash

#docker build . -t cristianchilipirea/chilipirea.ro
#docker push cristianchilipirea/chilipirea.ro
docker container run -d -v "$PWD"/www:/usr/local/apache2/htdocs -p 80:80 --name chilipirea.ro cristianchilipirea/chilipirea.ro