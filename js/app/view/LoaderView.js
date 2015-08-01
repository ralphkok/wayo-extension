define([

], function () {

    return Backbone.View.extend({

        tagName: 'div',
        className: 'loader',

        initialize: function(options) {

            this.autoBind();
        },

        render: function($el) {
            $el.append(this.$el);
        }

    });

});