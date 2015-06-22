FROM node:latest

# Add a yeoman user because grunt doesn't like being root
RUN adduser --disabled-password --gecos "" yeoman && echo "yeoman ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# set HOME so 'npm install' and 'bower install' don't write to /
ENV HOME /home/yeoman

ENV LANG en_US.UTF-8

RUN mkdir src && chown yeoman:yeoman src && npm i -g yo bower grunt-cli && chown -R yeoman: ~/.npm && chown -R yeoman: /usr/local/lib/node_modules

RUN git config --global url."https://".insteadOf git://

ADD . /home/yeoman/src/generator-appverse-html5

WORKDIR /home/yeoman/src/generator-appverse-html5

RUN npm install && npm link && mkdir /home/yeoman/generated && chmod 777 /home/yeoman/generated && cd /home/yeoman/generated

WORKDIR /home/yeoman/generated

RUN yo appverse-html5 generated && pwd && ls -la

CMD ["grunt", "karma:unit"]
