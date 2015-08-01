define([
    'commands/LoginCommand',
    'commands/SendLinkCommand',
    'commands/GetLinksReceivedAfterCommand',
    'collection/LinkCollection'
], function (LoginCommand,
             SendLinkCommand,
             GetLinksReceivedAfterCommand,
             LinkCollection) {

    var UserModel = Backbone.Model.extend({

        defaults: {
            id: null,
            name: null,
            email: null,
            img: null,
            mates: null,
            links: null,
            isNew: false
        },

        initialize: function(options) {

            this.autoBind();

            this.set({
                mates: [],
                links: {
                    received: new LinkCollection,
                    sent: new LinkCollection
                }
            });

            LoginCommand.on('complete', this.onLogin);
            LoginCommand.on('error', this.onLoginFail);

            SendLinkCommand.on('complete', this.onLinkSent);

            GetLinksReceivedAfterCommand.on('complete', this.onLinksReceivedAfter);
        },

        login: function(email, pass) {
            this.set({email: email, pass: pass});
            LoginCommand.execute(email, pass);
        },

        onLogin: function(user) {
            if (user) {
                this.set({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    img: user.img,
                    isNew: user['is_new'],
                    mates: user.mates
                });
                this.get('links').received.url = config.endpoints.receivedLinks.replace('{id}', user.id);
                this.get('links').sent.url = config.endpoints.sentLinks.replace('{id}', user.id);
                this.trigger('login:success');

                setInterval(this.pollForLinks, 1000 * 30 * 1);
            }
            else this.onLoginFail();
        },

        onLoginFail: function() {
            this.trigger('login:fail');
        },

        onLinkSent: function(response, textStatus) {
            this.get('links').sent.add(response);
        },

        pollForLinks: function() {
            GetLinksReceivedAfterCommand.execute(this.get('id'), this.get('links').received.max(function(link){ return Number(link.get('id')); }).get('id'));
        },

        onLinksReceivedAfter: function(response) {
            if (!response) return;
            this.get('links').received.add(response);
        }

    });

    return new UserModel();
});