module.exports = {
    options: {
        basePath: 'app',
        templates: {
            html: {
                js: '<script src="{filePath}"></script>',
                css: '<link rel="stylesheet" type="text/css" href="{filePath}" />',
            }
        }
    },
    myTarget: {
            files: {
                'app/index.html': 'app/index.html'
            }
        }
}