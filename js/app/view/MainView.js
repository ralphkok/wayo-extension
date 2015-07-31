define([
    'templates/MainViewTemplate',
    'view/LinksView',
    'view/SendView',
    'commands/SetLinkSeenCommand'
], function (template,
             LinksView,
             SendView,
             SetLinkSeenCommand) {

    return Backbone.View.extend({

        tagName: 'div',
        id: 'main',

        linksView: null,
        sendView: null,

        events: {
            'click #btn-wayo': 'onWayo',
            'click li': 'onClickLink'
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
        },

        onClickLink: function(e) {
            var $target = $(e.target).closest('li'),
                url = $target.attr('data-url'),
                id = $target.attr('data-id');

            if ($target.hasClass('unseen')) {
                $target.removeClass('unseen');
                SetLinkSeenCommand.execute(id);
            }

            chrome.tabs.create({url: url});
        }

    });

});