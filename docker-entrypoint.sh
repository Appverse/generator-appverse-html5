#!/bin/bash

cd /home/yeoman/src/generator-appverse-html5 && npm install && npm link
chown -R yeoman /home/yeoman/.npm
chown -R yeoman /usr/local
su yeoman <<'EOF'
echo $(whoami)
echo "Generating a sample application..."
mkdir /home/yeoman/generated
chmod 777 /home/yeoman/generated
cd /home/yeoman/generated
# Generate application
yo appverse-html5 generated

# Add all modules
yo appverse-html5:module cache
yo appverse-html5:module rest --skip-prompts
yo appverse-html5:module logging
yo appverse-html5:module detection
yo appverse-html5:module performance
yo appverse-html5:module serverpush --skip-prompts
# yo appverse-html5:module security
yo appverse-html5:module translate
yo appverse-html5:module ionic
yo appverse-html5:module notifications
# yo appverse-html5:module native

# Add all components
yo appverse-html5:component view --name=test1
yo appverse-html5:component grid --target=test1
yo appverse-html5:component xeditable --target=test1
yo appverse-html5:component slider --target=test1
yo appverse-html5:component accordion --target=test1
yo appverse-html5:component collapse --target=test1
yo appverse-html5:component datepicker --target=test1
yo appverse-html5:component form --target=test1
yo appverse-html5:component chart --type=line --target=test1
yo appverse-html5:component view --name=test2 --menu=testMenu
yo appverse-html5:component grid --target=test2 --rows=25
yo appverse-html5:component chart --type=pie --target=test2
yo appverse-html5:component form --target=test1 --schema=/home/yeoman/src/generator-appverse-html5/test/data/entity-schema.json
yo appverse-html5:component crud --name=crud
yo appverse-html5:component chart --type=bar --target=crud
yo appverse-html5:component crud --name=crud2  --menu=crud2
yo appverse-html5:component chart --type=radar --target=crud2
yo appverse-html5:component crud --name=crud3 --schema=/home/yeoman/src/generator-appverse-html5/test/data/entity-schema.json
yo appverse-html5:component chart --type=doughnut --target=crud3
yo appverse-html5:component crud --name=crud4 --schema=/home/yeoman/src/generator-appverse-html5/test/data/entity-schema.json --rows=100
yo appverse-html5:component chart --type=polar-area --target=crud4
yo appverse-html5:component crud --name=crud5  --rows=100
yo appverse-html5:component crud --name=crud6  --rows=100 --menu=crud6

# Run test. Unit
grunt test

EOF
echo "Running..."
