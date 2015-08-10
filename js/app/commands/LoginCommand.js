define([

], function() {

    var LoginCommand = (function() {

        var dispatcher = _.clone(Backbone.Events);

        this.on = function(events, callback, context) {
            dispatcher.on(events, callback, context);
        };

        this.off = function(events, callback, context) {
            dispatcher.off(events, callback, context);
        };

        this.execute = function(email, pass) {
            $.ajax({
                url: config.server + config.endpoints.login,
                method: 'POST',
                data: {email: email, pass: pass},
                cache: false,
                success: this.onResult,
                error: this.onError
            });
        };

        this.onResult = function(response, textStatus, jqXHR) {
            console.log('LoginCommand::onResult', arguments);
            dispatcher.trigger('complete', response, textStatus);
        };

        this.onError = function(jqXHR, textStatus, errorThrown) {
            console.log('LoginCommand::onError', arguments);
            dispatcher.trigger('error', textStatus, errorThrown);
        };

    });

    return new LoginCommand;
});