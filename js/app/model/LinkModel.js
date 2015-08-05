define([

], function () {

    return Backbone.Model.extend({

        defaults: {
            id: null,
            from_id: null,
            to_id: null,
            comment: null,
            url: null,
            data: null,
            date_sent: null,
            date_seen: null,
            is_fav: null
        },

        initialize: function(options) {

            this.autoBind();
            console.log(this.attributes);
        }

    });

});