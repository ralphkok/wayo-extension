define([

], function() {

    var GetLinksReceivedAfterCommand = (function() {

        var dispatcher = _.clone(Backbone.Events);

        this.on = function(events, callback, context) {
            dispatcher.on(events, callback, context);
        };

        this.off = function(events, callback, context) {
            dispatcher.off(events, callback, context);
        };

        this.execute = function(userId, linkId) {
            $.ajax({
                url: config.server + config.endpoints.linksReceivedAfter.replace('{id}', userId).replace('{link_id}', linkId),
                method: 'GET',
                cache: false,
                success: this.onResult,
                error: this.onError
            });
        };

        this.onResult = function(response, textStatus, jqXHR) {
            console.log('GetLinksReceivedAfterCommand::onResult', arguments);
            dispatcher.trigger('complete', response, textStatus);
        };

        this.onError = function(jqXHR, textStatus, errorThrown) {
            console.log('GetLinksReceivedAfterCommand::onError', arguments);
            dispatcher.trigger('error', textStatus, errorThrown);
        };

    });

    return new GetLinksReceivedAfterCommand();
});