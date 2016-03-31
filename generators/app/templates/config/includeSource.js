module.exports = {
    options: {
        basePath: '<%= paths.app %>',
        templates: {
            html: {
                js: '<script src="{filePath}"></script>',
                css: '<link rel="stylesheet" type="text/css" href="{filePath}" />',
            }
        }
    },
    myTarget: {
            files: {
                '<%= paths.app %>/index.html': '<%= paths.app %>/index.html'
            }
        }
}