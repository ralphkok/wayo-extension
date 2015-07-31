define([
    'templates/SendViewTemplate',
    'model/AppModel',
    'model/UserModel',
    'commands/SendLinkCommand'
], function (template,
             AppModel,
             UserModel,
             SendLinkCommand) {

    return Backbone.View.extend({

        tagName: 'div',
        id: 'send',

        $inputUrl: null,
        $inputComment: null,
        $btnSend: null,

        isSending: false,

        events: {
            'focus input[name="url"]': 'onFocusUrl',
            'blur input[name="url"]': 'onBlurUrl',
            'click li': 'onToggleMate',
            'click .btn-send': 'onRequestSend',
            'click .btn-close': 'onRequestClose'
        },

        initialize: function(options) {

            this.autoBind();

            SendLinkCommand.on('complete', this.onSendLinkComplete);
            SendLinkCommand.on('error', this.onSendLinkError);
        },

        render: function($el) {

            this.$el.empty();
            this.$el.append(template({
                url: AppModel.get('currentTab') ? AppModel.get('currentTab').url : '',
                mates: UserModel.get('mates')
            }));
            $el.append(this.$el);

            this.$inputUrl = this.$el.find('input[name="url"]');
            this.$inputComment = this.$el.find('input[name="comment"]');
            this.$btnSend = this.$el.find('.btn-send');

            this.delegateEvents();
        },

        onFocusUrl: function() {
            $(window).on('keydown', this.onChangeUrl);
        },

        onBlurUrl: function() {
            $(window).off('keydown', this.onChangeUrl);
        },

        onChangeUrl: function() {
            this.setSendEnabled();
        },

        onToggleMate: function(e) {

            var $target = $(e.target).closest('li');
            $target.toggleClass('selected');
            this.setSendEnabled();
        },

        setSendEnabled: function() {

            this.$btnSend.toggleClass('disabled', this.isSending || !this.$inputUrl.val() || this.$el.find('.mates li.selected').length == 0);
            this.$btnSend.text(this.isSending ? 'Sending...' : 'Send');
        },

        onRequestSend: function() {

            var ids = [];
            this.$el.find('.mates li.selected').each(function() {
                ids.push($(this).attr('data-id'));
            });

            if (!ids.length) return;

            // TODO: show loader
            this.isSending = true;
            this.setSendEnabled();

            SendLinkCommand.execute(UserModel.get('id'), ids[0], this.$inputUrl.val(), this.$inputComment.val());
        },

        onSendLinkComplete: function() {

            this.isSending = false;
            this.setSendEnabled();

            this.hide();
        },

        onSendLinkError: function() {

            this.isSending = false;
            this.setSendEnabled();
        },

        onRequestClose: function() {

            this.hide();
        },

        hide: function() {

            this.$el.empty();
            this.remove();
            this.undelegateEvents();
        }

    });

});