## [Appverse HTML5](http://appverse.org/)
![](http://appversed.files.wordpress.com/2012/12/logo.png)

![](https://img.shields.io/npm/v/generator-appverse-html5.svg) ![](https://img.shields.io/npm/dm/generator-appverse-html5.svg) ![](https://img.shields.io/npm/l/generator-appverse-html5.svg)
[![Dependency Status](https://img.shields.io/david/appverse/generator-appverse-html5.svg?style=flat-square)](https://david-dm.org/appverse/generator-appverse-html5)
[![devDependency Status](https://img.shields.io/david/dev/appverse/generator-appverse-html5.svg?style=flat-square)](https://david-dm.org/appverse/generator-appverse-html5#info=devDependencies)
[![Inline docs](http://inch-ci.org/github/appverse/generator-appverse-html5.svg)](http://inch-ci.org/github/appverse/generator-appverse-html5)

### generator-appverse-html5

This is a [Yeoman](http://yeoman.io) Generator for Appverse - HTML5

[![NPM](https://nodei.co/npm/generator-appverse-html5.png)](https://nodei.co/npm/generator-appverse-html5/)

[![NPM](https://nodei.co/npm-dl/generator-appverse-html5.png?months=1)](https://nodei.co/npm/generator-appverse-html5)



Requirements
-------------
**Nodejs** and **NPM** package manager must be installed.

* Install **bower** and **grunt-cli**.

```bash
    npm install -g bower grunt-cli
```

* Install **yeoman** if it is not installed previously.

```bash
    npm install -g yo
```

Installing
-------------

* Install the Appverse HTML5 generator NPM package.

```bash
    npm install -g generator-appverse-html5
```

Running
-------------

* Create a new project using the **generator-appverse-html5**

  Create a directoy:

    ```bash
    mkdir testApp
    ```

    ```bash
    cd testApp
    ```

    Execute the generator:

    ```bash
        yo appverse-html5
    ```

    [Yeoman](http://yeoman.io) will generate a boilerplate project with **Appverse - HTML5**.

    Execute grunt to test it:

    ```bash
        grunt server
    ```
    or
    ```bash
        grunt server:open
    ```

    to auto open your default browser with the application.



#### From sources
* Get sources from [GitHub](https://github.com/appverse/generator-appverse-html5)

* Link the package

```bash
    npm link
```

That will create a symlink to your npm cache.
Now you can execute the generator:

```bash
    yo appverse-html5
```

Test:

* Mocha

```bash
    mocha
```
* Istanbul

```bash
    npm test
```


### Subgenerators
-----------------
#### Module
Later on you can add any of the Appverse modules to your project running the module subgenerator.

```bash
    yo appverse-html5:module [<name>]
```

Where *name* is the module name you want to add.

Type --help option for available module list

```bash
    yo appverse-html5:module --help
```

##### Module list

* **REST**: Adds the Appverse REST module to the project. The Integrated REST module includes communication. It is based on [Restangular](https://github.com/mgonto/restangular). Params configuration are set in app-configuration file as constants.

    Add a MOCK REST Server ([json-server](https://github.com/typicode/json-server)) as well.

    ```bash
        yo appverse-html5:module rest
    ```

    Mock server adds two new grunt tasks:

    ```bash
        grunt server:mock
    ```

    Runs the application using the mock JSON server as REST backend, and:

    ```bash
        grunt server:mock:open
    ```

    Runs the application using the mock JSON server as REST backend and open the default browser.

* **Cache**: The Cache module includes several types of cache
  * Scope Cache: To be used in a limited scope. It does not persist when navigation.
  * Browser Storage: It handles short strings into local or session storage. Access is synchronous.
  * IndexedDB: It initializes indexed database at browser to handle data structures. Access is asynchronous.
  * Http Cache: It initializes cache for the $httpProvider. $http service instances will use this cache.

    ```bash
        yo appverse-html5:module cache
    ```

* **Detection**: Provides browser and network detection.

    ```bash
        yo appverse-html5:module detection
    ```

* **Performance**: Services to handle usage of several performance elements
     * Webworkers. Multithreaded-parallelized execution of tasks separated of the main JavaScript thread.
     * High Performance UI directives support.

    ```bash
        yo appverse-html5:module performance
    ```

* **Logging**: Handles several tasks with logging:
     * It applies a decorator on native $log service in module ng.
     * It includes sending of log events to server-side REST service.

        * Server side log

            To handle JavaScript errors, we needed to intercept the core AngularJS error handling and add a server-side communication aspect to it.

        * Decorator way

            The $provide service (which provides all angular services) needs 2 parameters to “decorate” something:

            1) the target service

            2) the callback to be executed every time someone asks for the target.

            This way, we are telling in config time to [AngularJS](https://docs.angularjs.org/guide) that every time a service/controller/directive asks for $log instance [AngularJS](https://docs.angularjs.org/guide) will   provide the result of the callback. As you can see, we are passing the original $log and formattedLogger (the API implementation) to the callback, and then, he returns a formattedLogger factory instance.

    ```bash
        yo appverse-html5:module logging
    ```

* **Server Push**: This module handles server data communication when it pushes them to the client exposing the factory SocketFactory, which is an API for instantiating sockets that are integrated with Angular's digest cycle.
It is now based on [SocketIO](http://socket.io/)

    ```bash
        yo appverse-html5:module serverpush
    ```

* **Translation**: The Internationalization module handles languages in application.

```bash
    yo appverse-html5:module translate
```

* **Security**: [appverse-web-html5-scurity](https://github.com/Appverse/appverse-web-html5-security) Appverse Web Client Side security module based on HTML5 and Java Script

```bash
    yo appverse-html5:module security
```

* **QR** [Angular-QR](https://github.com/janantala/angular-qr ) QR code generator for [AngularJS](https://docs.angularjs.org/guide)

```bash
    yo appverse-html5:module qr
```

#### Component
The component subg-generator allows you to add UI components to your project or to target components.

You can type --help to get the full available component list.

```bash
    yo appverse-html5:component --help
```

* **view**: Add a new component (view & controller)
Execute the subgenerator with the view name as argument. The subgenerator will create the HTML view and the [AngularJS](https://docs.angularjs.org/guide) controller.
A new option in the navigation bar will be created as well.

    ```bash
        yo appverse-html5:component view --name=[<name>]
    ```
    Where *name* is the View/Controller name you want to add.

    The menu option will used to add the option to a dropdown menu in the navigation bar. If the dropdown menu already exists, the new option will be added, if not exists it will be created.

    ```bash
        yo appverse-html5:component view --name=[<name>]  --menu=[<dropdownmenu>]
    ```

    Where *name* is the View/Controller name you want to add.
    Where *dropdownmenu* is the target dropdown menu name where want to add your navigation.

Once a View/Controller is created, we can add different components to the new page.

* **collapse**: Collapse from [UI Bootstrap](http://angular-ui.github.io/bootstrap/). [AngularJS](https://docs.angularjs.org/guide) version of Bootstrap's collapse plugin. Provides a simple way to hide and show an element with a css transition

    ```bash
        yo appverse-html5:component collapse --target=[<view>]
    ```

      Where *view* is the target View/Controller name where you want to include your component.

* **accordion**: Accordion from [UI Bootstrap](http://angular-ui.github.io/bootstrap/). The accordion directive builds on top of the collapse directive to provide a list of items, with collapsible bodies that are collapsed or expanded by clicking on the item's header.

    ```bash
        yo appverse-html5:component accordion --target=[<view>]
    ```

    Where *view* is the target View/Controller name where you want to include your component.

* **chart**: Adds a chart [Angular-ChartJS](http://jtblin.github.io/angular-chart.js) to the target view.

    Chart types: line,bar,doughnut,radar,pie,polar-area

    ```bash
        yo appverse-html5:component chart --type=[type] --target=[<view>]
    ```

    Where *view* is the target View/Controller name where you want to include your component.
    Where *type* is the chart type.

* **grid**: Adds [ag-grid](http://www-ag-grid.com/) grid to the view.

    ```bash
        yo appverse-html5:component grid --target=[<view>]
    ```

    The sub-generator will create 10 rows of mock data for the generated Grid, use the **rows** option to set the numbers of rows you want to generate.

    ```bash
        yo appverse-html5:component grid --target=[<view>] --rows=[<nrows>]
    ```

    Where *nrows* is the number of rows to generate.

* **form**: Add a Form component to the target view.

    ```bash
        yo appverse-html5:component form --target=[<view>]
    ```

    By default the **form** sub-generator will create a simple form with id and name fields.
    Use the **schema** option, with a JSON Schema file path or URL to generate HTML Form from the [JSON Schema](http://json-schema.org/) provided.

    ```bash
        yo appverse-html5:component form --target=[<view>]  --schema=[<schema.json>]
    ```

* **modal**: Modal views from [UI Bootstrap](http://angular-ui.github.io/bootstrap/).

    ```bash
        yo appverse-html5:component modal --target=[<view>]
    ```

* **slider**: Adds [RZSlider](https://github.com/rzajac/angularjs-slider), slider directive for AngularJS.

    ```bash
        yo appverse-html5:component slider --target=[<view>]
    ```

* **tabs**: Adds a Tabs snippet to the target view.

    ```bash
        yo appverse-html5:component tabs --target=[<view>]
    ```

* **xeditable**: Adds [editable elements](http://vitalets.github.io/angular-xeditable/)

    ```bash
        yo appverse-html5:component xeditable --target=[<view>]
    ```

* **datepicker**: Date picker component from [UI Bootstrap](http://angular-ui.github.io/bootstrap/).

    ```bash
        yo appverse-html5:component datepicker --target=[<view>]
    ```

* **crud**: The sub-generator will create a REST CRUD component

    * A view to manage the Rest entity
    * A controller for the view
    * A MOCK JSON file for the mock server.
    * A new option in the navigation bar.

    ```bash
        yo appverse-html5:component crud --name=[<name>]
    ```
    The **menu** option will add or update a dropdown menu.

    ```bash
        yo appverse-html5:component crud --name=[<name>] --menu=[<menu>]
    ```
    By default the **form** sub-generator will create a simple form with id and name fields.
    Use the **schema** option will be used to generate the entity form (add and edit)

    ```bash
        yo appverse-html5:component crud --name=[<name>] --schema=[<path or url to JSON Schema>]
    ```
    Add the **rows** option to generate some fake data rows at the mock server.

    ```bash
        yo appverse-html5:component crud --name=[<name>] --rows=[<nrows>]
    ```

    The **rows** option could be combined with the **schema** option, so the fake data generator will use the entity definition found at the schema.

    ```bash
        yo appverse-html5:component crud --name=[<name>] --schema=[<path or url to JSON Schema>] --rows=[<nrows>]
    ```


#### Build

* Node-Webkit
Add Node-Webkit support to the project.

```bash
    yo appverse-html5:build webkit
```

Package your application with Grunt as an executable file.

```bash
    grunt nodewebkit:dist
```

Start your application using the Node-Webkit browser

```bash
    npm start
```

* Mobile
Add [Appverse Mobile](https://github.com/Appverse/appverse-mobile) builds to your project with grunt.

```bash
    yo appverse-html5:build mobile
```
Execute:

```bash
    grunt dist:mobile
```

The **grunt taks** will:
  * Create your mobile bundle
  * Upload the result to the build server
  * Download the package from the build server for each plattform. (Android, iOS or Windows Phone)


* Imagemin
Minify images seamlessly. Adds [imagemin](https://github.com/imagemin/imagemin) dependencies and grunt tasks

```bash
    yo appverse-html5:build imagemin
```

#### Runtime
The Appverse HTML5 runtime subgenerator will add necesary [Docker](http://www.docker.com/) files to run your application using [Docker](http://www.docker.com/).
 * *Dockerfile* - It will provide a based [NGINX](http://nginx.org/) Dockerfile to run your *dist* folder.
 * *docker-compose.yml* - Docker compose file to run your project with a load balancer using [HAProxy](http://www.haproxy.org/).

The first step is to create your aplication distribution:

```bash
   grunt dist
```

Now, you have two options:

* Run the application using Docker

   * Build the image:

    ```bash
       docker build -t myapp/nginx .
    ```

   * Run:

    ```bash
       docker run -p 80:80 --name myapp -d myapp/nginx
    ```

    Where *myapp* is your application name. Then access the URL http://yourdockerhost

* Run the application with Docker-Compose and HAProxy image that balances between linked containers.

    ```bash
       docker-compose up -d
    ```
    Then access the URL http://yourdockerhost

    * Scale N instances
      For example, if you want to set up 3 instances of 'myapp' application:

      ```bash
         docker-compose scale myapp=3
         docker-compose up -d -force-recreate
      ```

      Then access the URL http://yourdockerhost, and load balancer will use the 3 instances. You can access the HAProxy dashboard with http://yourdockerhost:1936 to check load balancer metrics.


#### Theme
The Appverse HTML5 generator allows to switch the [Appverse Theme](https://github.com/Appverse/Appverse-Bootstrap-Sass-Theme).
The **theme** subgenerator will prompt the user to select one of both Appverse themes.

[Bootswatch](https://bootswatch.com/) themes are included as well, the subgenerator will connect to [Bootswatch API](https://bootswatch.com/api/3.json) to get the available theme list.

Execution:

```bash
    yo appverse-html5:theme
```

### Arguments and options

It's possible to call the gerenetor using arguments and skipping prompts.

* The first argument is the application name.

```bash
    $ yo appverse-html5 myWeb
```

### Project as JSON - Schema
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
    "modules": {
        "serverpush": {
            "enabled": false,
            "config": {
                "BaseUrl": "127.0.0.1"
            }
        },
        "rest": {
            "enabled": false,
            "config": {
                "restBaseUrl": "mybackendhost",
                "restBaseUrlPort": 8000,
                "mockServerPort": 8888
            }
        },
        "cache": {
            "enabled": true
        },
        "logging": {
            "enabled": false
        },
        "performance": {
            "enabled": false
        },
        "detection": {
            "enabled": false
        },
        "qr": {
            "enabled": false
        },
        "translate": {
            "enabled": false
        },
        "security": {
            "enabled": false
        }
    },
    "theme": {
        "enabled": false,
        "config": {
            "scss": "http://bootswatch.com/cerulean/_bootswatch.scss",
            "scssVariables": "http://bootswatch.com/cerulean/_variables.scss"
        }
    },
    "builds": {
        "imagemin": {
            "enabled": false
        },
        "webkit": {
            "enabled": false
        },
        "mobile": {
            "enabled": false,
            "config": {
                "hostname": "http://hostname",
                "username": "username",
                "password": "password"
            }
        }
    }
}
```

#### Skip install
Add the skip-install argument to skip npm and bower install process.

```bash
    yo appverse-html5 --skip-install
```

```bash
    yo appverse-html5 --project=myProject.json --skip-install
```

```bash
    yo appverse-html5 myWeb --skip-install
```

The generator will execute 'grunt list' tasks when finish to report all the available grunt tasks into the README.md of the generated project.
If --skip-install was used, 'grunt list' wont be executed, as it needs node_modules.

```bash
    npm install
```

```bash
    grunt list
```

###Troubleshoting

* Browser-Sync

Browser-Sync is a tool for synchronized cross-device testing; useful when you’re targeting the multi-device web.
Having trouble installing Browsersync on Windows? The most common reason for npm to throw errors when compiling **Browser-Sync** is that some of the dependencies (e.g. node-gypneed Visual C++ runtime libraries.The way to resolve this is to install [Visual Studio](https://www.visualstudio.com). At the time of this writing (Feb 2015) the compilation works fine with Visual Studio 2013 Update 4. You can then tell **npm** which version of Visual Studio you are using by the following command:

```bash
   npm install -g browser-sync --msvs_version=2013
```

  With [Visual Studio 2015](https://www.visualstudio.com)

  ```bash
      npm install -g browser-sync --msvs_version=2015
  ```

  This package depends on socket.io, follow this link to solve installation problems with socket.io or other packages that executes C++ compilation on postinstall script: [fix-node-gyp-rebuild-error-on-windows](https://www.robertkehoe.com/2015/03/fix-node-gyp-rebuild-error-on-windows)

* node-gyp

Some dependant pagackages use **node-gyp**, a cross-platform command-line tool written in Node.js for compiling native addon modules for Node.js.
* On Unix:
  python (v2.7 recommended, v3.x.x is not supported)
  make
  A proper C/C++ compiler toolchain, like GCC
* On Mac OS X:
  python (v2.7 recommended, v3.x.x is not supported) (already installed on Mac OS X)
  Xcode
  You also need to install the Command Line Tools via Xcode. You can find this under the menu Xcode -> Preferences -> Downloads
  This step will install gcc and the related toolchain containing make
* On Windows:
  * Python (v2.7.3 recommended, v3.x.x is not supported)
    Make sure that you have a PYTHON environment variable, and it is set to drive:\path\to\python.exe not to a folder
  * Windows XP/Vista/7:
    [Microsoft Visual Studio C++ 2013](https://www.visualstudio.com) (Express version works well)
    If the install fails, try uninstalling any C++ 2010 x64&x86 Redistributable that you have installed first
    If you get errors that the 64-bit compilers are not installed you may also need the compiler update for the Windows SDK 7.1
  * Windows 7/8:
    [Microsoft Visual Studio C++ 2013](https://www.visualstudio.com) for Windows Desktop (Express version works well)**
  * All Windows Versions
    For 64-bit builds of node and native modules you will also need the **Windows 7 64-bit SDK**
    You may need to run one of the following commands if your build complains about WindowsSDKDir not being set, and you are sure you have already installed the SDK:

    call "C:\Program Files\Microsoft SDKs\Windows\v7.1\bin\Setenv.cmd" /Release /x86
    call "C:\Program Files\Microsoft SDKs\Windows\v7.1\bin\Setenv.cmd" /Release /x64


## Appverse Showcase
[Appverse HTML5 Showcase](https://appverse.gftlabs.com/showcase-html5/new)


## License

Copyright (c) 2012 GFT Appverse, S.L., Sociedad Unipersonal.

 This Source  Code Form  is subject to the  terms of  the Appverse Public License
 Version 2.0  ("APL v2.0").  If a copy of  the APL  was not  distributed with this
file, You can obtain one at <http://appverse.org/#/license/information>.

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
