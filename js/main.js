require.config({
    urlArgs: "bust=" + (new Date()).getTime(),
    paths: {
                //tries to load jQuery from Google's CDN first and falls back
                //to load locally
        "jquery": ["http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min",
                    "libs/jquery/src/jquery"],
        "underscore": "libs/underscore/underscore",
        "backbone": "libs/backbone/backbone"
    },
    shim: {
        "backbone": {
            deps: ["jquery", "underscore"],
            exports: "Backbone"
        }
    },
    waitSeconds: 10
});
require(['jquery', 'underscore', 'backbone', 'app'], function(jquery, _, Backbone, App){
    new App;
});