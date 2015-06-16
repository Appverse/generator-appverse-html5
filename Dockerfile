FROM node:latest

# Add a yeoman user because grunt doesn't like being root
RUN adduser --disabled-password --gecos "" yeoman && echo "yeoman ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers 

# set HOME so 'npm install' and 'bower install' don't write to /
ENV HOME /home/yeoman

ENV LANG en_US.UTF-8

VOLUME ["/home/yeoman/src/generator-appverse-html5"]

RUN chown yeoman:yeoman /src

RUN npm i -g yo bower grunt-cli 

RUN chown -R yeoman: ~/.npm
RUN chown -R yeoman: /usr/local/lib/node_modules

RUN git config --global url."https://".insteadOf git:// 

RUN npm install && npm link && mkdir generated && chmod 777 generated 

WORKDIR generated

CMD ["grunt", "karma:unit"]