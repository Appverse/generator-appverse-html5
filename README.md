## [Appverse HTML5](http://appverse.org/)
![](http://appversed.files.wordpress.com/2012/12/logo.png)

### generator-appverse-html5 

This is a Yeoman Generator for Appverse - HTML5

The generator is not yet published. Follow the steps below to test it. 

1) Download the code 

* Install yeoman if it is not installed previously.

```bash
  npm install -g yo
```
2) On the downloaded code folfer execute: 

```bash
npm link
```

That will create a symlink to the npm cache. 

3) Create a new project using the generator-appverse-html5

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

### Sub-generators

* REST 
```bash
yo appverse-html5:rest
```
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
yo appverse-html5:app-view
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

MIT
