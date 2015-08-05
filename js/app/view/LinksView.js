define([
    'model/UserModel',
    'templates/LinkTemplate',
    'commands/SetLinkSeenCommand',
    'commands/HideLinkCommand',
    'commands/GetLinkMetaDataCommand',
    'commands/FavLinkCommand'
], function (UserModel,
             ItemTemplate,
             SetLinkSeenCommand,
             HideLinkCommand,
             GetLinkMetaDataCommand,
             FavLinkCommand) {

    return Backbone.View.extend({

        events: {
            'click li': 'onClickLink',
            'click li button.fav': 'onFavLink',
            'click li button.remove': 'onRemoveLink'
        },

        initialize: function(options) {

            this.autoBind();

            UserModel.get('links').received
                .on('add', this.onAddReceivedLink)
                .on('remove', this.onRemoveReceivedLink);

            GetLinkMetaDataCommand.on('complete', this.onLinkMetaDataLoaded);

            UserModel.get('links').received.fetch();
        },

        onClickLink: function(e) {

            var $target = $(e.target);

            if (!$target.is('button')) {

                $target = $target.closest('li');
                var url = $target.attr('data-url'),
                    id = $target.attr('data-id');

                if ($target.hasClass('unseen')) {
                    $target.removeClass('unseen');
                    SetLinkSeenCommand.execute(id);
                }

                chrome.tabs.create({url: url});
            }
        },

        onLinkMetaDataLoaded: function(response, textStatus) {

        },

        onFavLink: function(e) {

            var $btn = $(e.target),
                links = UserModel.get('links').received,
                linkId = $btn.parent().data('id');

            $btn.toggleClass('selected');
            FavLinkCommand.execute(linkId, $btn.hasClass('selected'));
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

            var $items = this.$('li'),
                targetId = Number(model.id);
            if (!$items.length || Number($items.last().attr('data-id')) > targetId) this.$el.append(ItemTemplate(model));
            else {
                var inserted = false;
                for (var i = 0; i < $items.length; i++) {
                    if (Number($items.eq(i).attr('data-id')) < targetId) {
                        $items.eq(i).before(ItemTemplate(model));
                        inserted = true;
                        break;
                    }
                }
                if (!inserted) this.$el.append(ItemTemplate(model));
            }
        },

        onRemoveReceivedLink: function(model) {

            this.stopListening(HideLinkCommand, 'complete');
            this.stopListening(HideLinkCommand, 'error');

            var $item = $('li[data-id="' + model.get('id') + '"]', this.$el),
                $thisAndBelow = $('li[data-id="' + model.get('id') + '"] ~ li', this.$el),
                itemH = $item.outerHeight(true);

            $item.next().css({'border-top': $item.css('border-bottom')});

            TweenMax.to($item, 0.3, {
                css: { transform: 'translateX(' + (-this.$el.width()) + 'px)' },
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