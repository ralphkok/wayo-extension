define([

], function() {

    var BackgroundComms = Backbone.Model.extend({

        initialize: function(options) {

            this.autoBind();
            chrome.runtime.onMessage.addListener(this.onMessage);
        },

        onMessage: function(request, sender, sendResponse) {

            switch (request.message) {

                case 'links':
                    this.trigger('links', request.data.links);
                    break;
            }
        },

        updatePollingData: function(userId, highestLinkId) {

            chrome.runtime.sendMessage({message: 'startPolling', data: {
                userId: userId,
                lastLinkId: highestLinkId
            }});
        }



    });
    return new BackgroundComms();

});