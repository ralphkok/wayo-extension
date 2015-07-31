define([
    'model/LinkModel'
], function(LinkModel) {

    return Backbone.Collection.extend({

        model: LinkModel,

        parse: function(response) {

            _.each(response, function(model) {
                if (_.has(model, 'data')) {
                    model.data = JSON.parse(model.data);
                }
            });
            return response;
        }

    });

});