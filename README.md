## [Appverse HTML5](http://appverse.org/) 
![](http://appversed.files.wordpress.com/2012/12/logo.png)

![](https://img.shields.io/npm/v/generator-appverse-html5.svg) ![](https://img.shields.io/npm/dm/generator-appverse-html5.svg) ![](https://img.shields.io/npm/l/generator-appverse-html5.svg) 

### generator-appverse-html5 

This is a Yeoman Generator for Appverse - HTML5 

[![NPM](https://nodei.co/npm/generator-appverse-html5.png)](https://nodei.co/npm/generator-appverse-html5/)

[![NPM](https://nodei.co/npm-dl/generator-appverse-html5.png?months=1)](https://nodei.co/npm/generator-appverse-html5)



Requirements
-------------
**Nodejs** and **NPM** package manager must be installed.

* Install **bower** and **grunt-cli**.

```bash
    $ npm install -g bower grunt-cli
```
 
* Install **yeoman** if it is not installed previously.

```bash
    $ npm install -g yo
```

Installing 
-------------

* Install the Appverse HTML5 generator NPM package. 

```bash
    $ npm install -g generator-appverse-html5
```

Running 
-------------

* Create a new project using the **generator-appverse-html5**

Create a directoy:

```bash
    $ mkdir testApp
```

```bash
    $ cd testApp
```
Execute the generator:

```bash
    $ yo appverse-html5
```

Yeoman will generate a boilerplate project with **Appverse - HTML5**. 
Execute grunt to test it:

```bash
    $ grunt server
```
or

```bash
    $ grunt server:open 
```

to auto open your default browser with the application.

#### From sources
* Get sources from [GitHub](https://github.com/appverse/generator-appverse-html5)

* Link the package 

```bash
    $ npm link
```

That will create a symlink to your npm cache. 
Now you can execute the generator:

```bash
    $ yo appverse-html5
```

### Subgenerators 
-----------------
#### Module
Later on you can add any of the Appverse modules to your project running the module subgenerator.

```bash
    $ yo appverse-html5:module [name]
```

Type --help option for available module list

```bash
    $ yo appverse-html5:module --help
```

##### Module list 
 
* REST 
Adds the Appverse REST module to the project. 
Add a MOCK REST Server ([json-server](https://github.com/typicode/json-server)) as well.

```bash
    $ yo appverse-html5:module rest
```

Mock server adds two new grunt tasks:

```bash
    $ grunt mockserver
```

Runs the application using the mock JSON server as REST backend, and:

```bash
    $ grunt mockserver:open
```

Runs the application using the mock JSON server as REST backend and open the default browser.

* Cache   
* Detection  
* Performance
* Logging   
* Server Push 
* Translation  
* Security  
* QR  


* Add a new view  
Execute the app-view subgenerator with the view name as argument. The subgenerator will create the HTML view and the JS controller. 
A new option in the navigation bar will be created as well. 

```bash
    $ yo appverse-html5:app-view $viewname
```

The menu option will used to add the option to a dropdown menu in the navigation bar. If the dropdown menu already exists, the new option will be added, if not exists it will be created.

```bash
    $ yo appverse-html5:app-view $viewname --menu=$dropdownmenu
```

* Add a new REST entity  
The subgenerator will require REST module installed. 

It will create:
  * A view to manage the Rest entity
  * A controller for the view
  * A MOCK JSON file if the MOCK REST server was selected.
  * A new option in the navigation bar.

```bash
    $ yo appverse-html5:rest-entity $entityname
```

The menu option will add or update a dropdown menu.

```bash
    $ yo appverse-html5:rest-entity $entityname --menu=$dropdownmenu
```

The schema option will be used to generate the entity form (add and edit)

```bash
    $ yo appverse-html5:rest-entity $entityname --schema=$url or path to json-schema
```

The rows options will be used to generate mock data.

```bash
    $ yo appverse-html5:rest-entity $entityname --schema=$json-schema --rows=$n
```


* Node-Webkit 
Add Node-Webkit support to the project.

```bash
    $ yo appverse-html5:webkit
```

Package your application with Grunt as an executable file. 

```bash
    $ grunt nodewebkit:dist
``` 

Start your application using the Node-Webkit browser

```bash
    $ npm start 
```

* Mobile
Add Mobile builds to your project with grunt.
   * Configure your build server and credentials. 
   
```bash
    $ yo appverse-html5:mobile
```

Execute: 

```bash
    $ grunt dist:mobile
``` 

The **grunt taks** will:
  * Create your mobile bundle
  * Upload the result to the build server
  * Download the package from the build server for each plattform. (Android, iOS or Windows Phone)
  

### Bootstrap theme selector 
The Appverse HTML5 generator allows to select a [Bootstrap](http://getbootstrap.com) theme.

* The Appverse HTML5 generator will connect to the theme provider to get the available themes list. 
* The subgenerator will connect to the provider SCSS URL's to get the files. 
* It will apply the selected theme to the generated project.

The required API format will be a JSON with theme list and scss files, like:

```json
    {
     "version": "0.0.1",
     "themes": [
     {
      "name": "theme-name",
      "description": "My theme",
      "scss": "http://server/_theme.scss",
      "scssVariables": "http://server/_variables.scss"
    },
    ...
    ]
   }
```

#### Subgenerator
* [Bootstrap](http://getbootstrap.com) theme selector.

```bash
    $ yo appverse-html5:bootstrap-theme    
```

The generator will provide the configuration with the .yo-rc.json file to the generated project. 
The bootsrap-theme subgenerator will read that configuration to get the theme selector. For example, to use the [Bootswatch](http://bootswatch.com) API:

```json
    {
    "generator-appverse-html5": {
        "appPath": "app",
        "bootstrap-theme": {
            "provider": { 
                 "name": "bootswatch", 
                 "api": "http://api.bootswatch.com/3" 
            }
        }
    }
    }
```


### Arguments and options

It's possible to call the gerenetor using arguments and skipping prompts.

* The first argument is the application name. 

```bash
    $ yo appverse-html5 myWeb
```

### Project JSON - Schema 
It's possible to call the gerenetor using a JSON defition as argument. That will skip prompting by the generator. 
The JSON could be a file or URL. 

```bash
    $ yo appverse-html5 --project=myProject.json 
```

The JSON definition must be a valid definition.
The generator will perform a JSON validation using the [appverse-html5 project definition JSON schema](https://raw.githubusercontent.com/Appverse/generator-appverse-html5/master/app/schema/appverse-project-schema.json)

####Example 
This is an example of JSON a project file, selecting all the avaliable options for the generator. 

```json
{
    "project": "myTestProject",
    "components": {
        "serverpush": {
            "enabled": true,
            "config": {
                "serverURL": "127.0.0.1"
            }
        },
        "rest": {
            "enabled": true,
            "config": {
                "backend": {
                    "host": "mybackendhost",
                    "port": 8080
                },
                "mock": {
                    "host": "127.0.0.1",
                    "port": 9888
                }
            }
        },
        "cache": {
            "enabled": true
        },
        "logging": {
            "enabled": true
        },
        "performance": {
            "enabled": true
        },
        "detection": {
            "enabled": true
        },
        "qr": {
            "enabled": true
        },
        "translate": {
            "enabled": true
        },
        "security": {
            "enabled": true
        }
    },
    "theme": {
        "enabled": true,
        "config": {
            "scss": "http://bootswatch.com/cerulean/_bootswatch.scss",
            "scssVariables": "http://bootswatch.com/cerulean/_variables.scss"
        }
    },
    "build": {
        "imagemin": {
            "enabled": true
        }
    },
    "package": {
        "webkit": {
            "enabled": true
        },
        "mobile": {
            "enabled": true,
            "config": {
                "builder": {
                    "hostname": "http://hostname",
                    "username": "username",
                    "password": "password"
                }
            }
        }
    }
}

```



#### Skip install
Add the skip-install argument to skip npm and bower install process. 

```bash
    $ yo appverse-html5 --skip-install  
```

```bash
    $ yo appverse-html5 --project=myProject.json --skip-install  
```

```bash
    $ yo appverse-html5 myWeb --skip-install    
```

The generator will execute 'grunt list' tasks when finish to report all the available grunt tasks into the README.md of the generated project. 
If --skip-install was used, 'grunt list' wont be executed, as it needs node_modules. 

```bash
    $ npm install 
```

```bash
    $ grunt list
```


## Appverse Showcase
[Appverse HTML5 Showcase](https://appverse.gftlabs.com/showcase-html5/#/home)


## License

Copyright (c) 2012 GFT Appverse, S.L., Sociedad Unipersonal.

 This Source  Code Form  is subject to the  terms of  the Appverse Public License 
 Version 2.0  ("APL v2.0").  If a copy of  the APL  was not  distributed with this 
 file, You can obtain one at <http://appverse.org/legal/appverse-license/>.

 Redistribution and use in  source and binary forms, with or without modification, 
 are permitted provided that the  conditions  of the  AppVerse Public License v2.0 
 are met.

 THIS SOFTWARE IS PROVIDED BY THE  COPYRIGHT HOLDERS  AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS  OR IMPLIED WARRANTIES, INCLUDING, BUT  NOT LIMITED TO,   THE IMPLIED
 WARRANTIES   OF  MERCHANTABILITY   AND   FITNESS   FOR A PARTICULAR  PURPOSE  ARE
 DISCLAIMED. EXCEPT IN CASE OF WILLFUL MISCONDUCT OR GROSS NEGLIGENCE, IN NO EVENT
 SHALL THE  COPYRIGHT OWNER  OR  CONTRIBUTORS  BE LIABLE FOR ANY DIRECT, INDIRECT,
 INCIDENTAL,  SPECIAL,   EXEMPLARY,  OR CONSEQUENTIAL DAMAGES  (INCLUDING, BUT NOT
 LIMITED TO,  PROCUREMENT OF SUBSTITUTE  GOODS OR SERVICES;  LOSS OF USE, DATA, OR
 PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT(INCLUDING NEGLIGENCE OR OTHERWISE) 
 ARISING  IN  ANY WAY OUT  OF THE USE  OF THIS  SOFTWARE,  EVEN  IF ADVISED OF THE 
 POSSIBILITY OF SUCH DAMAGE.
