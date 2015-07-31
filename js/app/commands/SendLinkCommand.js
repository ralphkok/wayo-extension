define([

], function() {

    var SendLinkCommand = (function() {

        var dispatcher = _.clone(Backbone.Events);

        this.on = function(events, callback, context) {
            dispatcher.on(events, callback, context);
        };

        this.off = function(events, callback, context) {
            dispatcher.off(events, callback, context);
        };

        this.execute = function(fromId, toId, url, comment) {
            $.ajax({
                url: config.endpoints.sendLink,
                method: 'POST',
                data: {
                    from_id: fromId,
                    to_id: toId,
                    url: url,
                    comment: comment
                },
                cache: false,
                success: this.onResult,
                error: this.onError
            });
        };

        this.onResult = function(response, textStatus, jqXHR) {
            console.log('SendLinkCommand::onResult', arguments);
            dispatcher.trigger('complete', response, textStatus);
        };

        this.onError = function(jqXHR, textStatus, errorThrown) {
            console.log('SendLinkCommand::onError', arguments);
            dispatcher.trigger('error', textStatus, errorThrown);
        };

    });

    return new SendLinkCommand();
});