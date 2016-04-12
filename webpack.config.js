var path = require('path');
var webpack = require('webpack');

module.exports = {
    cache: true,
    output: {
        filename: 'application.js'
    },
    plugins: [
        new webpack.PrefetchPlugin('react-bootstrap'),
        new webpack.PrefetchPlugin('react-color')

    ],
    module: {
        loaders: [{
            loader: 'babel',
            include: [
                path.resolve(__dirname, 'src/')
            ],
            query: {
                presets: ['es2015', 'react'],
                plugins: ["transform-object-rest-spread"],
                cacheDirectory: true
            }
        }]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};