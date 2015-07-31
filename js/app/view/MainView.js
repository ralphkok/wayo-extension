define([
    'templates/MainViewTemplate',
    'view/LinksView',
    'view/SendView'
], function (template,
             LinksView,
             SendView) {

    return Backbone.View.extend({

        tagName: 'div',
        id: 'main',

        linksView: null,
        sendView: null,

        events: {
            'click #btn-wayo': 'onWayo'
        },

        initialize: function(options) {

            this.autoBind();
        },

        render: function($el) {

            this.$el.append(template());
            $el.append(this.$el);

            this.linksView = new LinksView({el: this.$('ul')});
            this.sendView = new SendView();
        },

        onWayo: function() {
            this.sendView.render(this.$el);
        }

    });

});