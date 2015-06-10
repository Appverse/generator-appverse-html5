FROM node:latest 

RUN npm i -g http-server  

ADD . generator-appverse-html5

WORKDIR generator-appverse-html5

RUN npm test

CMD ["http-server", "generator-appverse-html5/coverage"]

EXPOSE 8080