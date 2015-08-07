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
        filtersView: null,
        sendView: null,

        events: {
            'click #btn-wayo': 'onWayo',
            'click .btn-filter-mate': 'onChangeFilter',
            'click .btn-filter-unseen': 'onChangeFilter',
            'click .btn-filter-fav': 'onChangeFilter'
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

        onChangeFilter: function(e) {
            $(e.target).toggleClass('selected');
            this.updateFilters();
        },

        updateFilters: function() {
            this.linksView.setFilter({
                from_id: this.$('.filters .btn-filter-mate').hasClass('selected') ? null : null,
                unseen:  this.$('.filters .btn-filter-unseen').hasClass('selected'),
                is_fav:  this.$('.filters .btn-filter-fav').hasClass('selected')
            });
        }

    });

});