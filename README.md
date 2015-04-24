## [Appverse HTML5](http://appverse.org/)
![](http://appversed.files.wordpress.com/2012/12/logo.png)

### generator-appverse-html5 

This is a Yeoman Generator for Appverse - HTML5
 
* Install yeoman if it is not installed previously.

```bash
npm install -g yo
```

* Install the Appverse HTML5 generator NPM package. 

```bash
npm install -g generator-appverse-html5
```

* Create a new project using the generator-appverse-html5

```bash
mkdir testApp
```

```bash
cd testApp
```

```bash
yo appverse-html5
```

Yeoman will generate a boilerplate project with Appverse - HTML5. 
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

### Sub-generators

* REST 
Add the Appverse REST module to the project. 
Can add a MOCK REST Server (json-server).

```bash
yo appverse-html5:rest
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

```bash
yo appverse-html5:cache 
```

* Detection  

```bash
yo appverse-html5:detection 
```

* Performance

```bash
yo appverse-html5:performance    
```
* Logging   

```bash 
yo appverse-html5:logging 
```

* Server Push 

```bash 
yo appverse-html5:serverpush    
```

* Translation  

```bash 
yo appverse-html5:translate
```

* Security  

```bash 
yo appverse-html5:security
```

* QR  

```bash
yo appverse-html5:qr
```

* Add a new view  

```bash
yo appverse-html5:app-view $viewname
```

* Add a new REST entity  
The subgenerator will require REST module installed. 

It will create:
  * A view to manage the Rest entity
  * A controller for the view
  * A MOCK JSON file if the MOCK REST server was selected.

```bash
yo appverse-html5:rest-entity $entityname
```

* Node-Webkit 
Add Node-Webkit support to the project.

```bash
yo appverse-html5:webkit
```

Package your application with Grunt as an executable file. 

```bash
grunt nodewebkit:dist
``` 

Start your application using the Node-Webkit browser

```bash
npm start 
```


### Bootstrap theme selector 
The Appverse HTML5 generator allows to select a bootstrap theme from [Bootswatch](http://bootswatch.com) using the [Bootswatch API](https://bootswatch.com/help/)

* The Appverse HTML5 generator will connect to bootswatch to get the available themes list. 
* It will apply the selected Bootswatch theme to the generated project.

#### Subgenerator
* Bootstrap theme selector from bootswatch.com

```bash
yo appverse-html5:bootstrap-theme
```

### Arguments and options

It's possible to call the gerenetor using arguments and skipping prompts.

* The first argument is the application name. 

```bash
yo appverse-html5 myWeb
```

* Sub-generator are optional arguments 

```bash
yo appverse-html5 myWeb --cache --rest
```

or 

```bash
yo appverse-html5 --cache --rest
```

and the name will be set by default with the current folder name. 

* Generate the project calling all sub-generators.

```bash
yo appverse-html5 myWeb --all
```

#### Skip install
Add the skip-install argument to skip npm and bower install process. 

```bash
yo appverse-html5 myWeb --skip-install
```


[Appverse HTML5 Showcase](https://appverse.gftlabs.com/showcase-html5/#/home)

> [Yeoman](http://yeoman.io) generator


## Getting Started

### What is Yeoman?

Trick question. It's not a thing. It's this guy:

![](http://i.imgur.com/JHaAlBJ.png)

Basically, he wears a top hat, lives in your computer, and waits for you to tell him what kind of application you wish to create.

Not every new computer comes with a Yeoman pre-installed. He lives in the [npm](https://npmjs.org) package repository. You only have to ask for him once, then he packs up and moves into your hard drive. *Make sure you clean up, he likes new and shiny things.*

```bash
npm install -g yo
```

### Yeoman Generators

Yeoman travels light. He didn't pack any generators when he moved in. You can think of a generator like a plug-in. You get to choose what type of application you wish to create, such as a Backbone application or even a Chrome extension.

To install generator-appverse-html5 from npm, run:

```bash
npm install -g generator-appverse-html5
```

Finally, initiate the generator:

```bash
yo appverse-html5
```

### Getting To Know Yeoman

Yeoman has a heart of gold. He's a person with feelings and opinions, but he's very easy to work with. If you think he's too opinionated, he can be easily convinced.

If you'd like to get to know Yeoman better and meet some of his friends, [Grunt](http://gruntjs.com) and [Bower](http://bower.io), check out the complete [Getting Started Guide](https://github.com/yeoman/yeoman/wiki/Getting-Started).


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
