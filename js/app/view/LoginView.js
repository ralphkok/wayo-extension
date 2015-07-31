define([
    'templates/LoginViewTemplate',
    'model/UserModel',
    'md5'
], function (template,
             UserModel,
             md5) {

    return Backbone.View.extend({

        tagName: 'div',
        id: 'login',

        initialize: function(options) {

            this.autoBind();
            this.listenTo(UserModel, 'login:fail', this.onLoginFail);
        },

        render: function($el) {

            this.$el.append(template());
            $el.append(this.$el);

            this.$email = this.$el.find('input[name="email"]');
            this.$pass = this.$el.find('input[name="pass"]');

            this.$el.find('form').on('submit', this.onSubmit);
        },

        onSubmit: function(e) {

            if (e) e.preventDefault();
            UserModel.login(this.$email.val(), md5(this.$pass.val()));
        },

        onLoginFail: function() {

            // TODO: show error
            console.warn('Could not login');
        },

        hide: function() {

            this.stopListening(UserModel, 'login:fail');
            this.remove();
        }

    });

});