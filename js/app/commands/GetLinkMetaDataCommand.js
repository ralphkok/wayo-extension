define([

], function() {

    var GetLinkMetaDataCommand = (function() {

        var dispatcher = _.clone(Backbone.Events);

        this.on = function(events, callback, context) {
            dispatcher.on(events, callback, context);
        };

        this.off = function(events, callback, context) {
            dispatcher.off(events, callback, context);
        };

        this.execute = function(url) {
            $.ajax({
                url: config.endpoints.baseUrl + config.endpoints.getLinkMeta,
                method: 'POST',
                data: {url: url},
                cache: false,
                success: this.onResult,
                error: this.onError
            });
        };

        this.onResult = function(response, textStatus, jqXHR) {
            console.log('GetLinkMetaDataCommand::onResult', arguments);
            dispatcher.trigger('complete', response, textStatus);
        };

        this.onError = function(jqXHR, textStatus, errorThrown) {
            console.log('GetLinkMetaDataCommand::onError', arguments);
            dispatcher.trigger('error', textStatus, errorThrown);
        };

    });

    return new GetLinkMetaDataCommand();
});