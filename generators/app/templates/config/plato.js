module.exports = { 
    plato: {  
        options: {    
            jshint: require('fs').readFile('.jshintrc'),
            excludeFromFile: '.jshintignore'  
        },
          files: {    
            'reports': [      'Gruntfile.js',       'app/**/*.js',       'test/*.js',       'test/{e2e,unit}/**/*.js'    ]  
        } 
    }
};