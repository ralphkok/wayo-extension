define([

], function() {

    var AppModel = Backbone.Model.extend({

        defaults: {

        },

        initialize: function(options) {

            this.autoBind();
        }

    });

    return new AppModel();
});