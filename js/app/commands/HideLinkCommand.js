define([

], function() {

    var HideLinkCommand = (function() {

        var dispatcher = _.clone(Backbone.Events);

        this.on = function(events, callback, context) {
            dispatcher.on(events, callback, context);
        };

        this.off = function(events, callback, context) {
            dispatcher.off(events, callback, context);
        };

        this.execute = function(userId, linkId) {
            $.ajax({
                url: config.endpoints.hideLink,
                method: 'POST',
                data: {
                    user_id: userId,
                    link_id: linkId
                },
                cache: false,
                success: this.onResult,
                error: this.onError
            });
        };

        this.onResult = function(response, textStatus, jqXHR) {
            console.log('HideLinkCommand::onResult', arguments);
            dispatcher.trigger('complete', response, textStatus);
        };

        this.onError = function(jqXHR, textStatus, errorThrown) {
            console.log('HideLinkCommand::onError', arguments);
            dispatcher.trigger('error', textStatus, errorThrown);
        };

    });

    return new HideLinkCommand();
});