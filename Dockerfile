FROM appverse/docker-appverse-html5-buildpack

# Add a yeoman user because grunt doesn't like being root
RUN adduser --disabled-password --gecos "" yeoman  \
    && echo "yeoman ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# set HOME so 'npm install' and 'bower install' don't write to /
ENV HOME /home/yeoman

ENV LANG en_US.UTF-8

RUN mkdir src && chown yeoman:yeoman src && npm i -g yo \
    && chown -R yeoman: ~/.npm \
    && chown -R yeoman: /usr/local/lib/node_modules


ADD . /home/yeoman/src/generator-appverse-html5
WORKDIR /home/yeoman/src/generator-appverse-html5
RUN npm install && npm link
CMD ["npm", "test"]