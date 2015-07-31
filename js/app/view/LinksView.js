define([
    'model/UserModel',
    'templates/LinkTemplate',
    'commands/SetLinkSeenCommand',
    'commands/HideLinkCommand',
    'commands/GetLinkMetaDataCommand'
], function (UserModel,
             ItemTemplate,
             SetLinkSeenCommand,
             HideLinkCommand,
             GetLinkMetaDataCommand) {

    return Backbone.View.extend({

        events: {
            'click li .link': 'onClickLink',
            'click li button.remove': 'onRemoveLink'
        },

        initialize: function(options) {

            this.autoBind();

            UserModel.get('links').received
                .on('add', this.onAddReceivedLink)
                .on('remove', this.onRemoveReceivedLink);

            UserModel.get('links').sent
                .on('add', this.onAddSentLink)
                .on('remove', this.onRemoveSentLink);

            GetLinkMetaDataCommand.on('complete', this.onLinkMetaDataLoaded);

            UserModel.get('links').received.fetch();
        },

        onClickLink: function(e) {

            var $target = $(e.target);
            if ($target.is('button')) return;
            if (!$target.hasClass('link')) $target = $target.closest('.link');
            var $li = $target.parents('li');
            $li.removeClass('unseen');
            SetLinkSeenCommand.execute($li.data('id'));
            window.open($target.data('url'), '_blank');
        },

        onLinkMetaDataLoaded: function(response, textStatus) {

        },

        onRemoveLink: function(e) {

            var $btn = $(e.target),
                links = UserModel.get('links').received,
                linkId = $btn.parent().data('id');

            $btn.hide();

            this.listenTo(HideLinkCommand, 'complete', function() {
                links.remove(linkId);
            });
            this.listenTo(HideLinkCommand, 'error', function() {
                $btn.show();
            });

            HideLinkCommand.execute(UserModel.get('id'), linkId);
        },

        onAddReceivedLink: function(model) {
            model = model.toJSON();
            model.sender = _.find(UserModel.get('mates'), function(item) { return item.id.toString() == model.from_id.toString(); }).name;
            model.receiver = UserModel.get('name');
            model.incoming = true;
            this.$el.append(ItemTemplate(model));
            // TODO: check if it should be appended or prepended
        },

        onRemoveReceivedLink: function(model) {

            this.stopListening(HideLinkCommand, 'complete');
            this.stopListening(HideLinkCommand, 'error');

            var $item = $('li[data-id="' + model.get('id') + '"]', this.$el),
                $thisAndBelow = $('li[data-id="' + model.get('id') + '"] ~ li', this.$el),
                itemH = $item.outerHeight(true);

            $item.next().css({'border-top': $item.css('border-bottom')});

            TweenMax.to($item, 0.3, {
                css: { transform: 'translateX(' + (-this.$listReceived.width()) + 'px)' },
                ease: Cubic.easeOut
            });

            TweenMax.to($thisAndBelow, 0.4, {
                y: -itemH,
                delay: 0.25,
                onComplete: this.onItemRemoveComplete,
                onCompleteParams: [$item, $thisAndBelow],
                ease: Cubic.easeOut
            });
        },

        onItemRemoveComplete: function($item, $itemAndBelow) {
            $item.next().css({'border-top': ''});
            $item.remove();
            TweenMax.set($itemAndBelow, {y: 0, clearProps: 'transform'});
        }

    });

});