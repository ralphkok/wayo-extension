require.config({

    baseUrl: "js/",

    paths: {
        // vendor
        'requireLib':           'vendor/requirejs/require',
        'jquery':               'vendor/jquery/dist/jquery',
        'underscore':           'vendor/underscore/underscore',
        'backbone':             'vendor/backbone/backbone',
        'backbone-super':       'vendor/backbone-super/backbone-super/backbone-super',
        'handlebars.runtime':   'vendor/handlebars/handlebars.runtime',
        'tweenmax':             'vendor/greensock/TweenMax',
        'md5':                  'vendor/blueimp-md5/js/md5',
        // plugins
        'backbone-autoBind':    'plugins/backboneAutoBind',
        // directories
        'collection':           'app/collection',
        'model':                'app/model',
        'view':                 'app/view',
        'commands':             'app/commands',
        'util':                 'app/util',
        'templates':            'build/templates'
    }
});

require([
    'jquery',
    'underscore',
    'backbone',
    'backbone-super',
    'backbone-autoBind',
    'tweenmax'
], function() {

    require(['app/view/AppView'], function(AppView) {
        new AppView();
    });
});